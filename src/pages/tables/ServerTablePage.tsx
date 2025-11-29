import * as React from "react";
import { Link } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowLeft,
  MoreHorizontal,
  Package,
  DollarSign,
  Calendar,
  Tag,
  RefreshCw,
} from "lucide-react";
import {
  ServerTable,
  type ServerTableState,
} from "../../components/data-display/table";
import { Button } from "../../components/overlay/Button";
import { Badge } from "../../components/data-display/Badge";

// Types for our demo data
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
}

// Generate deterministic pseudo-random numbers
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate a large dataset (simulating a database)
function generateFullDataset(): Product[] {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Health",
    "Automotive",
  ];

  const adjectives = [
    "Premium",
    "Basic",
    "Deluxe",
    "Professional",
    "Compact",
    "Advanced",
    "Classic",
    "Modern",
  ];

  const nouns = [
    "Widget",
    "Gadget",
    "Device",
    "Tool",
    "Kit",
    "Set",
    "Pack",
    "Bundle",
  ];

  const statuses: ("in_stock" | "low_stock" | "out_of_stock")[] = [
    "in_stock",
    "low_stock",
    "out_of_stock",
  ];

  const data: Product[] = [];

  for (let i = 0; i < 500; i++) {
    const seed = i + 1;
    const adjective = adjectives[Math.floor(seededRandom(seed) * adjectives.length)];
    const noun = nouns[Math.floor(seededRandom(seed * 2) * nouns.length)];
    const category = categories[Math.floor(seededRandom(seed * 3) * categories.length)];
    const status = statuses[Math.floor(seededRandom(seed * 4) * statuses.length)];

    data.push({
      id: `PRD-${String(i + 1).padStart(6, "0")}`,
      name: `${adjective} ${noun} ${i + 1}`,
      category,
      price: Math.floor(seededRandom(seed * 5) * 500) + 9.99,
      stock: status === "out_of_stock" ? 0 : Math.floor(seededRandom(seed * 6) * 1000),
      status,
      lastUpdated: new Date(
        2024 - Math.floor(seededRandom(seed * 7) * 2),
        Math.floor(seededRandom(seed * 8) * 12),
        Math.floor(seededRandom(seed * 9) * 28) + 1
      ).toISOString().split("T")[0],
    });
  }

  return data;
}

// Simulated API function
interface FetchProductsParams {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  globalFilter: string;
  columnFilters: { id: string; value: unknown }[];
}

interface FetchProductsResponse {
  data: Product[];
  pageCount: number;
  total: number;
}

// Full dataset (simulating a database)
const fullDataset = generateFullDataset();

function simulateFetchProducts(
  params: FetchProductsParams
): Promise<FetchProductsResponse> {
  return new Promise((resolve) => {
    // Simulate network latency (300-800ms)
    const delay = 300 + Math.random() * 500;

    setTimeout(() => {
      let filteredData = [...fullDataset];

      // Apply global filter
      if (params.globalFilter) {
        const search = params.globalFilter.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.id.toLowerCase().includes(search) ||
            item.name.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search)
        );
      }

      // Apply column filters
      params.columnFilters.forEach((filter) => {
        if (filter.value) {
          filteredData = filteredData.filter((item) => {
            const value = item[filter.id as keyof Product];
            return String(value)
              .toLowerCase()
              .includes(String(filter.value).toLowerCase());
          });
        }
      });

      // Apply sorting
      if (params.sorting.length > 0) {
        const { id, desc } = params.sorting[0];
        filteredData.sort((a, b) => {
          const aVal = a[id as keyof Product];
          const bVal = b[id as keyof Product];
          if (aVal < bVal) return desc ? 1 : -1;
          if (aVal > bVal) return desc ? -1 : 1;
          return 0;
        });
      }

      // Calculate pagination
      const total = filteredData.length;
      const pageCount = Math.ceil(total / params.pageSize);
      const start = params.pageIndex * params.pageSize;
      const end = start + params.pageSize;
      const data = filteredData.slice(start, end);

      resolve({ data, pageCount, total });
    }, delay);
  });
}

// Column definitions
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "Product ID",
    cell: ({ row }) => (
      <span
        className="font-[number:var(--font-medium)]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <Package className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
        <span className="font-[number:var(--font-medium)]">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <Tag className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
        <span>{row.getValue("category")}</span>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <div className="flex items-center gap-[length:var(--spacing-1)]">
          <DollarSign className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
          <span>{price.toFixed(2)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <span style={{ color: stock > 100 ? "var(--color-success)" : stock > 0 ? "var(--color-warning)" : "var(--color-error)" }}>
          {stock.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colorScheme =
        status === "in_stock"
          ? "success"
          : status === "low_stock"
          ? "warning"
          : "error";
      const label =
        status === "in_stock"
          ? "In Stock"
          : status === "low_stock"
          ? "Low Stock"
          : "Out of Stock";
      return (
        <Badge variant="solid" colorScheme={colorScheme}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastUpdated") as string);
      return (
        <div className="flex items-center gap-[length:var(--spacing-2)]">
          <Calendar className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
          <span>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </Button>
    ),
  },
];

// Filter form component
function FilterForm() {
  return (
    <div className="flex flex-col gap-[length:var(--spacing-4)]">
      <div>
        <label
          className="block text-[length:var(--text-sm)] font-[number:var(--font-medium)] mb-[length:var(--spacing-2)]"
          style={{ color: "var(--color-text)" }}
        >
          Category
        </label>
        <select
          className="w-full px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Sports">Sports</option>
          <option value="Books">Books</option>
          <option value="Toys">Toys</option>
          <option value="Health">Health</option>
          <option value="Automotive">Automotive</option>
        </select>
      </div>

      <div>
        <label
          className="block text-[length:var(--text-sm)] font-[number:var(--font-medium)] mb-[length:var(--spacing-2)]"
          style={{ color: "var(--color-text)" }}
        >
          Status
        </label>
        <select
          className="w-full px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div>
        <label
          className="block text-[length:var(--text-sm)] font-[number:var(--font-medium)] mb-[length:var(--spacing-2)]"
          style={{ color: "var(--color-text)" }}
        >
          Price Range
        </label>
        <div className="flex gap-[length:var(--spacing-2)]">
          <input
            type="number"
            placeholder="Min"
            className="flex-1 px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <input
            type="number"
            placeholder="Max"
            className="flex-1 px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Server Table Demo Page
 * Demonstrates the ServerTable component with simulated API calls.
 * Features debounced search to prevent rapid API calls.
 */
export default function ServerTablePage() {
  const [data, setData] = React.useState<Product[]>([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [requestCount, setRequestCount] = React.useState(0);

  // Fetch data on state change
  const fetchData = React.useCallback(async (state: ServerTableState) => {
    setIsLoading(true);
    setRequestCount((prev) => prev + 1);

    const result = await simulateFetchProducts({
      pageIndex: state.pagination.pageIndex,
      pageSize: state.pagination.pageSize,
      sorting: state.sorting,
      globalFilter: state.globalFilter,
      columnFilters: state.columnFilters,
    });

    setData(result.data);
    setPageCount(result.pageCount);
    setIsLoading(false);
  }, []);

  // Initial fetch
  React.useEffect(() => {
    fetchData({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      globalFilter: "",
      columnFilters: [],
    });
  }, [fetchData]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-[length:var(--spacing-6)] py-[length:var(--spacing-4)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[length:var(--spacing-4)]">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1
                  className="text-[length:var(--text-2xl)] font-[number:var(--font-bold)]"
                  style={{ color: "var(--color-text)" }}
                >
                  Server-Side Data Table
                </h1>
                <p
                  className="text-[length:var(--text-sm)]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Simulated API calls with debounced search (300ms delay)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[length:var(--spacing-2)]">
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                style={{ color: "var(--color-text-muted)" }}
              />
              <span
                className="text-[length:var(--text-sm)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                API Requests: {requestCount}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-[length:var(--spacing-6)] py-[length:var(--spacing-8)]">
        {/* Info Card */}
        <div
          className="rounded-[length:var(--radius-lg)] border p-[length:var(--spacing-4)] mb-[length:var(--spacing-6)]"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-[length:var(--text-lg)] font-[number:var(--font-semibold)] mb-[length:var(--spacing-2)]"
            style={{ color: "var(--color-text)" }}
          >
            How it works
          </h2>
          <ul
            className="list-disc list-inside space-y-1 text-[length:var(--text-sm)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <li>Only the current page data is fetched from the "server"</li>
            <li>
              <strong>Search is debounced</strong> - typing waits 300ms before
              making an API call
            </li>
            <li>Pagination and sorting trigger immediate API calls</li>
            <li>Watch the "API Requests" counter to see debouncing in action</li>
            <li>Try typing quickly in the search box - notice fewer requests!</li>
          </ul>
        </div>

        {/* Table */}
        <ServerTable
          data={data}
          columns={columns}
          pageCount={pageCount}
          isLoading={isLoading}
          onStateChange={fetchData}
          initialPageSize={10}
          searchPlaceholder="Search products... (debounced 300ms)"
          filterContent={<FilterForm />}
        />
      </main>
    </div>
  );
}

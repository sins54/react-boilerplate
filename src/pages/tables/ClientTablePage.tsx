import * as React from "react";
import { Link } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, MoreHorizontal, Mail, Phone, Building2 } from "lucide-react";
import { ClientTable } from "@/components/data-display/table";
import { Button } from "@/components/overlay/Button";
import { Badge } from "@/components/data-display/Badge";

// Types for our demo data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  status: "active" | "inactive" | "pending";
  salary: number;
  joinDate: string;
}

// Generate deterministic pseudo-random numbers for consistent demo data
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate 1000 rows of demo data
function generateDemoData(): User[] {
  const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  ];
  
  const departments = [
    "Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Legal", "Support"
  ];
  
  const statuses: ("active" | "inactive" | "pending")[] = ["active", "inactive", "pending"];
  
  const data: User[] = [];
  
  for (let i = 0; i < 1000; i++) {
    const seed = i + 1;
    const firstName = firstNames[Math.floor(seededRandom(seed) * firstNames.length)];
    const lastName = lastNames[Math.floor(seededRandom(seed * 2) * lastNames.length)];
    const department = departments[Math.floor(seededRandom(seed * 3) * departments.length)];
    const status = statuses[Math.floor(seededRandom(seed * 4) * statuses.length)];
    
    data.push({
      id: `USR-${String(i + 1).padStart(5, "0")}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone: `+1 ${Math.floor(seededRandom(seed * 5) * 900 + 100)}-${Math.floor(seededRandom(seed * 6) * 900 + 100)}-${Math.floor(seededRandom(seed * 7) * 9000 + 1000)}`,
      department,
      status,
      salary: Math.floor(seededRandom(seed * 8) * 100000 + 50000),
      joinDate: new Date(
        2020 + Math.floor(seededRandom(seed * 9) * 4),
        Math.floor(seededRandom(seed * 10) * 12),
        Math.floor(seededRandom(seed * 11) * 28) + 1
      ).toISOString().split("T")[0],
    });
  }
  
  return data;
}

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <Mail className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
        <span className="truncate max-w-[200px]">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <Phone className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
        <span>{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <Building2 className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
        <span>{row.getValue("department")}</span>
      </div>
    ),
    filterFn: "equals",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colorScheme =
        status === "active"
          ? "success"
          : status === "pending"
          ? "warning"
          : "default";
      return (
        <Badge variant="solid" colorScheme={colorScheme}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    filterFn: "equals",
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(salary);
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate") as string);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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
          Department
        </label>
        <select
          className="w-full px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
          <option value="Legal">Legal</option>
          <option value="Support">Support</option>
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      
      <div>
        <label
          className="block text-[length:var(--text-sm)] font-[number:var(--font-medium)] mb-[length:var(--spacing-2)]"
          style={{ color: "var(--color-text)" }}
        >
          Minimum Salary
        </label>
        <input
          type="number"
          placeholder="e.g. 75000"
          className="w-full px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>
      
      <div>
        <label
          className="block text-[length:var(--text-sm)] font-[number:var(--font-medium)] mb-[length:var(--spacing-2)]"
          style={{ color: "var(--color-text)" }}
        >
          Join Date Range
        </label>
        <div className="flex gap-[length:var(--spacing-2)]">
          <input
            type="date"
            className="flex-1 px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] rounded-[length:var(--radius-md)] text-[length:var(--text-sm)]"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <input
            type="date"
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
 * Client Table Demo Page
 * Demonstrates the ClientTable component with 1000 rows of data
 * featuring client-side sorting, filtering, and pagination.
 */
export default function ClientTablePage() {
  const data = React.useMemo(() => generateDemoData(), []);

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
                Client-Side Data Table
              </h1>
              <p
                className="text-[length:var(--text-sm)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                1000 rows with instant client-side filtering, sorting, and pagination
              </p>
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
            <li>All 1000 rows are loaded into memory at once</li>
            <li>Searching instantly filters the data client-side</li>
            <li>Click column headers to sort ascending/descending</li>
            <li>Click "Filter" to open the filter panel</li>
            <li>Use pagination controls to navigate through results</li>
          </ul>
        </div>

        {/* Table */}
        <ClientTable
          data={data}
          columns={columns}
          initialPageSize={20}
          searchPlaceholder="Search by name, email, department..."
          filterContent={<FilterForm />}
        />
      </main>
    </div>
  );
}

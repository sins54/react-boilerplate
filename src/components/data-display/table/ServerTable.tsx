import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  type SortingState,
  type PaginationState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { cn } from "../../../lib/utils";
import { TableFilterProvider } from "./TableFilterContext";
import { TableToolbar } from "./TableToolbar";
import { TablePagination } from "./TablePagination";
import { ActiveFiltersList, type ActiveFilter } from "./ActiveFiltersList";
import { FilterSheet } from "./FilterSheet";
import { DataTableBase } from "./DataTableBase";
import { TableSkeleton } from "./TableSkeleton";
import { TableEmptyState } from "./TableEmptyState";
import type { ServerTableProps, ServerTableState } from "./types";

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Server-side data table with external state management.
 * Triggers callbacks when pagination, sorting, or filtering changes.
 *
 * The component uses debouncing (300ms) for search/filter operations
 * to prevent rapid API calls while typing.
 *
 * @example
 * ```tsx
 * const [tableState, setTableState] = useState(initialState);
 * const { data, pageCount, isLoading } = useTableData(tableState);
 *
 * <ServerTable
 *   data={data}
 *   columns={columns}
 *   pageCount={pageCount}
 *   isLoading={isLoading}
 *   onStateChange={setTableState}
 * />
 * ```
 */
export function ServerTable<TData>({
  data,
  columns,
  pageCount,
  isLoading = false,
  onStateChange,
  initialState,
  className,
  hideSearch = false,
  hideFilter = false,
  searchPlaceholder,
  pageSizeOptions,
  initialPageSize = 10,
  filterContent,
  onApplyFilters,
  onResetFilters,
}: ServerTableProps<TData>) {
  // Internal state for immediate UI updates
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  );
  const [pagination, setPagination] = React.useState<PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: initialPageSize }
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  );
  const [globalFilter, setGlobalFilter] = React.useState(
    initialState?.globalFilter ?? ""
  );

  // Debounced values for search and filters
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const debouncedColumnFilters = useDebounce(columnFilters, 300);

  // Track if this is the initial render
  const isInitialMount = React.useRef(true);

  // Notify parent of state changes (debounced for search/filters)
  React.useEffect(() => {
    // Skip initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newState: ServerTableState = {
      pagination,
      sorting,
      globalFilter: debouncedGlobalFilter,
      columnFilters: debouncedColumnFilters,
    };

    onStateChange(newState);
  }, [
    pagination,
    sorting,
    debouncedGlobalFilter,
    debouncedColumnFilters,
    onStateChange,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // Convert column filters to ActiveFilter format
  const activeFilters: ActiveFilter[] = columnFilters.map((filter) => {
    const column = table.getColumn(filter.id);
    const header = column?.columnDef.header;
    const label = typeof header === "string" ? header : filter.id;
    return {
      id: filter.id,
      label,
      value: String(filter.value),
    };
  });

  const handleRemoveFilter = (filterId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const handleClearAllFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
  };

  const handleResetFilters = () => {
    setColumnFilters([]);
    onResetFilters?.();
  };

  const totalRows = pageCount * pagination.pageSize;

  return (
    <TableFilterProvider>
      <div className={cn("w-full", className)}>
        {/* Toolbar */}
        <TableToolbar
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          hideSearch={hideSearch}
          hideFilter={hideFilter}
          hasActiveFilters={columnFilters.length > 0}
        />

        {/* Active Filters */}
        <ActiveFiltersList
          filters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Loading State */}
        {isLoading ? (
          <div
            className="w-full rounded-[length:var(--radius-lg)] border p-[length:var(--spacing-4)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <TableSkeleton rows={pagination.pageSize} columns={columns.length} />
          </div>
        ) : data.length > 0 ? (
          <DataTableBase table={table} />
        ) : (
          <TableEmptyState />
        )}

        {/* Pagination */}
        {!isLoading && data.length > 0 && (
          <TablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalRows={totalRows}
            pageCount={pageCount}
            canPreviousPage={pagination.pageIndex > 0}
            canNextPage={pagination.pageIndex < pageCount - 1}
            onFirstPage={() =>
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }
            onPreviousPage={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(0, prev.pageIndex - 1),
              }))
            }
            onNextPage={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.min(pageCount - 1, prev.pageIndex + 1),
              }))
            }
            onLastPage={() =>
              setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }))
            }
            onPageSizeChange={(size) =>
              setPagination({ pageIndex: 0, pageSize: size })
            }
            pageSizeOptions={pageSizeOptions}
          />
        )}

        {/* Filter Sheet */}
        {filterContent && (
          <FilterSheet onApply={onApplyFilters} onReset={handleResetFilters}>
            {filterContent}
          </FilterSheet>
        )}
      </div>
    </TableFilterProvider>
  );
}

ServerTable.displayName = "ServerTable";

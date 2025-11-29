import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { cn } from "../../../lib/utils";
import { TableFilterProvider } from "./TableFilterContext";
import { TableToolbar } from "./TableToolbar";
import { TablePagination } from "./TablePagination";
import { ActiveFiltersList, type ActiveFilter } from "./ActiveFiltersList";
import { FilterSheet } from "./FilterSheet";
import { DataTableBase } from "./DataTableBase";
import { TableEmptyState } from "./TableEmptyState";
import type { ClientTableProps } from "./types";

/**
 * Client-side data table with built-in sorting, filtering, and pagination.
 * Handles all data operations in memory (client-side).
 *
 * @example
 * ```tsx
 * <ClientTable
 *   data={users}
 *   columns={columns}
 *   filterContent={<FilterForm />}
 * />
 * ```
 */
export function ClientTable<TData>({
  data,
  columns,
  className,
  hideSearch = false,
  hideFilter = false,
  searchPlaceholder,
  pageSizeOptions,
  initialPageSize = 10,
  filterContent,
  onApplyFilters,
  onResetFilters,
}: ClientTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
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

  const totalRows = table.getFilteredRowModel().rows.length;

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

        {/* Table */}
        {totalRows > 0 ? (
          <DataTableBase table={table} />
        ) : (
          <TableEmptyState />
        )}

        {/* Pagination */}
        {totalRows > 0 && (
          <TablePagination
            pageIndex={table.getState().pagination.pageIndex}
            pageSize={table.getState().pagination.pageSize}
            totalRows={totalRows}
            pageCount={table.getPageCount()}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
            onFirstPage={() => table.setPageIndex(0)}
            onPreviousPage={() => table.previousPage()}
            onNextPage={() => table.nextPage()}
            onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
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

ClientTable.displayName = "ClientTable";

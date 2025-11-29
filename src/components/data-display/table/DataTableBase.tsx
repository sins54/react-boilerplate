import {
  flexRender,
  type Table as TableType,
  type Header,
  type Row,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface DataTableBaseProps<TData> {
  /** TanStack Table instance */
  table: TableType<TData>;
  /** Additional class names */
  className?: string;
}

/**
 * Base table component that renders the actual table markup
 */
export function DataTableBase<TData>({
  table,
  className,
}: DataTableBaseProps<TData>) {
  return (
    <div
      className={cn(
        "w-full overflow-auto rounded-[length:var(--radius-lg)] border",
        className
      )}
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <table className="w-full caption-bottom text-[length:var(--text-sm)]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              {headerGroup.headers.map((header) => (
                <TableHeader key={header.id} header={header} />
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} row={row} />
            ))
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

interface TableHeaderProps<TData> {
  header: Header<TData, unknown>;
}

function TableHeader<TData>({ header }: TableHeaderProps<TData>) {
  const canSort = header.column.getCanSort();
  const isSorted = header.column.getIsSorted();

  return (
    <th
      className={cn(
        "h-12 px-[length:var(--spacing-4)] text-left align-middle font-[number:var(--font-medium)]",
        canSort && "cursor-pointer select-none"
      )}
      style={{
        color: "var(--color-text-secondary)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
      onClick={header.column.getToggleSortingHandler()}
    >
      {header.isPlaceholder ? null : (
        <div className="flex items-center gap-[length:var(--spacing-2)]">
          {flexRender(header.column.columnDef.header, header.getContext())}
          {canSort && (
            <span className="ml-[length:var(--spacing-1)]">
              {isSorted === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </span>
          )}
        </div>
      )}
    </th>
  );
}

interface TableRowProps<TData> {
  row: Row<TData>;
}

function TableRow<TData>({ row }: TableRowProps<TData>) {
  return (
    <tr
      className={cn(
        "border-b transition-colors",
        row.getIsSelected() && "bg-[color:var(--color-surface-hover)]"
      )}
      style={{ borderColor: "var(--color-border)" }}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="p-[length:var(--spacing-4)] align-middle"
          style={{ color: "var(--color-text)" }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

DataTableBase.displayName = "DataTableBase";

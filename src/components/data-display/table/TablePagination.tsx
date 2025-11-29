import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../../overlay/Button";
import { cn } from "../../../lib/utils";

export interface TablePaginationProps {
  /** Current page index (0-based) */
  pageIndex: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of rows */
  totalRows: number;
  /** Total number of pages */
  pageCount: number;
  /** Whether we can go to previous page */
  canPreviousPage: boolean;
  /** Whether we can go to next page */
  canNextPage: boolean;
  /** Go to first page */
  onFirstPage: () => void;
  /** Go to previous page */
  onPreviousPage: () => void;
  /** Go to next page */
  onNextPage: () => void;
  /** Go to last page */
  onLastPage: () => void;
  /** Set page size */
  onPageSizeChange: (size: number) => void;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Additional class names */
  className?: string;
}

/**
 * Table pagination controls with page navigation and page size selection
 */
export function TablePagination({
  pageIndex,
  pageSize,
  totalRows,
  pageCount,
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  className,
}: TablePaginationProps) {
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-[length:var(--spacing-4)] py-[length:var(--spacing-4)]",
        className
      )}
    >
      {/* Results info and page size */}
      <div className="flex items-center gap-[length:var(--spacing-4)]">
        <span
          className="text-[length:var(--text-sm)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Showing {totalRows > 0 ? startRow : 0} to {endRow} of {totalRows} results
        </span>
        <div className="flex items-center gap-[length:var(--spacing-2)]">
          <span
            className="text-[length:var(--text-sm)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Rows per page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={cn(
              "h-8 w-16 px-[length:var(--spacing-2)]",
              "text-[length:var(--text-sm)]",
              "rounded-[length:var(--radius-md)]",
              "cursor-pointer outline-none"
            )}
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        <span
          className="text-[length:var(--text-sm)] mr-[length:var(--spacing-2)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Page {pageIndex + 1} of {pageCount || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onFirstPage}
          disabled={!canPreviousPage}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={!canNextPage}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onLastPage}
          disabled={!canNextPage}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  );
}

TablePagination.displayName = "TablePagination";

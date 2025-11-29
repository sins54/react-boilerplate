import { cn } from "../../../lib/utils";

export interface TableSkeletonProps {
  /** Number of rows to display */
  rows?: number;
  /** Number of columns to display */
  columns?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Skeleton loading state for table rows
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-[length:var(--spacing-4)] py-[length:var(--spacing-3)] border-b animate-pulse"
          style={{ borderColor: "var(--color-border)" }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                "h-4 rounded-[length:var(--radius-md)]",
                colIndex === 0 ? "w-1/4" : "flex-1"
              )}
              style={{ backgroundColor: "var(--color-surface-hover)" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

TableSkeleton.displayName = "TableSkeleton";

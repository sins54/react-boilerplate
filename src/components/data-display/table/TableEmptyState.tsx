import * as React from "react";
import { FileQuestion } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface TableEmptyStateProps {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button or content */
  action?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Empty state component for when table has no data
 */
export function TableEmptyState({
  title = "No data found",
  description = "There are no records to display at this time.",
  icon,
  action,
  className,
}: TableEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-[length:var(--spacing-16)] px-[length:var(--spacing-4)]",
        className
      )}
    >
      <div
        className="p-[length:var(--spacing-4)] rounded-full mb-[length:var(--spacing-4)]"
        style={{ backgroundColor: "var(--color-surface-hover)" }}
      >
        {icon || (
          <FileQuestion
            className="h-8 w-8"
            style={{ color: "var(--color-text-muted)" }}
          />
        )}
      </div>
      <h3
        className="text-[length:var(--text-lg)] font-[number:var(--font-semibold)] mb-[length:var(--spacing-2)]"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h3>
      <p
        className="text-[length:var(--text-sm)] text-center max-w-sm mb-[length:var(--spacing-4)]"
        style={{ color: "var(--color-text-muted)" }}
      >
        {description}
      </p>
      {action}
    </div>
  );
}

TableEmptyState.displayName = "TableEmptyState";

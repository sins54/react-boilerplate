import * as React from "react";
import { FileQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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
  title,
  description,
  icon,
  action,
  className,
}: TableEmptyStateProps) {
  const { t } = useTranslation("common");
  const displayTitle = title ?? t("table.empty.title");
  const displayDescription = description ?? t("table.empty.description");

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
        {displayTitle}
      </h3>
      <p
        className="text-[length:var(--text-sm)] text-center max-w-sm mb-[length:var(--spacing-4)]"
        style={{ color: "var(--color-text-muted)" }}
      >
        {displayDescription}
      </p>
      {action}
    </div>
  );
}

TableEmptyState.displayName = "TableEmptyState";

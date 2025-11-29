import { X } from "lucide-react";
import { Badge } from "../Badge";
import { cn } from "../../../lib/utils";

export interface ActiveFilter {
  /** Unique filter identifier */
  id: string;
  /** Display label for the filter */
  label: string;
  /** Display value for the filter */
  value: string;
}

export interface ActiveFiltersListProps {
  /** Array of active filters */
  filters: ActiveFilter[];
  /** Callback when a filter is removed */
  onRemoveFilter: (filterId: string) => void;
  /** Callback to clear all filters */
  onClearAll?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Component to display active filters as dismissible badges
 */
export function ActiveFiltersList({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}: ActiveFiltersListProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-[length:var(--spacing-2)] py-[length:var(--spacing-2)]",
        className
      )}
    >
      <span
        className="text-[length:var(--text-sm)] font-[number:var(--font-medium)]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Active filters:
      </span>
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="outline"
          colorScheme="primary"
          className="gap-[length:var(--spacing-1)] pr-[length:var(--spacing-1)]"
        >
          <span className="text-[length:var(--text-xs)]">
            {filter.label}: {filter.value}
          </span>
          <button
            type="button"
            onClick={() => onRemoveFilter(filter.id)}
            className={cn(
              "ml-[length:var(--spacing-1)] rounded-full p-[2px]",
              "hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-text-on-primary)]",
              "transition-colors"
            )}
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {onClearAll && filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-[length:var(--text-sm)] underline underline-offset-2 transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}

ActiveFiltersList.displayName = "ActiveFiltersList";

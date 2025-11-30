import * as React from "react";
import { Search, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/overlay/Button";
import { cn } from "@/lib/utils";
import { useTableFilter } from "./TableFilterContext";

export interface TableToolbarProps {
  /** Current search value */
  searchValue?: string;
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Whether to hide the search input */
  hideSearch?: boolean;
  /** Whether to hide the filter button */
  hideFilter?: boolean;
  /** Whether there are active filters */
  hasActiveFilters?: boolean;
  /** Additional content to render on the right side */
  rightContent?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Table toolbar component with search input and filter button
 */
export function TableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder,
  hideSearch = false,
  hideFilter = false,
  hasActiveFilters = false,
  rightContent,
  className,
}: TableToolbarProps) {
  const { t } = useTranslation("common");
  const { toggleFilter } = useTableFilter();
  const placeholder = searchPlaceholder ?? t("table.search");

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-[length:var(--spacing-4)] py-[length:var(--spacing-4)]",
        className
      )}
    >
      {/* Left side - Search */}
      <div className="flex items-center gap-[length:var(--spacing-2)] flex-1">
        {!hideSearch && (
          <div className="relative max-w-sm w-full">
            <Search
              className="absolute left-[length:var(--spacing-3)] top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={placeholder}
              className={cn(
                "w-full pl-10 pr-[length:var(--spacing-4)] py-[length:var(--spacing-2)]",
                "text-[length:var(--text-sm)]",
                "rounded-[length:var(--radius-md)]",
                "outline-none transition-colors"
              )}
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>
        )}
      </div>

      {/* Right side - Filter button and additional content */}
      <div className="flex items-center gap-[length:var(--spacing-2)]">
        {rightContent}
        {!hideFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilter}
            className={cn(
              "relative",
              hasActiveFilters && "border-[color:var(--color-primary)]"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t("table.filter")}
            {hasActiveFilters && (
              <span
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

TableToolbar.displayName = "TableToolbar";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/overlay/Button";
import { cn } from "@/lib/utils";
import { useTableFilter } from "./TableFilterContext";

export interface FilterSheetProps {
  /** Title for the filter panel */
  title?: string;
  /** Description for the filter panel */
  description?: string;
  /** Filter form content */
  children: React.ReactNode;
  /** Callback when filters are applied */
  onApply?: () => void;
  /** Callback when filters are reset */
  onReset?: () => void;
}

/**
 * Filter sheet component - a right-side slider panel for filters
 */
export function FilterSheet({
  title = "Filters",
  description = "Configure filters to narrow down results",
  children,
  onApply,
  onReset,
}: FilterSheetProps) {
  const { isFilterOpen, closeFilter } = useTableFilter();

  return (
    <DialogPrimitive.Root open={isFilterOpen} onOpenChange={(open) => !open && closeFilter()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm",
            "flex flex-col gap-[length:var(--spacing-4)]",
            "border-l shadow-[var(--shadow-lg)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300"
          )}
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-[length:var(--spacing-6)] border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <DialogPrimitive.Title
                className="text-[length:var(--text-lg)] font-[number:var(--font-semibold)]"
                style={{ color: "var(--color-text)" }}
              >
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description
                className="text-[length:var(--text-sm)] mt-[length:var(--spacing-1)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {description}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close filters</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-[length:var(--spacing-6)]">
            {children}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-[length:var(--spacing-2)] p-[length:var(--spacing-6)] border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            {onReset && (
              <Button variant="outline" onClick={onReset}>
                Reset
              </Button>
            )}
            {onApply && (
              <Button
                onClick={() => {
                  onApply();
                  closeFilter();
                }}
              >
                Apply Filters
              </Button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

FilterSheet.displayName = "FilterSheet";

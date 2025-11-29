import * as React from "react";
import { cn } from "../../lib/utils";

export interface FormFieldWrapperProps {
  /** Field name (for id and accessibility) */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Children (the actual input) */
  children: React.ReactNode;
  /** Additional class name for wrapper */
  className?: string;
}

/**
 * FormFieldWrapper - Wraps form inputs with label and error display
 */
export const FormFieldWrapper = React.forwardRef<
  HTMLDivElement,
  FormFieldWrapperProps
>(({ name, label, required, error, helperText, children, className }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-[var(--spacing-1)]", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-[length:var(--text-sm)] font-[number:var(--font-medium)]"
          style={{ color: "var(--color-text)" }}
        >
          {label}
          {required && (
            <span
              className="ml-1"
              style={{ color: "var(--color-error)" }}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p
          className="text-[length:var(--text-sm)]"
          style={{ color: "var(--color-error)" }}
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          className="text-[length:var(--text-sm)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

FormFieldWrapper.displayName = "FormFieldWrapper";

/**
 * Shared input styles for consistent styling
 */
export const inputBaseStyles = cn(
  "w-full px-[var(--spacing-3)] py-[var(--spacing-2)]",
  "rounded-[var(--radius-md)]",
  "border transition-colors duration-[var(--transition-fast)]",
  "focus:outline-none focus:ring-2 focus:ring-offset-0"
);

export const inputStyleProps = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  color: "var(--color-text)",
  "--tw-ring-color": "var(--color-primary)",
} as React.CSSProperties;

export const inputErrorStyleProps = {
  borderColor: "var(--color-error)",
  "--tw-ring-color": "var(--color-error)",
} as React.CSSProperties;

export const inputPlaceholderStyle = {
  color: "var(--color-text-muted)",
} as React.CSSProperties;

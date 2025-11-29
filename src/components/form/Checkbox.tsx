import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below checkbox */
  helperText?: string;
}

/**
 * Checkbox component for boolean input
 * Integrates with react-hook-form via FormProvider context
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ name, label, required, helperText, className, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormFieldWrapper
            name={name}
            error={error}
            helperText={helperText}
          >
            <label
              htmlFor={name}
              className="inline-flex items-center gap-[var(--spacing-2)] cursor-pointer"
            >
              <input
                {...props}
                ref={ref}
                type="checkbox"
                id={name}
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                aria-invalid={!!error}
                className={cn(
                  "w-4 h-4 rounded-[var(--radius-sm)] border cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-offset-1",
                  className
                )}
                style={{
                  borderColor: error ? "var(--color-error)" : "var(--color-border)",
                  accentColor: "var(--color-primary)",
                }}
              />
              {label && (
                <span
                  className="text-[length:var(--text-sm)]"
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
                </span>
              )}
            </label>
          </FormFieldWrapper>
        )}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

// CheckboxGroup types
export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below checkbox group */
  helperText?: string;
  /** Options for the checkbox group */
  options: CheckboxGroupOption[];
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Custom class name */
  className?: string;
}

/**
 * CheckboxGroup component for multiple checkbox selection
 * Integrates with react-hook-form via FormProvider context
 */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    { name, label, required, helperText, options, direction = "vertical", className },
    ref
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const values: string[] = field.value || [];

          const handleChange = (optionValue: string, checked: boolean) => {
            const newValues = checked
              ? [...values, optionValue]
              : values.filter((v) => v !== optionValue);
            field.onChange(newValues);
          };

          return (
            <FormFieldWrapper
              name={name}
              label={label}
              required={required}
              error={error}
              helperText={helperText}
            >
              <div
                ref={ref}
                className={cn(
                  "flex gap-[var(--spacing-3)]",
                  direction === "vertical" ? "flex-col" : "flex-row flex-wrap",
                  className
                )}
                role="group"
                aria-label={label}
              >
                {options.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "inline-flex items-center gap-[var(--spacing-2)] cursor-pointer",
                      option.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={values.includes(option.value)}
                      onChange={(e) => handleChange(option.value, e.target.checked)}
                      disabled={option.disabled}
                      className="w-4 h-4 rounded-[var(--radius-sm)] border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1"
                      style={{
                        borderColor: error
                          ? "var(--color-error)"
                          : "var(--color-border)",
                        accentColor: "var(--color-primary)",
                      }}
                    />
                    <span
                      className="text-[length:var(--text-sm)]"
                      style={{ color: "var(--color-text)" }}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </FormFieldWrapper>
          );
        }}
      />
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

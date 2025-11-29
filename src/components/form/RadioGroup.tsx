import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below radio group */
  helperText?: string;
  /** Options for the radio group */
  options: RadioGroupOption[];
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Custom class name */
  className?: string;
}

/**
 * RadioGroup component for single selection from multiple options
 * Integrates with react-hook-form via FormProvider context
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
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
        render={({ field }) => (
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
              role="radiogroup"
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
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    disabled={option.disabled}
                    className="w-4 h-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1"
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
        )}
      />
    );
  }
);

RadioGroup.displayName = "RadioGroup";

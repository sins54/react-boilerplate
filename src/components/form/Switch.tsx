import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "../../lib/utils";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type" | "size"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below switch */
  helperText?: string;
  /** Size of the switch */
  size?: "sm" | "md" | "lg";
}

const switchSizes = {
  sm: {
    track: "w-8 h-4",
    thumb: "w-3 h-3",
    translate: "translate-x-4",
  },
  md: {
    track: "w-10 h-5",
    thumb: "w-4 h-4",
    translate: "translate-x-5",
  },
  lg: {
    track: "w-12 h-6",
    thumb: "w-5 h-5",
    translate: "translate-x-6",
  },
};

/**
 * Switch (Toggle) component for boolean input with a toggle appearance
 * Integrates with react-hook-form via FormProvider context
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ name, label, required, helperText, size = "md", className, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;
    const sizeConfig = switchSizes[size];

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormFieldWrapper name={name} error={error} helperText={helperText}>
            <label
              htmlFor={name}
              className="inline-flex items-center gap-[var(--spacing-3)] cursor-pointer"
            >
              <div className={cn("relative", className)}>
                {/* Hidden input for accessibility */}
                <input
                  {...props}
                  ref={ref}
                  type="checkbox"
                  id={name}
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  aria-invalid={!!error}
                  className="sr-only peer"
                />
                {/* Track */}
                <div
                  className={cn(
                    sizeConfig.track,
                    "rounded-full transition-colors duration-[var(--transition-fast)]"
                  )}
                  style={{
                    backgroundColor: field.value
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                  }}
                />
                {/* Thumb */}
                <div
                  className={cn(
                    sizeConfig.thumb,
                    "absolute top-0.5 left-0.5 rounded-full transition-transform duration-[var(--transition-fast)]",
                    field.value && sizeConfig.translate
                  )}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
              </div>
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

Switch.displayName = "Switch";

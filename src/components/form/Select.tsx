import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormFieldWrapper,
  inputBaseStyles,
  inputStyleProps,
  inputErrorStyleProps,
} from "./FormFieldWrapper";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below select */
  helperText?: string;
  /** Options for the select */
  options: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Select component for single selection dropdown
 * Integrates with react-hook-form via FormProvider context
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { name, label, required, helperText, options, placeholder, className, ...props },
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
            <select
              {...field}
              {...props}
              ref={ref}
              id={name}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(inputBaseStyles, "cursor-pointer", className)}
              style={{
                ...inputStyleProps,
                ...(error ? inputErrorStyleProps : {}),
              }}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </FormFieldWrapper>
        )}
      />
    );
  }
);

Select.displayName = "Select";

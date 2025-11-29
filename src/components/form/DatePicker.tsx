import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "../../lib/utils";
import {
  FormFieldWrapper,
  inputBaseStyles,
  inputStyleProps,
  inputErrorStyleProps,
} from "./FormFieldWrapper";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below date picker */
  helperText?: string;
  /** Minimum date (YYYY-MM-DD format) */
  minDate?: string;
  /** Maximum date (YYYY-MM-DD format) */
  maxDate?: string;
}

/**
 * DatePicker component using native HTML date input
 * Integrates with react-hook-form via FormProvider context
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    { name, label, required, helperText, minDate, maxDate, className, ...props },
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
            <input
              {...field}
              {...props}
              ref={ref}
              id={name}
              type="date"
              min={minDate}
              max={maxDate}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(inputBaseStyles, "cursor-pointer", className)}
              style={{
                ...inputStyleProps,
                ...(error ? inputErrorStyleProps : {}),
                colorScheme: "light dark", // Ensures date picker adapts to dark mode
              }}
            />
          </FormFieldWrapper>
        )}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";

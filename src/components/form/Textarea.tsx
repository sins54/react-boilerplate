import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormFieldWrapper,
  inputBaseStyles,
  inputStyleProps,
  inputErrorStyleProps,
} from "./FormFieldWrapper";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below textarea */
  helperText?: string;
  /** Number of rows */
  rows?: number;
}

/**
 * Textarea component for multi-line text input
 * Integrates with react-hook-form via FormProvider context
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, label, required, helperText, rows = 4, className, ...props }, ref) => {
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
            <textarea
              {...field}
              {...props}
              ref={ref}
              id={name}
              rows={rows}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(inputBaseStyles, "resize-y min-h-[80px]", className)}
              style={{
                ...inputStyleProps,
                ...(error ? inputErrorStyleProps : {}),
              }}
            />
          </FormFieldWrapper>
        )}
      />
    );
  }
);

Textarea.displayName = "Textarea";

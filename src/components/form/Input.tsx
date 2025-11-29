import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormFieldWrapper,
  inputBaseStyles,
  inputStyleProps,
  inputErrorStyleProps,
} from "./FormFieldWrapper";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below input */
  helperText?: string;
  /** Input type */
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
}

/**
 * Input component for text, email, password, etc.
 * Integrates with react-hook-form via FormProvider context
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { name, label, required, helperText, type = "text", className, ...props },
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
              type={type}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(inputBaseStyles, className)}
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

Input.displayName = "Input";

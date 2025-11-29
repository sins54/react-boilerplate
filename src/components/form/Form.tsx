import * as React from "react";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import { cn } from "@/lib/utils";

export interface FormProps<TFieldValues extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Form methods from useForm hook */
  form: UseFormReturn<TFieldValues>;
  /** Submit handler function */
  onSubmit: SubmitHandler<TFieldValues>;
  /** Form content */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * Generic Form wrapper component
 * Provides FormProvider context to all children and standardizes form layout
 */
function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-[var(--spacing-4)]", className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

Form.displayName = "Form";

export { Form };

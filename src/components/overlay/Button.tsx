import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[length:var(--radius-md)] text-[length:var(--text-sm)] font-[number:var(--font-medium)] ring-offset-[color:var(--color-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--color-primary)] text-[color:var(--color-text-on-primary)] hover:bg-[color:var(--color-primary-hover)]",
        destructive:
          "bg-[color:var(--color-error)] text-[color:var(--color-text-on-primary)] hover:bg-[color:var(--color-error-hover)]",
        outline:
          "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-hover)] hover:text-[color:var(--color-text)]",
        secondary:
          "bg-[color:var(--color-surface-hover)] text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-active)]",
        ghost:
          "hover:bg-[color:var(--color-surface-hover)] hover:text-[color:var(--color-text)]",
        link: "text-[color:var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-[length:var(--spacing-4)] py-[length:var(--spacing-2)]",
        sm: "h-9 rounded-[length:var(--radius-md)] px-[length:var(--spacing-3)]",
        lg: "h-11 rounded-[length:var(--radius-md)] px-[length:var(--spacing-8)]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
export { buttonVariants };

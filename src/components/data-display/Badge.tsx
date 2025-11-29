import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-[length:var(--spacing-3)] py-[length:var(--spacing-1)] text-[length:var(--text-xs)] font-[number:var(--font-medium)] transition-colors",
  {
    variants: {
      variant: {
        solid: "",
        outline: "border",
      },
      colorScheme: {
        default:
          "bg-[color:var(--color-surface-hover)] text-[color:var(--color-text)]",
        primary:
          "bg-[color:var(--color-primary)] text-[color:var(--color-text-on-primary)]",
        success:
          "bg-[color:var(--color-success)] text-[color:var(--color-text-on-primary)]",
        warning:
          "bg-[color:var(--color-warning)] text-[color:var(--color-text-on-primary)]",
        error:
          "bg-[color:var(--color-error)] text-[color:var(--color-text-on-primary)]",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        colorScheme: "default",
        className:
          "bg-transparent border-[color:var(--color-border)] text-[color:var(--color-text)]",
      },
      {
        variant: "outline",
        colorScheme: "primary",
        className:
          "bg-transparent border-[color:var(--color-primary)] text-[color:var(--color-primary)]",
      },
      {
        variant: "outline",
        colorScheme: "success",
        className:
          "bg-transparent border-[color:var(--color-success)] text-[color:var(--color-success)]",
      },
      {
        variant: "outline",
        colorScheme: "warning",
        className:
          "bg-transparent border-[color:var(--color-warning)] text-[color:var(--color-warning)]",
      },
      {
        variant: "outline",
        colorScheme: "error",
        className:
          "bg-transparent border-[color:var(--color-error)] text-[color:var(--color-error)]",
      },
    ],
    defaultVariants: {
      variant: "solid",
      colorScheme: "default",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, colorScheme, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, colorScheme }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
export { badgeVariants };

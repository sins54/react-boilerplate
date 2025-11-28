import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const boxVariants = cva("", {
  variants: {
    display: {
      block: "block",
      inline: "inline",
      "inline-block": "inline-block",
      flex: "flex",
      "inline-flex": "inline-flex",
      grid: "grid",
      hidden: "hidden",
    },
    padding: {
      none: "p-0",
      xs: "p-[length:var(--spacing-1)]",
      sm: "p-[length:var(--spacing-2)]",
      md: "p-[length:var(--spacing-4)]",
      lg: "p-[length:var(--spacing-6)]",
      xl: "p-[length:var(--spacing-8)]",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-[length:var(--radius-sm)]",
      md: "rounded-[length:var(--radius-md)]",
      lg: "rounded-[length:var(--radius-lg)]",
      xl: "rounded-[length:var(--radius-xl)]",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    display: "block",
    padding: "none",
    rounded: "none",
  },
});

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, display, padding, rounded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(boxVariants({ display, padding, rounded }), className)}
        {...props}
      />
    );
  }
);

Box.displayName = "Box";

export { Box };
export { boxVariants };

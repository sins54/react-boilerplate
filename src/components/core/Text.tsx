import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-[length:var(--text-xs)]",
      sm: "text-[length:var(--text-sm)]",
      base: "text-[length:var(--text-base)]",
      lg: "text-[length:var(--text-lg)]",
      xl: "text-[length:var(--text-xl)]",
      "2xl": "text-[length:var(--text-2xl)]",
      "3xl": "text-[length:var(--text-3xl)]",
      "4xl": "text-[length:var(--text-4xl)]",
    },
    weight: {
      thin: "font-[number:var(--font-thin)]",
      light: "font-[number:var(--font-light)]",
      normal: "font-[number:var(--font-normal)]",
      medium: "font-[number:var(--font-medium)]",
      semibold: "font-[number:var(--font-semibold)]",
      bold: "font-[number:var(--font-bold)]",
      extrabold: "font-[number:var(--font-extrabold)]",
    },
    textColor: {
      main: "text-[color:var(--color-text)]",
      muted: "text-[color:var(--color-text-muted)]",
      secondary: "text-[color:var(--color-text-secondary)]",
      primary: "text-[color:var(--color-primary)]",
      error: "text-[color:var(--color-error)]",
      success: "text-[color:var(--color-success)]",
      warning: "text-[color:var(--color-warning)]",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    textColor: "main",
  },
});

type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: TextElement;
  /** @deprecated Use textColor instead */
  color?: "main" | "muted" | "secondary" | "primary" | "error" | "success" | "warning";
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as: Component = "p", className, size, weight, textColor, color, ...props }, ref) => {
    // Support both textColor and color (deprecated) props
    const resolvedColor = textColor ?? color;
    return React.createElement(Component, {
      ref,
      className: cn(textVariants({ size, weight, textColor: resolvedColor }), className),
      ...props,
    });
  }
);

Text.displayName = "Text";

export { Text };
export { textVariants };

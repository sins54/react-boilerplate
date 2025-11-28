import * as React from "react";
import { cn } from "../../lib/utils";

/* Card Root */
export type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[length:var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-sm)]",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

/* Card Header */
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[length:var(--spacing-2)] p-[length:var(--spacing-6)]",
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

/* Card Title */
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-[length:var(--text-2xl)] font-[number:var(--font-semibold)] leading-none tracking-tight text-[color:var(--color-text)]",
        className
      )}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

/* Card Description */
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]",
      className
    )}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

/* Card Content */
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-[length:var(--spacing-6)] pt-0", className)}
      {...props}
    />
  )
);

CardContent.displayName = "CardContent";

/* Card Footer */
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-[length:var(--spacing-6)] pt-0",
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

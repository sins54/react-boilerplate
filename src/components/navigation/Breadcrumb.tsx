import * as React from "react";
import { cn } from "../../lib/utils";

/* Breadcrumb Root */
export type BreadcrumbProps = React.HTMLAttributes<HTMLElement>;

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} aria-label="breadcrumb" className={className} {...props} />
  )
);

Breadcrumb.displayName = "Breadcrumb";

/* Breadcrumb List */
export type BreadcrumbListProps = React.HTMLAttributes<HTMLOListElement>;

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-[length:var(--spacing-2)] break-words text-[length:var(--text-sm)] text-[color:var(--color-text-muted)]",
        className
      )}
      {...props}
    />
  )
);

BreadcrumbList.displayName = "BreadcrumbList";

/* Breadcrumb Item */
export type BreadcrumbItemProps = React.HTMLAttributes<HTMLLIElement>;

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-[length:var(--spacing-2)]", className)}
      {...props}
    />
  )
);

BreadcrumbItem.displayName = "BreadcrumbItem";

/* Breadcrumb Link */
export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "transition-colors hover:text-[color:var(--color-text)]",
        className
      )}
      {...props}
    />
  )
);

BreadcrumbLink.displayName = "BreadcrumbLink";

/* Breadcrumb Page (current) */
export type BreadcrumbPageProps = React.HTMLAttributes<HTMLSpanElement>;

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-[number:var(--font-normal)] text-[color:var(--color-text)]", className)}
      {...props}
    />
  )
);

BreadcrumbPage.displayName = "BreadcrumbPage";

/* Breadcrumb Separator */
export type BreadcrumbSeparatorProps = React.HTMLAttributes<HTMLSpanElement>;

const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </span>
));

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/* Breadcrumb Ellipsis */
export type BreadcrumbEllipsisProps = React.HTMLAttributes<HTMLSpanElement>;

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
));

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

/* Chevron Right Icon */
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* More Horizontal Icon */
function MoreHorizontalIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

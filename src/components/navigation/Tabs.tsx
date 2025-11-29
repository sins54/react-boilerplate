import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/* Tabs Root */
const Tabs = TabsPrimitive.Root;

/* Tabs List */
export type TabsListProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
>;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-[length:var(--radius-md)] bg-[color:var(--color-surface-hover)] p-[length:var(--spacing-1)] text-[color:var(--color-text-muted)]",
      className
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

/* Tabs Trigger */
export type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
>;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-[length:var(--radius-sm)] px-[length:var(--spacing-3)] py-[length:var(--spacing-2)] text-[length:var(--text-sm)] font-[number:var(--font-medium)] ring-offset-[color:var(--color-bg)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[color:var(--color-surface)] data-[state=active]:text-[color:var(--color-text)] data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/* Tabs Content */
export type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-[length:var(--spacing-2)] ring-offset-[color:var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

import { Toaster as SonnerToaster } from "sonner";

/**
 * Toaster component styled with the Design System.
 * Uses sonner for lightweight, customizable toast notifications.
 *
 * The component automatically adapts to light/dark mode through CSS variables.
 * NO hardcoded hex values - uses semantic variables.
 *
 * @example
 * // In your App.tsx or layout:
 * import { Toaster } from '@/components/feedback';
 *
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * @example
 * // Trigger toasts anywhere in your app:
 * import { toast } from 'sonner';
 *
 * toast.success('Profile updated!');
 * toast.error('Something went wrong');
 * toast.info('New message received');
 * toast.warning('Session expiring soon');
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "var(--color-surface)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          fontSize: "var(--text-sm)",
          padding: "var(--spacing-4)",
        },
        classNames: {
          toast: "group",
          title: "font-semibold",
          description: "text-[color:var(--color-text-secondary)]",
          actionButton:
            "bg-[color:var(--color-primary)] text-[color:var(--color-text-on-primary)] hover:bg-[color:var(--color-primary-hover)]",
          cancelButton:
            "bg-[color:var(--color-surface-hover)] text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-active)]",
          closeButton:
            "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]",
          success:
            "!bg-[color:var(--color-success-bg)] !text-[color:var(--color-success-text)] !border-[color:var(--color-success)]",
          error:
            "!bg-[color:var(--color-error-bg)] !text-[color:var(--color-error-text)] !border-[color:var(--color-error)]",
          warning:
            "!bg-[color:var(--color-warning-bg)] !text-[color:var(--color-warning-text)] !border-[color:var(--color-warning)]",
          info: "!bg-[color:var(--color-surface)] !text-[color:var(--color-text)] !border-[color:var(--color-primary)]",
        },
      }}
    />
  );
}

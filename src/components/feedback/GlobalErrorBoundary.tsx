import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { type ReactNode } from "react";

/**
 * Fallback UI shown when a global error is caught.
 * Designed with the Design System - NO hardcoded hex values.
 */
function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        className="max-w-md w-full text-center p-8 rounded-[length:var(--radius-xl)]"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Error illustration - sad face icon */}
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-error-bg)",
          }}
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ color: "var(--color-error)" }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>

        {/* Error message */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          Something went wrong
        </h1>
        <p
          className="mb-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          We're sorry, but something unexpected happened. Please try reloading the page.
        </p>

        {/* Error details (collapsible for debugging) */}
        {import.meta.env.DEV && error && (
          <details
            className="mb-6 text-left p-4 rounded-[length:var(--radius-md)] overflow-auto max-h-40"
            style={{
              backgroundColor: "var(--color-error-bg)",
              border: "1px solid var(--color-error)",
            }}
          >
            <summary
              className="cursor-pointer font-medium mb-2"
              style={{ color: "var(--color-error-text)" }}
            >
              Error details
            </summary>
            <pre
              className="text-xs whitespace-pre-wrap break-words"
              style={{ color: "var(--color-error-text)" }}
            >
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-3 rounded-[length:var(--radius-md)] font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-[length:var(--radius-md)] font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-surface-hover)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

/**
 * Global error boundary to catch unhandled React errors.
 * Displays a friendly "Something went wrong" UI using the Design System.
 *
 * @example
 * // Wrap your entire app or main content
 * import { GlobalErrorBoundary } from '@/components/feedback';
 *
 * function App() {
 *   return (
 *     <GlobalErrorBoundary>
 *       <YourApp />
 *     </GlobalErrorBoundary>
 *   );
 * }
 *
 * @example
 * // With error logging
 * function App() {
 *   const handleError = (error: Error, info: React.ErrorInfo) => {
 *     // Log to error tracking service
 *     errorTracker.capture(error, info);
 *   };
 *
 *   return (
 *     <GlobalErrorBoundary onError={handleError}>
 *       <YourApp />
 *     </GlobalErrorBoundary>
 *   );
 * }
 */
export function GlobalErrorBoundary({
  children,
  onError,
}: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={onError}
      onReset={() => {
        // Reset any app state that might have caused the error
        // This could include clearing certain caches, resetting stores, etc.
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

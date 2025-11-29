import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { type ReactNode } from "react";

/**
 * Compact fallback UI for inline/section errors.
 * Designed to not disrupt the rest of the page.
 */
function SectionErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className="p-4 rounded-[length:var(--radius-lg)] flex items-center gap-4"
      style={{
        backgroundColor: "var(--color-error-bg)",
        border: "1px solid var(--color-error)",
      }}
    >
      {/* Error icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: "var(--color-error)",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ color: "var(--color-text-on-primary)" }}
        >
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      {/* Error message */}
      <div className="flex-1 min-w-0">
        <p
          className="font-medium text-sm"
          style={{ color: "var(--color-error-text)" }}
        >
          Failed to load this section
        </p>
        {import.meta.env.DEV && error && (
          <p
            className="text-xs mt-1 truncate"
            style={{ color: "var(--color-error-text)", opacity: 0.8 }}
            title={error.message}
          >
            {error.message}
          </p>
        )}
      </div>

      {/* Retry button */}
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1.5 rounded-[length:var(--radius-md)] text-sm font-medium transition-colors flex-shrink-0"
        style={{
          backgroundColor: "var(--color-error)",
          color: "var(--color-text-on-primary)",
        }}
      >
        Retry
      </button>
    </div>
  );
}

interface SectionErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Callback when error is caught */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** Callback when reset is triggered */
  onReset?: () => void;
}

/**
 * A smaller, inline error boundary for widgets/cards/sections.
 * Prevents one crashing component from killing the whole dashboard.
 *
 * @example
 * // Wrap individual dashboard widgets
 * function Dashboard() {
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       <SectionErrorBoundary>
 *         <RevenueChart />
 *       </SectionErrorBoundary>
 *       <SectionErrorBoundary>
 *         <UserStatsWidget />
 *       </SectionErrorBoundary>
 *       <SectionErrorBoundary>
 *         <RecentActivityList />
 *       </SectionErrorBoundary>
 *     </div>
 *   );
 * }
 *
 * @example
 * // With custom error handling
 * <SectionErrorBoundary
 *   onError={(error) => logError('UserWidget', error)}
 *   onReset={() => refetchUserData()}
 * >
 *   <UserWidget />
 * </SectionErrorBoundary>
 */
export function SectionErrorBoundary({
  children,
  fallback,
  onError,
  onReset,
}: SectionErrorBoundaryProps) {
  if (fallback) {
    return (
      <ErrorBoundary
        fallback={<>{fallback}</>}
        onError={onError}
        onReset={onReset}
      >
        {children}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={SectionErrorFallback}
      onError={onError}
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}

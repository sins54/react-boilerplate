import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  /** Custom children to render instead of Outlet */
  children?: ReactNode;
}

/**
 * A clean, centered layout for Login/Register pages.
 * Uses Design System semantic variables - NO hardcoded hex values.
 *
 * Background: bg-bg-app (via CSS variable)
 * Card: bg-surface with shadow-lg and border
 *
 * @example
 * // In your routes:
 * <Route element={<AuthLayout />}>
 *   <Route path="/login" element={<LoginPage />} />
 *   <Route path="/register" element={<RegisterPage />} />
 * </Route>
 *
 * @example
 * // With direct children:
 * <AuthLayout>
 *   <LoginForm />
 * </AuthLayout>
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Background gradient/pattern layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at top, var(--color-primary) 0%, transparent 50%),
            var(--color-bg)
          `,
          opacity: 0.05,
        }}
      />

      {/* Auth card container */}
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-[length:var(--radius-xl)]"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Logo/Brand header */}
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-[length:var(--radius-lg)] flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ color: "var(--color-text-on-primary)" }}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Content area - either children or outlet */}
        {children ?? <Outlet />}
      </div>

      {/* Footer - optional branding */}
      <div
        className="fixed bottom-4 left-0 right-0 text-center text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        © {new Date().getFullYear()} Your Company
      </div>
    </div>
  );
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Props for the PublicRoute component.
 */
interface PublicRouteProps {
  /** Route to redirect to when user is authenticated (default: "/dashboard") */
  redirectTo?: string;
}

/**
 * Public route wrapper that redirects authenticated users away.
 * Use this for routes that should only be accessible to unauthenticated users,
 * such as login, register, and forgot password pages.
 *
 * @example
 * // In your route configuration
 * <Route element={<PublicRoute />}>
 *   <Route path="/login" element={<LoginPage />} />
 *   <Route path="/register" element={<RegisterPage />} />
 * </Route>
 *
 * @example
 * // With custom redirect
 * <Route element={<PublicRoute redirectTo="/" />}>
 *   <Route path="/login" element={<LoginPage />} />
 * </Route>
 */
export function PublicRoute({ redirectTo = "/dashboard" }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // Redirect authenticated users to the specified route
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render the child routes for unauthenticated users
  return <Outlet />;
}

export default PublicRoute;

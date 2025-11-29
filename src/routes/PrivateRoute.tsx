import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Props for the PrivateRoute component.
 */
interface PrivateRouteProps {
  /** Route to redirect to when user is not authenticated (default: "/login") */
  loginPath?: string;
}

/**
 * Private route wrapper that requires authentication.
 * Use this as a layout route to protect all child routes from unauthenticated access.
 * This only checks for a valid auth token, not specific permissions.
 *
 * @example
 * // In your route configuration
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 *   <Route path="/profile" element={<ProfilePage />} />
 * </Route>
 *
 * @example
 * // With custom login path
 * <Route element={<PrivateRoute loginPath="/auth/login" />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 */
export function PrivateRoute({ loginPath = "/login" }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // Redirect unauthenticated users to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Render the child routes for authenticated users
  return <Outlet />;
}

export default PrivateRoute;

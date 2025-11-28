import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Screen, Privilege, Permission } from "../types/auth";

/**
 * Props for the ProtectedRoute component.
 */
interface ProtectedRouteProps {
  /** The screen entity this route belongs to */
  screen: Screen;
  /** Single privilege required for access */
  privilege?: Privilege;
  /** Multiple privileges - user needs ANY of these (OR logic) */
  privileges?: Privilege[];
  /** Route to redirect to when access is denied (default: "/403") */
  fallbackPath?: string;
  /** Custom fallback component to render instead of redirecting */
  fallbackComponent?: ReactNode;
  /** Children to render (alternative to Outlet) */
  children?: ReactNode;
}

/**
 * Protected route wrapper with granular Screen + Privilege based authorization.
 * This is the RBAC wrapper that checks if the user has the required permissions.
 *
 * @example
 * // Require VIEW privilege for BADGE screen
 * <Route
 *   path="/badges"
 *   element={
 *     <ProtectedRoute screen="BADGE" privilege="VIEW">
 *       <BadgeListPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // Require CREATE privilege for BADGE screen
 * <Route
 *   path="/badges/create"
 *   element={
 *     <ProtectedRoute screen="BADGE" privilege="CREATE">
 *       <CreateBadgePage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // Require VIEW OR EDIT privilege (user needs at least one)
 * <Route
 *   path="/badges/:id"
 *   element={
 *     <ProtectedRoute screen="BADGE" privileges={["VIEW", "EDIT"]}>
 *       <BadgeDetailPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // As a layout route for nested routes
 * <Route element={<ProtectedRoute screen="PROJECT" privilege="VIEW" />}>
 *   <Route path="/projects" element={<ProjectListPage />} />
 *   <Route
 *     path="/projects/create"
 *     element={
 *       <ProtectedRoute screen="PROJECT" privilege="CREATE">
 *         <CreateProjectPage />
 *       </ProtectedRoute>
 *     }
 *   />
 * </Route>
 *
 * @example
 * // With custom fallback component
 * <ProtectedRoute
 *   screen="SETTINGS"
 *   privilege="CONFIGURE"
 *   fallbackComponent={<AccessDenied message="Admin access required" />}
 * >
 *   <SettingsPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  screen,
  privilege,
  privileges,
  fallbackPath = "/403",
  fallbackComponent,
  children,
}: ProtectedRouteProps) {
  const { hasPermission, hasAnyPermission, isLoading } = useAuth();

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // Check authorization
  let hasAccess = false;

  if (privilege) {
    // Single privilege check
    hasAccess = hasPermission(screen, privilege);
  } else if (privileges && privileges.length > 0) {
    // Multiple privileges check (OR logic)
    const permissionsToCheck: Permission[] = privileges.map((p) => ({
      screen,
      privilege: p,
    }));
    hasAccess = hasAnyPermission(permissionsToCheck);
  } else {
    // No specific privilege required, just check if user has any permission for this screen
    // This is useful for layout routes where we just want to ensure some access to the screen
    hasAccess = true;
  }

  // Handle denied access
  if (!hasAccess) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Render children or Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;

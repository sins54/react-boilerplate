import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { Screen, Privilege } from "@/types/auth";

/**
 * Hook to access the auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to check if the current user can access a specific screen.
 * Useful for conditionally rendering navigation items.
 *
 * @param screen - The screen to check access for
 * @returns true if user has any permission for the screen
 *
 * @example
 * // In a navigation component
 * const canAccessBadges = useCanAccessScreen("BADGE");
 * const canAccessUsers = useCanAccessScreen("USERS");
 *
 * return (
 *   <nav>
 *     {canAccessBadges && <NavLink to="/badges">Badges</NavLink>}
 *     {canAccessUsers && <NavLink to="/users">Users</NavLink>}
 *   </nav>
 * );
 */
export function useCanAccessScreen(screen: Screen): boolean {
  const { hasAnyPermissionForScreen, isLoading } = useAuth();

  if (isLoading) return false;
  return hasAnyPermissionForScreen(screen);
}

/**
 * Hook to check if the current user has a specific permission.
 *
 * @param screen - The screen to check
 * @param privilege - The privilege to check
 * @returns true if user has the specific permission
 *
 * @example
 * const canCreateBadge = useHasPermission("BADGE", "CREATE");
 *
 * return (
 *   <div>
 *     {canCreateBadge && <Button onClick={handleCreate}>Create Badge</Button>}
 *   </div>
 * );
 */
export function useHasPermission(screen: Screen, privilege: Privilege): boolean {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) return false;
  return hasPermission(screen, privilege);
}

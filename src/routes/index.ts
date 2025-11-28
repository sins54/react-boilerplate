export { AppRoutes } from "./AppRoutes";
export { PublicRoute } from "./PublicRoute";
export { PrivateRoute } from "./PrivateRoute";
export { ProtectedRoute } from "./ProtectedRoute";
// Re-export permission hooks for convenience
export { useCanAccessScreen, useHasPermission } from "../hooks/useAuth";

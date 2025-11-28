import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy-loaded page components for code splitting
const ShowcasePage = lazy(() => import("../pages/ShowcasePage"));

// Loading fallback component
function PageLoader() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4"
          style={{
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-primary)",
          }}
        />
        <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
      </div>
    </div>
  );
}

// Placeholder components - replace with your actual page components
// These are here for demonstration purposes

function LoginPage() {
  return <div>Login Page</div>;
}

function DashboardPage() {
  return <div>Dashboard</div>;
}

function ForbiddenPage() {
  return <div>403 - Access Denied</div>;
}

function NotFoundPage() {
  return <div>404 - Not Found</div>;
}

/**
 * Main application routes configuration.
 *
 * This demonstrates the routing structure with:
 * - Public routes (accessible only to unauthenticated users)
 * - Private routes (require authentication)
 * - Protected routes (require specific permissions)
 *
 * @example
 * // Usage in main.tsx or App.tsx
 * import { BrowserRouter } from 'react-router-dom';
 * import { AuthProvider } from './context/AuthContext';
 * import { AppRoutes } from './routes/AppRoutes';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <AuthProvider>
 *         <AppRoutes />
 *       </AuthProvider>
 *     </BrowserRouter>
 *   );
 * }
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - redirect authenticated users away */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        {/* Add more public routes here: /register, /forgot-password, etc. */}
      </Route>

      {/* Private routes - require authentication */}
      <Route element={<PrivateRoute />}>
        {/* Dashboard - accessible to all authenticated users */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Badge routes - require BADGE screen permissions */}
        <Route
          path="/badges"
          element={
            <ProtectedRoute screen="BADGE" privilege="VIEW">
              {/* Replace with your BadgeListPage component */}
              <div>Badge List</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges/create"
          element={
            <ProtectedRoute screen="BADGE" privilege="CREATE">
              {/* Replace with your CreateBadgePage component */}
              <div>Create Badge</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges/:id"
          element={
            <ProtectedRoute screen="BADGE" privileges={["VIEW", "EDIT"]}>
              {/* Replace with your BadgeDetailPage component */}
              <div>Badge Detail</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges/:id/edit"
          element={
            <ProtectedRoute screen="BADGE" privilege="EDIT">
              {/* Replace with your EditBadgePage component */}
              <div>Edit Badge</div>
            </ProtectedRoute>
          }
        />

        {/* Project routes - require PROJECT screen permissions */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute screen="PROJECT" privilege="VIEW">
              {/* Replace with your ProjectListPage component */}
              <div>Project List</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/create"
          element={
            <ProtectedRoute screen="PROJECT" privilege="CREATE">
              {/* Replace with your CreateProjectPage component */}
              <div>Create Project</div>
            </ProtectedRoute>
          }
        />

        {/* User management routes - require USERS screen permissions */}
        <Route
          path="/users"
          element={
            <ProtectedRoute screen="USERS" privilege="VIEW">
              {/* Replace with your UserListPage component */}
              <div>User List</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute screen="USERS" privilege="CREATE">
              {/* Replace with your CreateUserPage component */}
              <div>Create User</div>
            </ProtectedRoute>
          }
        />

        {/* Settings - require CONFIGURE privilege */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute screen="SETTINGS" privilege="CONFIGURE">
              {/* Replace with your SettingsPage component */}
              <div>Settings</div>
            </ProtectedRoute>
          }
        />

        {/* Component Showcase - accessible to any authenticated user */}
        <Route
          path="/showcase"
          element={
            <Suspense fallback={<PageLoader />}>
              <ShowcasePage />
            </Suspense>
          }
        />
      </Route>

      {/* Error pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

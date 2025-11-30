import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster, GlobalErrorBoundary } from '@/components/feedback';
import DesignSystemPage from '@/pages/DesignSystemPage';
import ComponentShowcasePage from '@/pages/ComponentShowcasePage';
import FormShowcasePage from '@/pages/FormShowcasePage';
import LoginDemoPage from '@/pages/LoginDemoPage';
import DashboardDemoPage from '@/pages/DashboardDemoPage';

// Pulse HR imports
import { PulseLayout } from '@/components/pulse-hr/common';
import {
  LoginPage as PulseLoginPage,
  DashboardPage as PulseDashboardPage,
  AttendancePage,
  LeavePage,
  ProjectsPage,
  ReportsPage,
  ApprovalsPage,
  UsersPage,
} from '@/pages/pulse-hr';
import { useAuthStore } from '@/stores';

// Lazy-loaded pages for code splitting
const ShowcasePage = lazy(() => import('@/pages/ShowcasePage'));
const ClientTablePage = lazy(() => import('@/pages/tables/ClientTablePage'));
const ServerTablePage = lazy(() => import('@/pages/tables/ServerTablePage'));
const KitchenSinkPage = lazy(() => import('@/pages/demo/KitchenSinkPage'));

// Pulse HR Protected Route
function PulseProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/pulse/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/pulse" replace />;
  }

  return <>{children}</>;
}

// Create query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

function HomePage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <h1 
        className="text-4xl font-bold mb-4"
        style={{ color: 'var(--color-text)' }}
      >
        React + Vite + TypeScript
      </h1>
      <p 
        className="text-lg mb-8"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Modern React boilerplate with Tailwind CSS v4
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        {/* Pulse HR - Primary CTA */}
        <Link 
          to="/pulse"
          className="px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          🚀 Launch Pulse HR →
        </Link>
        <Link 
          to="/design-system"
          className="px-6 py-3 rounded-lg font-medium transition-colors"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
        >
          View Design System →
        </Link>
        <Link 
          to="/components"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
        >
          Component Library →
        </Link>
        <Link 
          to="/forms"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-warning)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          Form System →
        </Link>
        <Link 
          to="/showcase"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          Showcase (Demo) →
        </Link>
        <Link 
          to="/login-demo"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
        >
          Auth Layout Demo →
        </Link>
        <Link 
          to="/dashboard-demo"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)'
          }}
        >
          Dashboard Layout Demo →
        </Link>
        <Link 
          to="/tables/client"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          Client Table →
        </Link>
        <Link 
          to="/tables/server"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          Server Table →
        </Link>
        <Link 
          to="/demo/kitchen-sink"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-error)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          Kitchen Sink Demo →
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />
              <Route path="/components" element={<ComponentShowcasePage />} />
              <Route path="/forms" element={<FormShowcasePage />} />
              <Route path="/login-demo" element={<LoginDemoPage />} />
              <Route path="/dashboard-demo" element={<DashboardDemoPage />} />
              <Route 
                path="/showcase" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ShowcasePage />
                  </Suspense>
                } 
              />
              <Route 
                path="/tables/client" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ClientTablePage />
                  </Suspense>
                } 
              />
              <Route 
                path="/tables/server" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ServerTablePage />
                  </Suspense>
                } 
              />
              {/* 
                Kitchen Sink Demo - accessible without auth for development.
                See AppRoutes.tsx for the production-ready protected version
                that requires DEMO:VIEW permission.
              */}
              <Route 
                path="/demo/kitchen-sink" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <KitchenSinkPage />
                  </Suspense>
                } 
              />

              {/* Pulse HR Routes */}
              <Route path="/pulse/login" element={<PulseLoginPage />} />
              <Route
                path="/pulse"
                element={
                  <PulseProtectedRoute>
                    <PulseLayout />
                  </PulseProtectedRoute>
                }
              >
                <Route index element={<PulseDashboardPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="leave" element={<LeavePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:projectId" element={<ProjectsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route
                  path="approvals"
                  element={
                    <PulseProtectedRoute adminOnly>
                      <ApprovalsPage />
                    </PulseProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <PulseProtectedRoute adminOnly>
                      <UsersPage />
                    </PulseProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </GlobalErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

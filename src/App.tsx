import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import DesignSystemPage from './pages/DesignSystemPage';
import ComponentShowcasePage from './pages/ComponentShowcasePage';

// Create query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
        <Link 
          to="/design-system"
          className="px-6 py-3 rounded-lg font-medium transition-colors"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)'
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
          to="/showcase"
          className="px-6 py-3 rounded-lg font-medium transition-colors border"
          style={{ 
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-text-on-primary)'
          }}
        >
          Showcase (Demo) →
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/components" element={<ComponentShowcasePage />} />
            <Route path="/showcase" element={<ShowcaseRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// For public access demo (since auth isn't fully set up), we import ShowcasePage directly
import ShowcasePage from './pages/ShowcasePage';

function ShowcaseRedirect() {
  return <ShowcasePage />;
}

export default App;

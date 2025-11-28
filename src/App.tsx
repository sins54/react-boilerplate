import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DesignSystemPage from './pages/DesignSystemPage';

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
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

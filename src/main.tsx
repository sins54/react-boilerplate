import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import '@/lib/i18n' // Initialize i18n before rendering
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-primary)',
            }}
          />
        </div>
      </div>
    }>
      <App />
    </Suspense>
  </StrictMode>,
)

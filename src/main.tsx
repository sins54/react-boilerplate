import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import '@/lib/i18n' // Initialize i18n before rendering
import App from '@/App'

/**
 * Initialize MSW mock service worker in development mode.
 * This must complete before rendering the app to ensure all API calls are intercepted.
 */
async function enableMocking(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    })
  }
}

// Start mocking before rendering the app
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="text-center" role="status" aria-label="Loading translations">
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
})

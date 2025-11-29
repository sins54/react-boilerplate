import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlobalErrorBoundary } from './GlobalErrorBoundary'

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

// Suppress console.error for error boundary tests
const originalError = console.error

describe('GlobalErrorBoundary', () => {
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  describe('Normal Rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <GlobalErrorBoundary>
          <div>Child content</div>
        </GlobalErrorBoundary>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('does not show error UI when children render successfully', () => {
      render(
        <GlobalErrorBoundary>
          <div>Success</div>
        </GlobalErrorBoundary>
      )

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('renders fallback UI when a child throws an error', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('shows descriptive error message', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(
        screen.getByText(/We're sorry, but something unexpected happened/)
      ).toBeInTheDocument()
    })

    it('renders "Try again" button', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('renders "Reload page" button', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
    })
  })

  describe('Reset Functionality', () => {
    it('resets error state when "Try again" is clicked', async () => {
      const user = userEvent.setup()
      let shouldThrow = true

      function TestComponent() {
        if (shouldThrow) {
          throw new Error('Test error')
        }
        return <div>Recovered</div>
      }

      render(
        <GlobalErrorBoundary>
          <TestComponent />
        </GlobalErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Fix the error condition
      shouldThrow = false

      // Click try again
      await user.click(screen.getByRole('button', { name: /try again/i }))

      expect(screen.getByText('Recovered')).toBeInTheDocument()
    })
  })

  describe('Reload Page', () => {
    it('calls window.location.reload when "Reload page" is clicked', async () => {
      const user = userEvent.setup()
      const reloadMock = vi.fn()
      
      // Mock window.location.reload
      const originalLocation = window.location
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, reload: reloadMock },
        writable: true,
      })

      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      await user.click(screen.getByRole('button', { name: /reload page/i }))

      expect(reloadMock).toHaveBeenCalled()

      // Restore
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      })
    })
  })

  describe('onError Callback', () => {
    it('calls onError callback when error occurs', () => {
      const onError = vi.fn()

      render(
        <GlobalErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(onError).toHaveBeenCalled()
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      )
    })

    it('passes the actual error to onError callback', () => {
      const onError = vi.fn()

      render(
        <GlobalErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      const [error] = onError.mock.calls[0]
      expect(error.message).toBe('Test error message')
    })
  })

  describe('Design System Compliance', () => {
    it('uses CSS variables for primary button styling', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      expect(tryAgainButton).toHaveStyle({
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-on-primary)',
      })
    })

    it('uses CSS variables for secondary button styling', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      const reloadButton = screen.getByRole('button', { name: /reload page/i })
      expect(reloadButton).toHaveStyle({
        backgroundColor: 'var(--color-surface-hover)',
        color: 'var(--color-text)',
      })
    })

    it('uses CSS variables for error icon container', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      // The sad face icon container should use error-bg color
      const container = document.querySelector('.w-20.h-20')
      expect(container).toHaveStyle({
        backgroundColor: 'var(--color-error-bg)',
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Something went wrong'
      )
    })

    it('buttons are focusable', () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      )

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      const reloadButton = screen.getByRole('button', { name: /reload page/i })

      expect(tryAgainButton).not.toBeDisabled()
      expect(reloadButton).not.toBeDisabled()
    })
  })
})

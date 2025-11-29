import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Badge>Test Badge</Badge>)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('renders as a span element', () => {
      render(<Badge>Badge</Badge>)
      expect(screen.getByText('Badge').tagName).toBe('SPAN')
    })

    it('applies base styling classes', () => {
      render(<Badge data-testid="badge">Badge</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('items-center')
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('px-[length:var(--spacing-3)]')
      expect(badge).toHaveClass('py-[length:var(--spacing-1)]')
      expect(badge).toHaveClass('text-[length:var(--text-xs)]')
    })
  })

  describe('Solid Variants (default)', () => {
    it('renders default colorScheme', () => {
      render(<Badge data-testid="badge" colorScheme="default">Default</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-[color:var(--color-surface-hover)]')
      expect(badge).toHaveClass('text-[color:var(--color-text)]')
    })

    it('renders primary colorScheme', () => {
      render(<Badge data-testid="badge" colorScheme="primary">Primary</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-[color:var(--color-primary)]')
      expect(badge).toHaveClass('text-[color:var(--color-text-on-primary)]')
    })

    it('renders success colorScheme', () => {
      render(<Badge data-testid="badge" colorScheme="success">Success</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-[color:var(--color-success)]')
      expect(badge).toHaveClass('text-[color:var(--color-text-on-primary)]')
    })

    it('renders warning colorScheme', () => {
      render(<Badge data-testid="badge" colorScheme="warning">Warning</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-[color:var(--color-warning)]')
      expect(badge).toHaveClass('text-[color:var(--color-text-on-primary)]')
    })

    it('renders error colorScheme', () => {
      render(<Badge data-testid="badge" colorScheme="error">Error</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-[color:var(--color-error)]')
      expect(badge).toHaveClass('text-[color:var(--color-text-on-primary)]')
    })
  })

  describe('Outline Variants', () => {
    it('renders outline variant with default colorScheme', () => {
      render(
        <Badge data-testid="badge" variant="outline" colorScheme="default">
          Outline Default
        </Badge>
      )
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('border')
      expect(badge).toHaveClass('bg-transparent')
      expect(badge).toHaveClass('border-[color:var(--color-border)]')
      expect(badge).toHaveClass('text-[color:var(--color-text)]')
    })

    it('renders outline variant with primary colorScheme', () => {
      render(
        <Badge data-testid="badge" variant="outline" colorScheme="primary">
          Outline Primary
        </Badge>
      )
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-transparent')
      expect(badge).toHaveClass('border-[color:var(--color-primary)]')
      expect(badge).toHaveClass('text-[color:var(--color-primary)]')
    })

    it('renders outline variant with success colorScheme', () => {
      render(
        <Badge data-testid="badge" variant="outline" colorScheme="success">
          Outline Success
        </Badge>
      )
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-transparent')
      expect(badge).toHaveClass('border-[color:var(--color-success)]')
      expect(badge).toHaveClass('text-[color:var(--color-success)]')
    })

    it('renders outline variant with warning colorScheme', () => {
      render(
        <Badge data-testid="badge" variant="outline" colorScheme="warning">
          Outline Warning
        </Badge>
      )
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-transparent')
      expect(badge).toHaveClass('border-[color:var(--color-warning)]')
      expect(badge).toHaveClass('text-[color:var(--color-warning)]')
    })

    it('renders outline variant with error colorScheme', () => {
      render(
        <Badge data-testid="badge" variant="outline" colorScheme="error">
          Outline Error
        </Badge>
      )
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('bg-transparent')
      expect(badge).toHaveClass('border-[color:var(--color-error)]')
      expect(badge).toHaveClass('text-[color:var(--color-error)]')
    })
  })

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Badge data-testid="badge" className="custom-class">Custom</Badge>)
      expect(screen.getByTestId('badge')).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLSpanElement | null }
      render(<Badge ref={ref}>Ref Badge</Badge>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })
  })

  describe('Theme Compatibility', () => {
    it('uses CSS variables for light mode styling', () => {
      render(<Badge data-testid="badge" colorScheme="primary">Primary</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge.className).toContain('var(--color-primary)')
    })

    it('uses CSS variables that work in dark mode', () => {
      document.documentElement.classList.add('dark')
      render(<Badge data-testid="badge" colorScheme="primary">Primary</Badge>)
      const badge = screen.getByTestId('badge')
      // CSS variables automatically adapt to dark mode
      expect(badge.className).toContain('var(--color-primary)')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'

describe('Card', () => {
  describe('Card Root', () => {
    it('renders without crashing', () => {
      render(<Card data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('applies correct design system classes', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('rounded-[length:var(--radius-lg)]')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('border-[color:var(--color-border)]')
      expect(card).toHaveClass('bg-[color:var(--color-surface)]')
      expect(card).toHaveClass('shadow-[var(--shadow-sm)]')
    })

    it('accepts custom className', () => {
      render(<Card data-testid="card" className="custom-class">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLDivElement | null }
      render(<Card ref={ref}>Content</Card>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardHeader', () => {
    it('renders without crashing', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      expect(screen.getByTestId('header')).toBeInTheDocument()
    })

    it('applies correct layout classes', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('gap-[length:var(--spacing-2)]')
      expect(header).toHaveClass('p-[length:var(--spacing-6)]')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLDivElement | null }
      render(<CardHeader ref={ref}>Header</CardHeader>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardTitle', () => {
    it('renders as h3 element', () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(<CardTitle>Test Title</CardTitle>)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('applies correct typography classes', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>)
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('text-[length:var(--text-2xl)]')
      expect(title).toHaveClass('font-[number:var(--font-semibold)]')
      expect(title).toHaveClass('text-[color:var(--color-text)]')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLHeadingElement | null }
      render(<CardTitle ref={ref}>Title</CardTitle>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('CardDescription', () => {
    it('renders as p element', () => {
      render(<CardDescription>Description</CardDescription>)
      expect(screen.getByText('Description').tagName).toBe('P')
    })

    it('applies muted text color', () => {
      render(<CardDescription data-testid="desc">Description</CardDescription>)
      const desc = screen.getByTestId('desc')
      expect(desc).toHaveClass('text-[length:var(--text-sm)]')
      expect(desc).toHaveClass('text-[color:var(--color-text-muted)]')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLParagraphElement | null }
      render(<CardDescription ref={ref}>Description</CardDescription>)
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('CardContent', () => {
    it('renders without crashing', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('applies correct padding classes', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('p-[length:var(--spacing-6)]')
      expect(content).toHaveClass('pt-0')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLDivElement | null }
      render(<CardContent ref={ref}>Content</CardContent>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('CardFooter', () => {
    it('renders without crashing', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('applies correct layout classes', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('p-[length:var(--spacing-6)]')
      expect(footer).toHaveClass('pt-0')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null } as { current: HTMLDivElement | null }
      render(<CardFooter ref={ref}>Footer</CardFooter>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Full Card Composition', () => {
    it('renders a complete card with all subcomponents', () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
          <CardContent>Test content</CardContent>
          <CardFooter>Test footer</CardFooter>
        </Card>
      )

      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
      expect(screen.getByText('Test footer')).toBeInTheDocument()
    })
  })

  describe('Theme Compatibility', () => {
    it('uses CSS variables for light mode styling', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card.className).toContain('var(--color-surface)')
      expect(card.className).toContain('var(--color-border)')
    })

    it('uses CSS variables that work in dark mode', () => {
      document.documentElement.classList.add('dark')
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      // CSS variables automatically adapt to dark mode
      expect(card.className).toContain('var(--color-surface)')
    })
  })
})

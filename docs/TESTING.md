# Testing Guide

This document explains how to write, run, and maintain tests for the React component library.

## Overview

The project uses **Vitest** with **React Testing Library** for unit and integration testing. Tests are behavior-focused and follow testing best practices.

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode (interactive development)
npm run test

# Run tests once (CI/CD)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Coverage Reports

After running `npm run test:coverage`, you'll find:
- **Terminal output**: Summary of coverage percentages
- **`coverage/` directory**: Detailed HTML report (open `coverage/index.html` in a browser)
- **`coverage/lcov.info`**: Machine-readable coverage data for CI integration

## Test File Structure

Tests are placed **adjacent to their source files** with a `.test.tsx` or `.test.ts` suffix:

```
src/
├── components/
│   ├── overlay/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   ├── data-display/
│   │   ├── Card.tsx
│   │   └── Card.test.tsx
│   │   ├── Badge.tsx
│   │   └── Badge.test.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── useDebounce.test.ts
│   ├── useLocalStorage.ts
│   └── useLocalStorage.test.ts
```

## Testing Patterns

### 1. Component Rendering Tests

Verify components render without crashing and display correct content:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    render(<Button>Test Content</Button>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})
```

### 2. Prop Variation Tests

Test all variants and prop combinations:

```tsx
describe('Button Variants', () => {
  it('renders default variant', () => {
    render(<Button variant="default">Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-[color:var(--color-primary)]')
  })

  it('renders destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-[color:var(--color-error)]')
  })
})
```

### 3. Interaction Tests

Use `userEvent` for realistic user interactions:

```tsx
import userEvent from '@testing-library/user-event'

describe('Button Interactions', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
```

### 4. Theme Compatibility Tests

Verify components use CSS variables correctly:

```tsx
describe('Theme Compatibility', () => {
  it('uses CSS variables for styling', () => {
    render(<Button>Light Mode</Button>)
    const button = screen.getByRole('button')
    // Verify it uses CSS variables, not hardcoded colors
    expect(button.className).toContain('var(--color-primary)')
  })

  it('works in dark mode', () => {
    document.documentElement.classList.add('dark')
    render(<Button>Dark Mode</Button>)
    const button = screen.getByRole('button')
    // CSS variables automatically adapt to dark mode
    expect(button.className).toContain('var(--color-primary)')
  })
})
```

### 5. Hook Tests

Test custom hooks using `renderHook`:

```tsx
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })
})
```

### 6. Error Boundary Tests

Test error handling:

```tsx
// Component that throws
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error')
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    console.error = vi.fn() // Suppress error logs
  })

  it('renders fallback UI on error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Don't test internal state:**
```tsx
// Bad: Testing internal implementation
expect(component.state.isOpen).toBe(true)
```

✅ **Test observable behavior:**
```tsx
// Good: Testing what users see
expect(screen.getByRole('dialog')).toBeVisible()
```

### 2. Use Semantic Queries

Priority order for queries:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Visible content
5. `getByTestId` - Last resort

### 3. Arrange-Act-Assert Pattern

```tsx
it('increments counter on click', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<Counter />)
  
  // Act
  await user.click(screen.getByRole('button', { name: 'Increment' }))
  
  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 4. Keep Tests Independent

Each test should:
- Set up its own state
- Not depend on other tests
- Clean up after itself (handled by `afterEach` in setup)

### 5. Descriptive Test Names

```tsx
// Good: Clear, behavior-focused names
it('shows error message when form validation fails')
it('closes dropdown when clicking outside')
it('disables submit button while loading')

// Bad: Implementation-focused names
it('sets isValid to false')
it('calls handleClose')
it('updates loading state')
```

## Configuration

### Vitest Config (`vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/test/**/*',
        'src/main.tsx',
      ],
    },
  },
})
```

### Test Setup (`src/test/setup.ts`)

```ts
import '@testing-library/jest-dom'

// Mock window.matchMedia for theme testing
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Reset theme between tests
afterEach(() => {
  document.documentElement.classList.remove('dark', 'light')
})
```

## Continuous Integration

Example GitHub Actions workflow:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Troubleshooting

### Common Issues

**Tests failing with "cannot find module"**
- Ensure `tsconfig.json` includes test files
- Check that vitest types are included: `"types": ["vitest/globals"]`

**Async tests timing out**
- Increase timeout: `it('test', async () => {...}, 10000)`
- Ensure proper async/await usage

**Theme tests not working**
- Check that `setup.ts` resets document classes in `afterEach`
- Verify CSS is imported in test environment

**userEvent not working**
- Always use `const user = userEvent.setup()` before interactions
- Use `await` with user event methods

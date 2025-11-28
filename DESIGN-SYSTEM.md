# Design System Documentation

## Overview

This design system provides a consistent set of colors, typography, and spacing variables for building React applications. It uses **CSS custom properties (variables)** exclusively — **NO hardcoded hex values** are allowed in application code.

## Core Principles

### 1. NO Hardcoded Hex Values

❌ **Don't do this:**
```css
.button {
  background-color: #3b82f6;
  color: #ffffff;
}
```

✅ **Do this instead:**
```css
.button {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}
```

### 2. Use Semantic Variable Names

Always use semantic variable names that describe the **purpose**, not the color value:
- Use `--color-primary` not `--color-blue`
- Use `--color-error` not `--color-red`
- Use `--color-text` not `--color-dark-gray`

### 3. Support Light and Dark Modes

All colors automatically adapt to light/dark mode through CSS variables. Never define separate classes for dark mode colors.

## Color Variables

### Primary Colors
| Variable | Description | Usage |
|----------|-------------|-------|
| `--color-primary` | Main brand color | Buttons, links, accents |
| `--color-primary-hover` | Hover state | Interactive hover states |
| `--color-primary-active` | Active/pressed state | Click/press states |

### Background Colors
| Variable | Description | Usage |
|----------|-------------|-------|
| `--color-bg` | Page background | Main page background |
| `--color-bg-secondary` | Secondary background | Sidebar, sections |

### Surface Colors
| Variable | Description | Usage |
|----------|-------------|-------|
| `--color-surface` | Card/panel background | Cards, modals, dropdowns |
| `--color-surface-hover` | Hover state | Interactive surface hover |
| `--color-surface-active` | Active state | Interactive surface active |
| `--color-surface-elevated` | Elevated surfaces | Floating elements |

### Text Colors
| Variable | Description | Usage |
|----------|-------------|-------|
| `--color-text` | Primary text | Headings, body text |
| `--color-text-secondary` | Secondary text | Descriptions, captions |
| `--color-text-muted` | Muted text | Placeholders, hints |
| `--color-text-on-primary` | Text on primary color | Button text on primary |

### Border Colors
| Variable | Description | Usage |
|----------|-------------|-------|
| `--color-border` | Default border | Inputs, cards, dividers |
| `--color-border-hover` | Hover border | Input focus, hover states |

### Status Colors
| Variable | Description | Usage |
|----------|-------------|-------|
| `--color-error` | Error color | Error states, alerts |
| `--color-error-hover` | Error hover | Error button hover |
| `--color-error-bg` | Error background | Error alert background |
| `--color-error-text` | Error text | Error message text |
| `--color-success` | Success color | Success states, alerts |
| `--color-success-hover` | Success hover | Success button hover |
| `--color-success-bg` | Success background | Success alert background |
| `--color-success-text` | Success text | Success message text |
| `--color-warning` | Warning color | Warning states, alerts |
| `--color-warning-hover` | Warning hover | Warning button hover |
| `--color-warning-bg` | Warning background | Warning alert background |
| `--color-warning-text` | Warning text | Warning message text |

## Typography Scale

| Variable | Size | Usage |
|----------|------|-------|
| `--text-xs` | 0.75rem (12px) | Fine print, badges |
| `--text-sm` | 0.875rem (14px) | Captions, labels |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | Large body text |
| `--text-xl` | 1.25rem (20px) | Small headings |
| `--text-2xl` | 1.5rem (24px) | H3 headings |
| `--text-3xl` | 1.875rem (30px) | H2 headings |
| `--text-4xl` | 2.25rem (36px) | H1 headings |
| `--text-5xl` | 3rem (48px) | Display text |
| `--text-6xl` | 3.75rem (60px) | Hero text |

## Font Weights

| Variable | Weight | Usage |
|----------|--------|-------|
| `--font-thin` | 100 | Decorative thin text |
| `--font-light` | 300 | Light emphasis |
| `--font-normal` | 400 | Body text |
| `--font-medium` | 500 | Subtle emphasis |
| `--font-semibold` | 600 | Moderate emphasis |
| `--font-bold` | 700 | Strong emphasis |
| `--font-extrabold` | 800 | Extra strong emphasis |

## Spacing Scale

| Variable | Size | Usage |
|----------|------|-------|
| `--spacing-1` | 0.25rem (4px) | Tight spacing |
| `--spacing-2` | 0.5rem (8px) | Small spacing |
| `--spacing-3` | 0.75rem (12px) | Compact spacing |
| `--spacing-4` | 1rem (16px) | Base spacing |
| `--spacing-5` | 1.25rem (20px) | Medium spacing |
| `--spacing-6` | 1.5rem (24px) | Comfortable spacing |
| `--spacing-8` | 2rem (32px) | Large spacing |
| `--spacing-10` | 2.5rem (40px) | Extra large spacing |
| `--spacing-12` | 3rem (48px) | Section spacing |
| `--spacing-16` | 4rem (64px) | Page section spacing |

## Border Radius

| Variable | Size | Usage |
|----------|------|-------|
| `--radius-sm` | 0.25rem | Subtle rounding |
| `--radius-md` | 0.375rem | Default rounding |
| `--radius-lg` | 0.5rem | Medium rounding |
| `--radius-xl` | 0.75rem | Large rounding |
| `--radius-2xl` | 1rem | Extra large rounding |
| `--radius-full` | 9999px | Pill/circle shape |

## Theme Switching

### Manual Theme Control

Add the `dark` class to the `<html>` element to enable dark mode:

```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Enable light mode
document.documentElement.classList.add('light');

// Use system preference
document.documentElement.classList.remove('light', 'dark');
```

### System Preference

By default, the design system respects the user's system preference (`prefers-color-scheme`). To override this, explicitly add the `light` or `dark` class.

## Usage Examples

### React Component with Inline Styles

```tsx
function Card({ title, children }) {
  return (
    <div 
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)'
      }}
    >
      <h3 style={{ color: 'var(--color-text)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-secondary)' }}>{children}</p>
    </div>
  );
}
```

### Button Component

```tsx
function Button({ variant = 'primary', children, ...props }) {
  const styles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-text-on-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)'
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'var(--color-text-on-primary)'
    }
  };

  return (
    <button style={styles[variant]} {...props}>
      {children}
    </button>
  );
}
```

### Alert Component

```tsx
function Alert({ type = 'error', message }) {
  const styles = {
    error: {
      backgroundColor: 'var(--color-error-bg)',
      borderColor: 'var(--color-error)',
      color: 'var(--color-error-text)'
    },
    success: {
      backgroundColor: 'var(--color-success-bg)',
      borderColor: 'var(--color-success)',
      color: 'var(--color-success-text)'
    },
    warning: {
      backgroundColor: 'var(--color-warning-bg)',
      borderColor: 'var(--color-warning)',
      color: 'var(--color-warning-text)'
    }
  };

  return (
    <div 
      style={{
        ...styles[type],
        border: '1px solid',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-3)'
      }}
    >
      {message}
    </div>
  );
}
```

## File Structure

```
src/
├── styles/
│   └── colors.css      # Semantic color variables for Light/Dark modes
├── index.css           # Tailwind v4 setup and base styles
├── pages/
│   └── DesignSystemPage.tsx  # Design system showcase
└── App.tsx             # Main app with routing
```

## Viewing the Design System

Navigate to `/design-system` in your application to see the live design system showcase with:
- Interactive theme toggle (Light/Dark/System)
- Full color palette grid
- Typography scale demonstration
- Font weights showcase
- Spacing scale visualization
- Component examples (buttons, cards, alerts, inputs)

## Contributing

When adding new colors or variables:
1. Add the variable to `src/styles/colors.css` for both light and dark modes
2. Document the variable in this file
3. Update the DesignSystemPage to showcase the new variable
4. Never use hardcoded hex values — always use CSS variables

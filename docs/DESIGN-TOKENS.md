# Design Tokens Documentation

## Overview

This document explains the **Design Token Automation System** for our React + Tailwind v4 boilerplate. Design tokens are the single source of truth for our visual design language, stored in a structured JSON format and automatically compiled to CSS variables.

## The Workflow

### Updating Design Tokens

1. **Edit the source file**: Open `tokens.json` at the project root
2. **Make your changes**: Add, modify, or remove token values
3. **Generate CSS**: Run the generator script
4. **Verify changes**: Check `src/styles/colors.css` for the output

### Running the Generator

```bash
# Generate CSS from tokens.json
npm run generate-tokens
```

This command reads `tokens.json` and outputs a complete CSS file to `src/styles/colors.css`.

## The JSON Structure

The `tokens.json` file is organized into three main sections:

### Global Tokens

Global tokens are design values that remain constant across all themes. These include:

```json
{
  "global": {
    "radii": {
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "full": "9999px"
    },
    "spacing": {
      "1": "0.25rem",
      "2": "0.5rem",
      ...
    },
    "fontSizes": { ... },
    "fontWeights": { ... },
    "lineHeights": { ... },
    "shadows": { ... },
    "transitions": { ... },
    "fonts": { ... }
  }
}
```

These values generate CSS variables like:
- `--radius-sm`, `--radius-md`, etc.
- `--spacing-1`, `--spacing-2`, etc.
- `--text-xs`, `--text-sm`, etc.

### Light Mode Tokens

Light mode colors are the default theme values:

```json
{
  "light": {
    "colors": {
      "bg": "#ffffff",
      "surface": "#ffffff",
      "text": "#0f172a",
      "primary": "#3b82f6",
      ...
    }
  }
}
```

These generate variables in the `:root` selector with the `--color-` prefix:
```css
:root {
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-primary: #3b82f6;
}
```

### Dark Mode Tokens

Dark mode colors override light mode when the `.dark` class is present:

```json
{
  "dark": {
    "colors": {
      "bg": "#0f172a",
      "surface": "#1e293b",
      "text": "#f8fafc",
      "primary": "#60a5fa",
      ...
    }
  }
}
```

These generate variables in the `.dark` selector:
```css
.dark {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f8fafc;
  --color-primary: #60a5fa;
}
```

## Token Categories

### Background Colors
| Token | CSS Variable | Description |
|-------|--------------|-------------|
| `bg` | `--color-bg` | Main application background |
| `bg-secondary` | `--color-bg-secondary` | Secondary background |
| `surface` | `--color-surface` | Card and panel backgrounds |
| `surface-hover` | `--color-surface-hover` | Hover state for surfaces |
| `surface-active` | `--color-surface-active` | Active/pressed state for surfaces |
| `surface-elevated` | `--color-surface-elevated` | Elevated surface (modals, dropdowns) |

### Text Colors
| Token | CSS Variable | Description |
|-------|--------------|-------------|
| `text` | `--color-text` | Primary body text |
| `text-secondary` | `--color-text-secondary` | Secondary/supporting text |
| `text-muted` | `--color-text-muted` | Muted/placeholder text |
| `text-on-primary` | `--color-text-on-primary` | Text on primary color backgrounds |

### Border Colors
| Token | CSS Variable | Description |
|-------|--------------|-------------|
| `border` | `--color-border` | Default border color |
| `border-hover` | `--color-border-hover` | Border hover state |

### Brand Colors
| Token | CSS Variable | Description |
|-------|--------------|-------------|
| `primary` | `--color-primary` | Primary brand color |
| `primary-hover` | `--color-primary-hover` | Primary hover state |
| `primary-active` | `--color-primary-active` | Primary active state |
| `secondary` | `--color-secondary` | Secondary brand color |
| `secondary-hover` | `--color-secondary-hover` | Secondary hover state |
| `destructive` | `--color-destructive` | Destructive action color |
| `destructive-hover` | `--color-destructive-hover` | Destructive hover state |

### Feedback Colors
| Token | CSS Variable | Description |
|-------|--------------|-------------|
| `success` | `--color-success` | Success state |
| `success-bg` | `--color-success-bg` | Success background |
| `success-text` | `--color-success-text` | Success text |
| `warning` | `--color-warning` | Warning state |
| `warning-bg` | `--color-warning-bg` | Warning background |
| `warning-text` | `--color-warning-text` | Warning text |
| `error` | `--color-error` | Error state |
| `error-bg` | `--color-error-bg` | Error background |
| `error-text` | `--color-error-text` | Error text |
| `info` | `--color-info` | Info state |
| `info-bg` | `--color-info-bg` | Info background |
| `info-text` | `--color-info-text` | Info text |

## Generated Output

The generator produces a CSS file with four main blocks:

### 1. Root Variables (`:root`)
Contains global tokens (spacing, radii, fonts, etc.) and light mode colors as the default theme.

### 2. Dark Variables (`.dark`)
Contains dark mode color overrides applied when the `.dark` class is present on the `<html>` element.

### 3. System Preference Media Query
Automatically applies dark mode colors when the user's system preference is dark (unless `.light` class is present).

### 4. Tailwind v4 Theme (`@theme`)
Maps semantic variables to Tailwind's color utilities:

```css
@theme {
  --color-bg: var(--color-bg);
  --color-primary: var(--color-primary);
  ...
}
```

This enables using tokens with Tailwind classes like `bg-bg`, `text-primary`, etc.

## Usage in Code

### CSS Variables
```css
.my-element {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

### Tailwind Classes
```tsx
<div className="bg-surface text-text border border-border">
  Content
</div>
```

### Inline Styles (React)
```tsx
<div style={{ backgroundColor: 'var(--color-surface)' }}>
  Content
</div>
```

## Figma Integration

### Theoretical Workflow

This JSON structure is designed to be compatible with Figma export plugins:

1. **Figma Design**: Create your design system in Figma with properly named styles
2. **Export Plugin**: Use a plugin like "Tokens Studio" or "Design Tokens" to export
3. **Transform**: The exported JSON may need transformation to match our structure
4. **Import**: Replace or merge with `tokens.json`
5. **Generate**: Run `npm run generate-tokens`

### Recommended Figma Plugins

- **Tokens Studio for Figma**: Most popular, supports JSON export
- **Figma Tokens**: Native token management with JSON export
- **Style Dictionary**: Adobe's solution for design token transformation

### Mapping Figma to Our Structure

When exporting from Figma, you may need to map their structure to ours:

| Figma Naming | Our Token |
|--------------|-----------|
| `colors/background/default` | `bg` |
| `colors/text/primary` | `text` |
| `colors/brand/primary` | `primary` |
| `radii/small` | `radii.sm` |

## Best Practices

### 1. Naming Conventions
- Use semantic names (purpose-based) not visual names (color-based)
- Use kebab-case for all token names
- Group related tokens with common prefixes

### 2. Consistency
- Ensure light and dark modes have the same token keys
- Test both themes after making changes
- Document any new tokens added

### 3. Version Control
- Commit `tokens.json` changes with meaningful messages
- The generated CSS should also be committed
- Review token changes carefully in PRs

### 4. Testing
After regenerating tokens:
1. Run `npm run build` to ensure no CSS errors
2. Test the app in both light and dark modes
3. Check components for visual regressions

## Troubleshooting

### "tokens.json not found"
Ensure the file exists at the project root (not in `src/` or `scripts/`).

### CSS Variables Not Updating
1. Re-run `npm run generate-tokens`
2. Clear browser cache
3. Check for CSS import order in `index.css`

### Tailwind Classes Not Working
Ensure `src/styles/colors.css` is imported in your main CSS file before using Tailwind's `@theme` utilities.

## File Structure

```
project-root/
├── tokens.json                 # Source of truth
├── scripts/
│   └── generate-tokens.js      # Generator script
├── src/
│   └── styles/
│       └── colors.css          # Generated output
└── docs/
    └── DESIGN-TOKENS.md        # This documentation
```

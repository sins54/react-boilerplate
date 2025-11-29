# Storybook Guide

This document explains how to use Storybook for interactive component documentation and development.

## Overview

**Storybook** is an interactive component gallery that allows you to:
- Browse all components in isolation
- See all variants and states
- Test interactions
- Check accessibility
- Switch between light and dark themes

## Running Storybook

### Development Mode

```bash
npm run storybook
```

This starts Storybook at `http://localhost:6006`.

### Build Static Version

```bash
npm run build-storybook
```

This creates a static build in the `storybook-static/` directory.

## Project Structure

```
.storybook/
├── main.ts          # Storybook configuration
└── preview.ts       # Global decorators and parameters

src/
├── components/
│   ├── overlay/
│   │   ├── Button.tsx
│   │   └── Button.stories.tsx
│   ├── data-display/
│   │   ├── Card.tsx
│   │   └── Card.stories.tsx
│   │   ├── Badge.tsx
│   │   └── Badge.stories.tsx
```

## Writing Stories

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

// Meta configuration
const meta = {
  title: 'Overlay/Button',           // Category/ComponentName
  component: Button,
  parameters: {
    layout: 'centered',              // Layout: 'centered' | 'fullscreen' | 'padded'
    docs: {
      description: {
        component: 'A button component with variants.',
      },
    },
  },
  tags: ['autodocs'],                // Enable auto-generated docs
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Individual stories
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}
```

### Stories with Custom Render

For complex layouts or multiple components:

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
}
```

### Stories with Actions

```tsx
export const Interactive: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Clicked!'),
  },
}
```

## Theme Switching

Storybook is configured with a theme toggle in the toolbar. Click the theme icon to switch between:

- **Light**: Forces light mode (`.light` class)
- **Dark**: Forces dark mode (`.dark` class)
- **System**: Uses `prefers-color-scheme`

This is configured in `.storybook/preview.ts`:

```tsx
globalTypes: {
  theme: {
    description: 'Global theme for components',
    toolbar: {
      title: 'Theme',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'system', title: 'System' },
      ],
    },
  },
},
```

## Addons

The project includes these Storybook addons:

### @storybook/addon-docs
- Auto-generates documentation pages
- Enables MDX support
- Shows prop tables

### @storybook/addon-a11y
- Accessibility audit panel
- Shows WCAG violations
- Highlights accessibility issues

### @chromatic-com/storybook
- Visual testing integration
- Catch visual regressions

## Best Practices

### 1. Show All Variants

Create stories for each significant variant:

```tsx
export const Default: Story = { args: { variant: 'default' } }
export const Destructive: Story = { args: { variant: 'destructive' } }
export const Outline: Story = { args: { variant: 'outline' } }
```

### 2. Show All States

Include interactive states:

```tsx
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true } }
```

### 3. Show Real-World Examples

Include practical usage examples:

```tsx
export const InCard: Story = {
  render: () => (
    <Card>
      <CardContent>
        <Button>Save</Button>
      </CardContent>
    </Card>
  ),
}
```

### 4. Document Props

Use `argTypes` for interactive controls:

```tsx
argTypes: {
  size: {
    control: 'select',
    options: ['sm', 'md', 'lg'],
    description: 'The size of the button',
    table: {
      defaultValue: { summary: 'md' },
    },
  },
}
```

### 5. Add Descriptions

```tsx
parameters: {
  docs: {
    description: {
      component: 'Main description for the component.',
      story: 'Specific description for this story.',
    },
  },
},
```

## Creating MDX Documentation

For rich documentation pages, create `.mdx` files:

```mdx
{/* Form.mdx */}
import { Meta, Canvas, Story } from '@storybook/blocks'
import * as InputStories from './Input.stories'

<Meta title="Form/Overview" />

# Form Components

Our form components integrate with React Hook Form for validation.

## Input

<Canvas of={InputStories.Default} />

## Usage

```tsx
import { Form, Input } from '@/components/form'

function MyForm() {
  const form = useForm()
  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Input name="email" label="Email" />
    </Form>
  )
}
```
```

## Deployment

### Vercel

1. Connect your repository
2. Set build command: `npm run build-storybook`
3. Set output directory: `storybook-static`

### Netlify

1. Connect your repository
2. Set build command: `npm run build-storybook`
3. Set publish directory: `storybook-static`

### Chromatic

```bash
npx chromatic --project-token=<token>
```

### GitHub Pages

```yaml
# .github/workflows/deploy-storybook.yml
name: Deploy Storybook

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build-storybook
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

## Removing Storybook

When starting a real project and you no longer need the component gallery:

### Step 1: Uninstall Dependencies

```bash
npm uninstall storybook @storybook/react-vite @chromatic-com/storybook \
  @storybook/addon-vitest @storybook/addon-a11y @storybook/addon-docs \
  @storybook/addon-onboarding @vitest/browser-playwright playwright
```

### Step 2: Remove Configuration

```bash
rm -rf .storybook
```

### Step 3: Remove Story Files

```bash
find src -name "*.stories.tsx" -delete
find src -name "*.stories.ts" -delete
find src -name "*.mdx" -delete
```

### Step 4: Update package.json

Remove scripts from `package.json`:

```diff
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run",
- "test:coverage": "vitest run --coverage",
- "storybook": "storybook dev -p 6006",
- "build-storybook": "storybook build"
+ "test:coverage": "vitest run --coverage"
}
```

### Step 5: Remove Build Artifacts

```bash
rm -rf storybook-static
```

### Step 6: Update .gitignore (if applicable)

Remove Storybook-related entries:

```diff
- storybook-static/
- *.stories.tsx
```

## Troubleshooting

### Styles Not Loading

Ensure CSS is imported in `.storybook/preview.ts`:

```ts
import '../src/index.css'
```

### Theme Toggle Not Working

Check that the decorator applies classes correctly:

```ts
decorators: [
  (Story, context) => {
    const theme = context.globals.theme
    document.documentElement.classList.remove('light', 'dark')
    if (theme !== 'system') {
      document.documentElement.classList.add(theme)
    }
    return <Story />
  },
],
```

### Build Failing

Common issues:
- TypeScript errors in stories
- Missing dependencies
- Incompatible addon versions

Run `npm run build-storybook -- --debug` for detailed errors.

### HMR Not Working

Restart Storybook:
```bash
npm run storybook
```

Clear cache if issues persist:
```bash
rm -rf node_modules/.cache/storybook
npm run storybook
```

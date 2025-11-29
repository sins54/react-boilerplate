import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'Overlay/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes. Uses Design System CSS variables for automatic light/dark mode support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'The content of the button',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Default button
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
}

// All variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants using Design System semantic colors.',
      },
    },
  },
}

// Destructive variant
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

// Outline variant
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

// Secondary variant
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

// Ghost variant
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
}

// Link variant
export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
}

// All sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔔</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons come in multiple sizes to fit different contexts.',
      },
    },
  },
}

// Small size
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

// Large size
export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
}

// Icon size
export const Icon: Story = {
  args: {
    children: '🔔',
    size: 'icon',
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

// Disabled variants
export const DisabledVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
      <Button variant="default" disabled>Default</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="link" disabled>Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants in their disabled state.',
      },
    },
  },
}

// With custom className
export const WithCustomClass: Story = {
  args: {
    children: 'Custom Width',
    className: 'w-full',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with a custom Tailwind class for full width.',
      },
    },
  },
}

// Interactive example
export const Interactive: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the button to see the onClick handler in action.',
      },
    },
  },
}

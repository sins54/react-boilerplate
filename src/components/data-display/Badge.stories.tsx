import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A badge component for displaying status, labels, or counts. Uses Design System CSS variables for automatic light/dark mode support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline'],
      description: 'The visual style of the badge',
    },
    colorScheme: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error'],
      description: 'The color scheme of the badge',
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// Default badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

// All solid color schemes
export const SolidVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
      <Badge colorScheme="default">Default</Badge>
      <Badge colorScheme="primary">Primary</Badge>
      <Badge colorScheme="success">Success</Badge>
      <Badge colorScheme="warning">Warning</Badge>
      <Badge colorScheme="error">Error</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All solid badge color schemes using Design System semantic colors.',
      },
    },
  },
}

// All outline color schemes
export const OutlineVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
      <Badge variant="outline" colorScheme="default">Default</Badge>
      <Badge variant="outline" colorScheme="primary">Primary</Badge>
      <Badge variant="outline" colorScheme="success">Success</Badge>
      <Badge variant="outline" colorScheme="warning">Warning</Badge>
      <Badge variant="outline" colorScheme="error">Error</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All outline badge color schemes. Outline badges have a transparent background with a colored border.',
      },
    },
  },
}

// Primary badge
export const Primary: Story = {
  args: {
    children: 'Primary',
    colorScheme: 'primary',
  },
}

// Success badge
export const Success: Story = {
  args: {
    children: 'Success',
    colorScheme: 'success',
  },
}

// Warning badge
export const Warning: Story = {
  args: {
    children: 'Warning',
    colorScheme: 'warning',
  },
}

// Error badge
export const Error: Story = {
  args: {
    children: 'Error',
    colorScheme: 'error',
  },
}

// Outline default
export const OutlineDefault: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

// Outline primary
export const OutlinePrimary: Story = {
  args: {
    children: 'Outline Primary',
    variant: 'outline',
    colorScheme: 'primary',
  },
}

// Status badges example
export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>Order Status:</span>
        <Badge colorScheme="success">Completed</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>Payment:</span>
        <Badge colorScheme="warning">Pending</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>Account:</span>
        <Badge colorScheme="error">Suspended</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges are commonly used to show status information.',
      },
    },
  },
}

// Badge with icon
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
      <Badge colorScheme="success">
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <span>✓</span> Active
        </span>
      </Badge>
      <Badge colorScheme="warning">
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <span>⚠</span> Warning
        </span>
      </Badge>
      <Badge colorScheme="error">
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <span>✕</span> Error
        </span>
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges can include icons alongside text.',
      },
    },
  },
}

// Count badges
export const CountBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ color: 'var(--color-text)' }}>Notifications</span>
        <Badge colorScheme="error">3</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ color: 'var(--color-text)' }}>Messages</span>
        <Badge colorScheme="primary">12</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        <span style={{ color: 'var(--color-text)' }}>Updates</span>
        <Badge colorScheme="success">99+</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badges are perfect for showing notification counts.',
      },
    },
  },
}

// Labels in a list
export const LabelsList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-3)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}>
        <span style={{ color: 'var(--color-text)' }}>Bug Report #1234</span>
        <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
          <Badge variant="outline" colorScheme="error">bug</Badge>
          <Badge variant="outline" colorScheme="primary">high-priority</Badge>
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-3)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}>
        <span style={{ color: 'var(--color-text)' }}>Feature Request #5678</span>
        <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
          <Badge variant="outline" colorScheme="success">enhancement</Badge>
          <Badge variant="outline">good-first-issue</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Outline badges work great as labels/tags in lists.',
      },
    },
  },
}

// All combinations
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-2)', color: 'var(--color-text)' }}>Solid</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Badge variant="solid" colorScheme="default">Default</Badge>
          <Badge variant="solid" colorScheme="primary">Primary</Badge>
          <Badge variant="solid" colorScheme="success">Success</Badge>
          <Badge variant="solid" colorScheme="warning">Warning</Badge>
          <Badge variant="solid" colorScheme="error">Error</Badge>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-2)', color: 'var(--color-text)' }}>Outline</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Badge variant="outline" colorScheme="default">Default</Badge>
          <Badge variant="outline" colorScheme="primary">Primary</Badge>
          <Badge variant="outline" colorScheme="success">Success</Badge>
          <Badge variant="outline" colorScheme="warning">Warning</Badge>
          <Badge variant="outline" colorScheme="error">Error</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of all badge variant and color scheme combinations.',
      },
    },
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'
import { Button } from '@/components/overlay/Button'

const meta = {
  title: 'Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component for displaying content in a contained, elevated surface. Uses Design System CSS variables for automatic light/dark mode support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Basic card
export const Default: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some example text.</p>
      </CardContent>
    </Card>
  ),
}

// Complete card with all subcomponents
export const Complete: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Complete Card</CardTitle>
        <CardDescription>This card has all subcomponents.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card. You can put any content here including text, images, forms, or other components.</p>
      </CardContent>
      <CardFooter style={{ justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complete card with header, title, description, content, and footer with action buttons.',
      },
    },
  },
}

// Card without description
export const WithoutDescription: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A card with just a title and content.</p>
      </CardContent>
    </Card>
  ),
}

// Content only card
export const ContentOnly: Story = {
  render: () => (
    <Card style={{ width: '350px', padding: 'var(--spacing-4)' }}>
      <p>A simple card with just content and no header or footer.</p>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sometimes you just need a simple container.',
      },
    },
  },
}

// Stats card example
export const StatsCard: Story = {
  render: () => (
    <Card style={{ width: '200px' }}>
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle style={{ fontSize: 'var(--text-3xl)' }}>$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
          +20.1% from last month
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a stats/metrics card layout.',
      },
    },
  },
}

// Multiple cards in a grid
export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)', maxWidth: '900px' }}>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
            <CardDescription>Description for card {i}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content for card {i}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards can be arranged in a grid layout.',
      },
    },
  },
}

// Interactive card with hover
export const Interactive: Story = {
  render: () => (
    <Card 
      style={{ 
        width: '350px',
        cursor: 'pointer',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      }}
      className="hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over this card to see the effect.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects applied through Tailwind classes.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards can be made interactive with hover effects.',
      },
    },
  },
}

// Form in card
export const WithForm: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label 
              htmlFor="name" 
              style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-2)', 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
              }}
            >
              Name
            </label>
            <input 
              id="name"
              type="text"
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label 
              htmlFor="email"
              style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-2)', 
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
              }}
            >
              Email
            </label>
            <input 
              id="email"
              type="email"
              placeholder="john@example.com"
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter style={{ justifyContent: 'flex-end' }}>
        <Button>Create Account</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards are commonly used to wrap forms.',
      },
    },
  },
}

// Custom styled card
export const CustomStyled: Story = {
  render: () => (
    <Card 
      style={{ 
        width: '350px',
        borderColor: 'var(--color-primary)',
        borderWidth: '2px',
      }}
    >
      <CardHeader>
        <CardTitle style={{ color: 'var(--color-primary)' }}>Featured</CardTitle>
        <CardDescription>This card has custom border styling.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Custom styles can be applied via style prop or className.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards can be customized with additional styles while maintaining design system compliance.',
      },
    },
  },
}

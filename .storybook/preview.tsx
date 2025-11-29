import type { Preview } from '@storybook/react-vite'

// Import the design system styles
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // We use our design system colors
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme

      // Apply theme to document
      const root = document.documentElement
      root.classList.remove('light', 'dark')

      if (theme === 'light') {
        root.classList.add('light')
      } else if (theme === 'dark') {
        root.classList.add('dark')
      }
      // 'system' leaves it to prefers-color-scheme

      return (
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: 'var(--spacing-4)',
            minHeight: '100vh',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
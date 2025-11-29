import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Vendor chunk for data management
          'vendor-data': ['@tanstack/react-query', '@tanstack/react-table', 'axios'],
          // Vendor chunk for UI libraries
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-separator',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          // Vendor chunk for form libraries
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Vendor chunk for utilities
          'vendor-utils': ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
        },
      },
    },
  },
})

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

/**
 * Design System Page
 * 
 * Showcases the color grid, typography scale, and theme toggle.
 * All colors use CSS variables - NO hardcoded hex values.
 */
export default function DesignSystemPage() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light', 'dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Design System
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            Color palette, typography scale, and theming guide
          </p>
        </header>

        {/* Theme Toggle Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Theme Toggle
          </h2>
          <div className="flex gap-4">
            <ThemeButton 
              active={theme === 'light'} 
              onClick={() => setTheme('light')}
              label="Light"
              icon="☀️"
            />
            <ThemeButton 
              active={theme === 'dark'} 
              onClick={() => setTheme('dark')}
              label="Dark"
              icon="🌙"
            />
            <ThemeButton 
              active={theme === 'system'} 
              onClick={() => setTheme('system')}
              label="System"
              icon="💻"
            />
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Current theme: <strong>{theme}</strong>
          </p>
        </section>

        {/* Color Grid Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Color Palette
          </h2>
          
          <div className="grid gap-8">
            {/* Primary Colors */}
            <ColorGroup title="Primary" colors={primaryColors} />
            
            {/* Background Colors */}
            <ColorGroup title="Background" colors={backgroundColors} />
            
            {/* Surface Colors */}
            <ColorGroup title="Surface" colors={surfaceColors} />
            
            {/* Text Colors */}
            <ColorGroup title="Text" colors={textColors} />
            
            {/* Border Colors */}
            <ColorGroup title="Border" colors={borderColors} />
            
            {/* Error Colors */}
            <ColorGroup title="Error" colors={errorColors} />
            
            {/* Success Colors */}
            <ColorGroup title="Success" colors={successColors} />
            
            {/* Warning Colors */}
            <ColorGroup title="Warning" colors={warningColors} />
          </div>
        </section>

        {/* Typography Scale Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Typography Scale
          </h2>
          
          <div 
            className="p-6 rounded-lg" 
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            {typographyScale.map((item) => (
              <div 
                key={item.name}
                className="flex items-baseline gap-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <span 
                  className="w-20 text-sm font-mono"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.name}
                </span>
                <span 
                  className="w-20 text-sm font-mono"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.size}
                </span>
                <span 
                  style={{ 
                    fontSize: `var(--text-${item.variable})`,
                    color: 'var(--color-text)'
                  }}
                >
                  {item.sample}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Font Weights Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Font Weights
          </h2>
          
          <div 
            className="p-6 rounded-lg" 
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            {fontWeights.map((item) => (
              <div 
                key={item.name}
                className="flex items-baseline gap-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <span 
                  className="w-28 text-sm font-mono"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.name}
                </span>
                <span 
                  className="w-16 text-sm font-mono"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.weight}
                </span>
                <span 
                  className="text-xl"
                  style={{ 
                    fontWeight: `var(--font-${item.variable})`,
                    color: 'var(--color-text)'
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Scale Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Spacing Scale
          </h2>
          
          <div 
            className="p-6 rounded-lg" 
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            <div className="flex flex-wrap gap-4 items-end">
              {spacingScale.map((item) => (
                <div key={item.name} className="flex flex-col items-center">
                  <div 
                    style={{ 
                      width: `var(--spacing-${item.variable})`,
                      height: `var(--spacing-${item.variable})`,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  />
                  <span 
                    className="mt-2 text-xs font-mono"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {item.name}
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Component Examples Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            Component Examples
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                Buttons
              </h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  className="px-4 py-2 rounded-md font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-on-primary)'
                  }}
                >
                  Primary
                </button>
                <button 
                  className="px-4 py-2 rounded-md font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-surface-hover)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  Secondary
                </button>
                <button 
                  className="px-4 py-2 rounded-md font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-error)',
                    color: 'var(--color-text-on-primary)'
                  }}
                >
                  Danger
                </button>
                <button 
                  className="px-4 py-2 rounded-md font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-success)',
                    color: 'var(--color-text-on-primary)'
                  }}
                >
                  Success
                </button>
              </div>
            </div>

            {/* Cards */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                Card
              </h3>
              <div 
                className="p-4 rounded-md"
                style={{ 
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Card Title
                </h4>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  This is an example card using the design system colors and spacing.
                </p>
              </div>
            </div>

            {/* Alerts */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                Alerts
              </h3>
              <div className="space-y-3">
                <div 
                  className="p-3 rounded-md"
                  style={{ 
                    backgroundColor: 'var(--color-error-bg)',
                    border: '1px solid var(--color-error)',
                    color: 'var(--color-error-text)'
                  }}
                >
                  Error: Something went wrong!
                </div>
                <div 
                  className="p-3 rounded-md"
                  style={{ 
                    backgroundColor: 'var(--color-success-bg)',
                    border: '1px solid var(--color-success)',
                    color: 'var(--color-success-text)'
                  }}
                >
                  Success: Operation completed!
                </div>
                <div 
                  className="p-3 rounded-md"
                  style={{ 
                    backgroundColor: 'var(--color-warning-bg)',
                    border: '1px solid var(--color-warning)',
                    color: 'var(--color-warning-text)'
                  }}
                >
                  Warning: Please review changes.
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div 
              className="p-6 rounded-lg" 
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text)' }}>
                Form Inputs
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Text input"
                  className="w-full px-3 py-2 rounded-md outline-none"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
                <textarea 
                  placeholder="Textarea"
                  rows={3}
                  className="w-full px-3 py-2 rounded-md outline-none resize-none"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="pt-8 text-center"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p style={{ color: 'var(--color-text-muted)' }}>
            Design System v1.0 • Built with React + Vite + Tailwind CSS v4
          </p>
        </footer>
      </div>
    </div>
  );
}

/* Theme Button Component */
interface ThemeButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

function ThemeButton({ active, onClick, label, icon }: ThemeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
      style={{
        backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
        color: active ? 'var(--color-text-on-primary)' : 'var(--color-text)',
        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* Color Group Component */
interface ColorGroupProps {
  title: string;
  colors: ColorItem[];
}

interface ColorItem {
  name: string;
  variable: string;
  description: string;
}

function ColorGroup({ title, colors }: ColorGroupProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {colors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>
    </div>
  );
}

/* Color Swatch Component */
function ColorSwatch({ name, variable, description }: ColorItem) {
  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{ 
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)'
      }}
    >
      <div 
        className="h-16 w-full"
        style={{ backgroundColor: `var(--${variable})` }}
      />
      <div className="p-3">
        <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
          {name}
        </p>
        <p className="text-xs font-mono mt-1" style={{ color: 'var(--color-text-muted)' }}>
          --{variable}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* Color Data */
const primaryColors: ColorItem[] = [
  { name: 'Primary', variable: 'color-primary', description: 'Main brand color' },
  { name: 'Primary Hover', variable: 'color-primary-hover', description: 'Hover state' },
  { name: 'Primary Active', variable: 'color-primary-active', description: 'Active state' },
];

const backgroundColors: ColorItem[] = [
  { name: 'Background', variable: 'color-bg', description: 'Page background' },
  { name: 'Background Secondary', variable: 'color-bg-secondary', description: 'Secondary bg' },
];

const surfaceColors: ColorItem[] = [
  { name: 'Surface', variable: 'color-surface', description: 'Card/panel bg' },
  { name: 'Surface Hover', variable: 'color-surface-hover', description: 'Hover state' },
  { name: 'Surface Active', variable: 'color-surface-active', description: 'Active state' },
  { name: 'Surface Elevated', variable: 'color-surface-elevated', description: 'Elevated elements' },
];

const textColors: ColorItem[] = [
  { name: 'Text', variable: 'color-text', description: 'Primary text' },
  { name: 'Text Secondary', variable: 'color-text-secondary', description: 'Secondary text' },
  { name: 'Text Muted', variable: 'color-text-muted', description: 'Muted text' },
  { name: 'Text on Primary', variable: 'color-text-on-primary', description: 'Text on primary' },
];

const borderColors: ColorItem[] = [
  { name: 'Border', variable: 'color-border', description: 'Default border' },
  { name: 'Border Hover', variable: 'color-border-hover', description: 'Hover border' },
];

const errorColors: ColorItem[] = [
  { name: 'Error', variable: 'color-error', description: 'Error color' },
  { name: 'Error Hover', variable: 'color-error-hover', description: 'Error hover' },
  { name: 'Error Background', variable: 'color-error-bg', description: 'Error bg' },
  { name: 'Error Text', variable: 'color-error-text', description: 'Error text' },
];

const successColors: ColorItem[] = [
  { name: 'Success', variable: 'color-success', description: 'Success color' },
  { name: 'Success Hover', variable: 'color-success-hover', description: 'Success hover' },
  { name: 'Success Background', variable: 'color-success-bg', description: 'Success bg' },
  { name: 'Success Text', variable: 'color-success-text', description: 'Success text' },
];

const warningColors: ColorItem[] = [
  { name: 'Warning', variable: 'color-warning', description: 'Warning color' },
  { name: 'Warning Hover', variable: 'color-warning-hover', description: 'Warning hover' },
  { name: 'Warning Background', variable: 'color-warning-bg', description: 'Warning bg' },
  { name: 'Warning Text', variable: 'color-warning-text', description: 'Warning text' },
];

/* Typography Scale Data */
const typographyScale = [
  { name: 'text-xs', variable: 'xs', size: '0.75rem', sample: 'Extra small text' },
  { name: 'text-sm', variable: 'sm', size: '0.875rem', sample: 'Small text' },
  { name: 'text-base', variable: 'base', size: '1rem', sample: 'Base text size' },
  { name: 'text-lg', variable: 'lg', size: '1.125rem', sample: 'Large text' },
  { name: 'text-xl', variable: 'xl', size: '1.25rem', sample: 'Extra large text' },
  { name: 'text-2xl', variable: '2xl', size: '1.5rem', sample: 'Heading 2XL' },
  { name: 'text-3xl', variable: '3xl', size: '1.875rem', sample: 'Heading 3XL' },
  { name: 'text-4xl', variable: '4xl', size: '2.25rem', sample: 'Heading 4XL' },
  { name: 'text-5xl', variable: '5xl', size: '3rem', sample: 'Display 5XL' },
  { name: 'text-6xl', variable: '6xl', size: '3.75rem', sample: 'Display 6XL' },
];

/* Font Weights Data */
const fontWeights = [
  { name: 'font-thin', variable: 'thin', weight: '100' },
  { name: 'font-light', variable: 'light', weight: '300' },
  { name: 'font-normal', variable: 'normal', weight: '400' },
  { name: 'font-medium', variable: 'medium', weight: '500' },
  { name: 'font-semibold', variable: 'semibold', weight: '600' },
  { name: 'font-bold', variable: 'bold', weight: '700' },
  { name: 'font-extrabold', variable: 'extrabold', weight: '800' },
];

/* Spacing Scale Data */
const spacingScale = [
  { name: 'spacing-1', variable: '1', size: '0.25rem' },
  { name: 'spacing-2', variable: '2', size: '0.5rem' },
  { name: 'spacing-3', variable: '3', size: '0.75rem' },
  { name: 'spacing-4', variable: '4', size: '1rem' },
  { name: 'spacing-5', variable: '5', size: '1.25rem' },
  { name: 'spacing-6', variable: '6', size: '1.5rem' },
  { name: 'spacing-8', variable: '8', size: '2rem' },
  { name: 'spacing-10', variable: '10', size: '2.5rem' },
  { name: 'spacing-12', variable: '12', size: '3rem' },
  { name: 'spacing-16', variable: '16', size: '4rem' },
];

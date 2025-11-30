#!/usr/bin/env node

/**
 * Design Token Generator Script
 * 
 * Reads tokens.json and generates src/styles/colors.css
 * Compatible with Tailwind CSS v4
 * 
 * Usage: node scripts/generate-tokens.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// File paths
const TOKENS_PATH = path.join(rootDir, 'tokens.json');
const OUTPUT_PATH = path.join(rootDir, 'src', 'styles', 'colors.css');

/**
 * Read and parse tokens.json
 */
function readTokens() {
  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`Error: tokens.json not found at ${TOKENS_PATH}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(TOKENS_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing tokens.json:', error.message);
    process.exit(1);
  }
}

/**
 * Generate global variables (radii, spacing, fonts, etc.)
 */
function generateGlobalVariables(global) {
  const lines = [];
  
  // Font families
  if (global.fonts) {
    for (const [key, value] of Object.entries(global.fonts)) {
      lines.push(`  --font-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Font sizes
  if (global.fontSizes) {
    for (const [key, value] of Object.entries(global.fontSizes)) {
      lines.push(`  --text-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Line heights
  if (global.lineHeights) {
    for (const [key, value] of Object.entries(global.lineHeights)) {
      lines.push(`  --leading-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Font weights
  if (global.fontWeights) {
    for (const [key, value] of Object.entries(global.fontWeights)) {
      lines.push(`  --font-weight-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Spacing
  if (global.spacing) {
    for (const [key, value] of Object.entries(global.spacing)) {
      lines.push(`  --spacing-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Border radii
  if (global.radii) {
    for (const [key, value] of Object.entries(global.radii)) {
      lines.push(`  --radius-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Shadows
  if (global.shadows) {
    for (const [key, value] of Object.entries(global.shadows)) {
      lines.push(`  --shadow-${key}: ${value};`);
    }
    lines.push('');
  }
  
  // Transitions
  if (global.transitions) {
    for (const [key, value] of Object.entries(global.transitions)) {
      lines.push(`  --transition-${key}: ${value};`);
    }
  }
  
  return lines;
}

/**
 * Generate color variables for a mode (light/dark)
 * Uses --color-* prefix for backward compatibility
 */
function generateColorVariables(colors) {
  const lines = [];
  
  for (const [key, value] of Object.entries(colors)) {
    lines.push(`  --color-${key}: ${value};`);
  }
  
  return lines;
}

/**
 * Generate Tailwind v4 @theme block
 * Maps semantic variables to Tailwind color utilities
 */
function generateThemeBlock(lightColors) {
  const lines = [];
  
  // Map color variables to Tailwind theme
  for (const key of Object.keys(lightColors)) {
    lines.push(`  --color-${key}: var(--color-${key});`);
  }
  
  return lines;
}

/**
 * Generate the complete CSS file content
 */
function generateCSS(tokens) {
  const { global, light, dark } = tokens;
  
  const lines = [
    '/**',
    ' * Design System - Auto-generated CSS Variables',
    ' * ',
    ' * THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.',
    ' * Edit tokens.json and run: npm run generate-tokens',
    ' * ',
    ' * These CSS variables define the color palette for Light and Dark modes.',
    ' * IMPORTANT: Always use these variables instead of hardcoded hex values.',
    ' * ',
    ' * Usage: var(--color-primary), var(--color-bg), etc.',
    ' */',
    '',
    '/* ================================================',
    '   ROOT VARIABLES (Global + Light Mode)',
    '   ================================================ */',
    ':root {',
  ];
  
  // Add global variables
  if (global) {
    lines.push('  /* Global Design Tokens */');
    lines.push(...generateGlobalVariables(global));
    lines.push('');
  }
  
  // Add light mode colors
  if (light?.colors) {
    lines.push('  /* Light Mode Colors */');
    lines.push(...generateColorVariables(light.colors));
  }
  
  lines.push('}');
  lines.push('');
  
  // Dark mode block
  lines.push('/* ================================================');
  lines.push('   DARK MODE VARIABLES');
  lines.push('   ================================================ */');
  lines.push('.dark {');
  
  if (dark?.colors) {
    lines.push(...generateColorVariables(dark.colors));
  }
  
  lines.push('}');
  lines.push('');
  
  // System preference fallback
  lines.push('/* System preference based dark mode (fallback if no .dark class) */');
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push('  :root:not(.light) {');
  
  if (dark?.colors) {
    for (const [key, value] of Object.entries(dark.colors)) {
      lines.push(`    --color-${key}: ${value};`);
    }
  }
  
  lines.push('  }');
  lines.push('}');
  lines.push('');
  
  // Tailwind v4 @theme block
  lines.push('/* ================================================');
  lines.push('   TAILWIND v4 THEME MAPPING');
  lines.push('   ================================================ */');
  lines.push('@theme {');
  
  if (light?.colors) {
    lines.push(...generateThemeBlock(light.colors));
  }
  
  lines.push('}');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Ensure the output directory exists
 */
function ensureOutputDir() {
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Main function
 */
function main() {
  console.log('🎨 Design Token Generator');
  console.log('========================\n');
  
  // Read tokens
  console.log('📖 Reading tokens.json...');
  const tokens = readTokens();
  
  // Validate structure
  if (!tokens.global && !tokens.light && !tokens.dark) {
    console.error('Error: tokens.json must contain at least one of: global, light, dark');
    process.exit(1);
  }
  
  // Generate CSS
  console.log('🔧 Generating CSS variables...');
  const css = generateCSS(tokens);
  
  // Write output
  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATH, css, 'utf-8');
  
  // Report statistics
  const globalCount = tokens.global ? Object.keys(tokens.global).reduce((acc, key) => {
    return acc + Object.keys(tokens.global[key] || {}).length;
  }, 0) : 0;
  const lightCount = tokens.light?.colors ? Object.keys(tokens.light.colors).length : 0;
  const darkCount = tokens.dark?.colors ? Object.keys(tokens.dark.colors).length : 0;
  
  console.log('\n✅ CSS generated successfully!');
  console.log(`   📁 Output: ${OUTPUT_PATH}`);
  console.log(`   📊 Statistics:`);
  console.log(`      - Global tokens: ${globalCount}`);
  console.log(`      - Light mode colors: ${lightCount}`);
  console.log(`      - Dark mode colors: ${darkCount}`);
  console.log(`      - Total variables: ${globalCount + lightCount + darkCount}`);
  console.log('\n🎉 Done!\n');
}

// Run the script
main();

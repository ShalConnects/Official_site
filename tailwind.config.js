import { defineConfig } from 'tailwindcss';

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          green: {
            DEFAULT: '#176641',
            light: '#1e7a4f',
            dark: '#0f4a2a',
          },
          orange: {
            DEFAULT: '#da651e',
            light: '#e67a2e',
            dark: '#b85218',
          },
        },
        // Theme-aware aliases (optional - for new code)
        theme: {
          bg: {
            primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
          },
          text: {
            primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
          },
          border: {
            primary: 'rgb(var(--color-border-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
          },
          hover: 'rgb(var(--color-hover-bg) / <alpha-value>)',
        },
      },
    },
  },
});

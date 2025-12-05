// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tła i powierzchnie
        'pd-bg': '#020617',
        'pd-surface': '#0f172a',
        'pd-surface-soft': '#1e293b',
        'pd-border': '#334155',
        // Tekst i ikonografia
        'pd-foreground': '#f8fafc',
        'pd-muted': '#64748b',
        'pd-muted-foreground': '#94a3b8',
        // Akcenty
        'pd-accent': '#06b6d4',
        'pd-accent-soft': '#22d3ee1a',
        // Stany
        'pd-success': '#22c55e',
        'pd-warning': '#f59e0b',
        'pd-danger': '#ef4444',
        // Brand (dopasowanie do starego landingu)
        'brand-dark': 'rgb(var(--brand-dark))',
        'brand-card': 'rgb(var(--brand-card))',
        'brand-accent': 'rgb(var(--brand-accent))',
        'brand-secondary': 'rgb(var(--brand-secondary))',
        'brand-border': 'rgb(var(--brand-border))',
        // Nowa paleta primary z papadata-landing-page
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 25px rgba(34, 211, 238, 0.35)',
        'neon-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
          '50%': { transform: 'translateX(-60%) skewX(-15deg)' },
          '100%': { transform: 'translateX(150%) skewX(-15deg)' },
        },
        grow: {
          '0%': { height: '0%' },
          '100%': { height: 'var(--target-height)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 3s linear infinite',
        'bar-grow': 'grow 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;

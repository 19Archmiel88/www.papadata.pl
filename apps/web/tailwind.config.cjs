// @ts-nocheck
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './**/*.{ts,tsx}',
    '!./node_modules/**',
    '!./dist/**',
  ],
  theme: {
    screens: {
      xs: '360px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      portrait: { raw: '(orientation: portrait)' },
      landscape: { raw: '(orientation: landscape)' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '4xs': ['0.4375rem', { lineHeight: '1rem' }],
        '3xs': ['0.5rem', { lineHeight: '1rem' }],
        '2xs': ['0.5625rem', { lineHeight: '1rem' }],
        xs: ['0.625rem', { lineHeight: '1rem' }],
        'xs-plus': ['0.6875rem', { lineHeight: '1rem' }],
        sm2: ['0.75rem', { lineHeight: '1.25rem' }],
        'sm-plus': ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      colors: {
        light: {
          bg: '#FCFCFF',
          text: '#0F172A',
          muted: '#64748B',
          surface: '#FFFFFF',
          border: '#F1F5F9',
        },
        dark: {
          bg: '#030407',
          text: '#F9FAFB',
          muted: '#9CA3AF',
          surface: '#0D0E12',
          border: '#1F2937',
        },
        brand: {
          start: '#4F46E5',
          end: '#0EA5E9',
          focus: '#4F46E5',
        },
        neon: {
          glow: '#A7F3D0',
          cyan: '#22D3EE',
          teal: '#14B8A6',
          lime: '#A3E635',
          ink: '#05070F',
        },
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
        'neon-halo':
          'radial-gradient(circle at top, rgba(34,211,238,0.35), transparent 60%)',
      },
      animation: {
        aurora: 'aurora 30s ease infinite alternate',
        shimmer: 'shimmer 2.5s linear infinite',
        scanline: 'scanline 8s linear infinite',
        reveal: 'reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'scroll-right': 'scroll-right 40s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(-10%, -10%) scale(1.1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(500%)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

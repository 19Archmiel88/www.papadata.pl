import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'pd-bg': '#020617'
      },
      boxShadow: {
        'neon-cyan': '0 0 25px rgba(34, 211, 238, 0.35)',
        'neon-emerald': '0 0 25px rgba(16, 185, 129, 0.35)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
};

export default config;

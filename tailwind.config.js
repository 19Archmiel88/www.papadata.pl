/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./apps/web/src/**/*.{js,ts,jsx,tsx,html}', './libs/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      fontSize: {
        '4xs': '0.5rem' /* dostosuj */,
        '3xs': '0.625rem',
        '2xs': '0.75rem',
        '1xs': '0.8125rem',
        hero: ['clamp(24px,4.5vw,42px)', { lineHeight: '1.1' }],
      },
    },
  },
  plugins: [],
};

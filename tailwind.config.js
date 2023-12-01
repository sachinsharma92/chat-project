/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,html}',
    '/components/**/*.{js,ts,jsx,tsx,html}',
    '/app/**/*.{js,ts,jsx,tsx,html}',
    '@/components/**/*.{js,ts,jsx,tsx,html}',
    '@/app/**/*.{js,ts,jsx,tsx,html}',
    'components/**/*.{js,ts,jsx,tsx,html}',
    'app/**/*.{js,ts,jsx,tsx,html}',
    './src/**/*.{js,ts,jsx,tsx,html}',
    './src/components/**/*.{js,ts,jsx,tsx,html}',
    './src/app/**/*.{js,ts,jsx,tsx,html}',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

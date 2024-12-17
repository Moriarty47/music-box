/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'default': 'hsl(var(--default) / <alpha-value>)',
        'foreground': 'hsl(var(--foreground) / <alpha-value>)',
        'foreground-track': 'hsl(var(--foreground-track) / <alpha-value>)',
        'background': 'hsl(var(--background) / <alpha-value>)',
      },
      boxShadow: {
        offset: 'var(--offset-shadow)',
        middle: 'var(--middle-shadow)',
      },
      borderRadius: {
        xxl: '0.875rem',
      },
    },
  },
  plugins: [],
};

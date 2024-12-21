import plugin from 'tailwindcss/plugin';

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
        'lightgreen': 'hsl(var(--lightgreen) / <alpha-value>)',
        'lightblue': 'hsl(var(--lightblue) / <alpha-value>)',
      },
      boxShadow: {
        offset: 'var(--offset-shadow)',
        middle: 'var(--middle-shadow)',
      },
      borderRadius: {
        inherit: 'inherit',
        xxl: '0.875rem',
        xxxl: '0.575rem',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities({
        'inset-x': (value) => {
          if (value.includes(' ')) {
            const [left, right] = value.split(' ');
            return { left, right };
          }
          return { left: value, right: value };
        },
      }, { type: 'position', values: theme('inset-x') });
      matchUtilities({
        'inset-y': (value) => {
          if (value.includes(' ')) {
            const [top, bottom] = value.split(' ');
            return { top, bottom };
          }
          return { top: value, bottom: value };
        },
      }, { type: 'position', values: theme('inset-y') });
    }),
  ],
};

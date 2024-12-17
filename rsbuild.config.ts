/* eslint-disable ts/no-require-imports */
import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { pluginTailwindCSS } from 'rsbuild-plugin-tailwindcss';

// const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  pluginTailwindCSS({
    config: './tailwind.config.ts',
    include: /\.[jt]sx?$/,
    exclude: [/[\\/]node_modules[\\/]/, /\.mjs$/, /\.json/],
  }),
  pluginBabel({
    include: /\.(?:jsx|tsx)$/,
  }),
  pluginSolid(),
];

const config = defineConfig({
  plugins,
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './index.tsx',
    },
    tsconfigPath: './tsconfig.app.json',
  },
  server: {
    port: 5500,
  },
  tools: {
    lightningcssLoader: false,
    postcss: {
      postcssOptions: {
        plugins: [
          require('tailwindcss/nesting'),
          require('tailwindcss'),
        ],
      },
    },
  },
});

export default config;

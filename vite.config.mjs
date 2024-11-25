import path from 'path';
import { defineConfig } from 'vite';
import { viteGlobalPlugin } from './vite.plugin.selector.mjs';

export default defineConfig({
  plugins: [
    viteGlobalPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 5500,
  },
  build: {
    target: 'es2020',
    outDir: path.resolve(__dirname, 'dist'),
  }
});
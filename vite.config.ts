import fs from 'node:fs';
import path from 'node:path';

import { minify } from 'html-minifier-terser';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  server: {
    open: true,
    port: 5500,
  },
  base: '/',
  build: {
    target: 'es2020',
    outDir: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    solid(),
    {
      name: 'vite-plugin-static-fetch',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (['.bmp', '.lrc'].some(ext => req.url?.endsWith(ext))) {
            const ph = path.join(__dirname, 'public', decodeURIComponent(req.url!));
            if (!fs.existsSync(ph)) {
              res.statusCode = 404;
              res.end('No resource found.');
              return;
            }
          }
          next();
        });
      },
    },
    {
      name: 'vite-plugin-compress',
      apply: 'build',
      generateBundle() {
        const srcPath = path.resolve(__dirname, './public/list.json');
        const json = JSON.stringify(JSON.parse(fs.readFileSync(srcPath, 'utf-8')));
        this.emitFile({
          type: 'asset',
          fileName: 'list.json',
          source: json,
        });
      },
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return minify(html, {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: false,
            removeEmptyAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
          });
        },
      },
    },
  ],
});

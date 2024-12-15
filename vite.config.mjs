import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { minify } from 'html-minifier-terser';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 5500,
  },
  base: '/',
  build: {
    target: 'es2020',
    outDir: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    {
      name: 'vite-plugin-static-fetch',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (['.bmp', '.lrc'].some(ext => req.url.endsWith(ext))) {
            const ph = path.join(__dirname, 'public', decodeURIComponent(req.url));
            if (!fs.existsSync(ph)) {
              res.statusCode = 404;
              res.end('No resource found.');
              return;
            }
          }
          next();
        });
      }
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
        }
      }
    }
  ]
});
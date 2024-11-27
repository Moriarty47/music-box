import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
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
  },
  plugins: [
    ((options) => ({
      name: 'vite-static-fetch',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (['.bmp', '.lrc'].some(ext => req.url.endsWith(ext))) {
            const ph = path.join(options?.rootDir ?? __dirname, 'public', decodeURIComponent(req.url));
            if (!fs.existsSync(ph)) {
              res.statusCode = 404;
              res.end('No resource found.');
              return;
            }
          }
          next();
        });
      }
    }))()
  ]
});
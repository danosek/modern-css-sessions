import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

export default defineConfig(({ command }) => ({
  base: './',
  plugins: [
    svelte(),
    // Dev: zpřístupní soubory z repo rootu na /demos/
    command === 'serve' && {
      name: 'demo-files',
      configureServer(server) {
        server.middlewares.use('/demos', (req, res, next) => {
          const filePath = path.join(repoRoot, req.url);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath);
            const mime = {
              '.css': 'text/css',
              '.html': 'text/html',
              '.js': 'application/javascript',
            }[ext] ?? 'text/plain';
            res.setHeader('Content-Type', mime);
            res.end(fs.readFileSync(filePath));
          } else {
            next();
          }
        });
      },
    },
  ].filter(Boolean),
  build: {
    outDir: '../editor',
    emptyOutDir: true,
  },
}));

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
        const mimes = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript' };

        function serveRepoFile(urlPath, res, next) {
          const filePath = path.join(repoRoot, urlPath.split('?')[0]);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const mime = mimes[path.extname(filePath)];
            if (mime) {
              res.setHeader('Content-Type', mime);
              res.setHeader('Cache-Control', 'no-store');
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        }

        // /demos/s1/d1/style.css  (VITE_DEMOS_BASE = /demos/)
        server.middlewares.use('/demos', (req, res, next) => {
          serveRepoFile(req.url, res, next);
        });

        // /__demo_css/s1/d1  → serves s1/d1/style.css as text/css
        // URL has no .css extension so Vite's transform pipeline never matches it.
        server.middlewares.use('/__demo_css', (req, res, next) => {
          const demoPath = req.url.replace(/^\/+|\/+$/g, '');
          const filePath = path.join(repoRoot, demoPath, 'style.css');
          if (demoPath && fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.end(fs.readFileSync(filePath));
          } else {
            next();
          }
        });

        // Catch-all: /s1/d1/style.css  (DEMOS_BASE fell back to '../')
        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? '').split('?')[0];
          if (/^\/(s\d+|shared)\//.test(url)) {
            serveRepoFile(url, res, next);
          } else {
            next();
          }
        });

        // Watch demo + shared files so HMR events fire on external edits
        server.watcher.add(repoRoot + '/s*/d*/index.html');
        server.watcher.add(repoRoot + '/s*/d*/style.css');
        server.watcher.add(repoRoot + '/s*/d*/script.js');
        server.watcher.add(repoRoot + '/shared/*.css');
      },

      handleHotUpdate({ file, server }) {
        const rel = path.relative(repoRoot, file);
        const isDemo = /^s\d+\/d\d+\/(index\.html|style\.css|script\.js)$/.test(rel);
        const isShared = /^shared\/.+\.css$/.test(rel);
        if (!isDemo && !isShared) return;

        console.log(`\x1b[36m[demo-watch]\x1b[0m ${rel}`);
        server.ws.send({ type: 'custom', event: 'demo-file-changed', data: { file: rel } });
        return [];
      },
    },
  ].filter(Boolean),
  build: {
    outDir: '../editor',
    emptyOutDir: true,
  },
}));

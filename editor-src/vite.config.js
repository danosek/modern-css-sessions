import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { syncTheme } from '../scripts/sync-theme.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// Source of the design-system theme — gitignored, local-only. Edits here are
// auto-published to shared/spectro-theme.css during dev (see watcher below).
const THEME_SRC = path.join(repoRoot, 'src/spectro/spectro-theme.css');

export default defineConfig(({ command }) => ({
  base: './',
  // Multi-page: dev serves the landing page at `/` and the editor at `/editor/`
  // (mirrors the deployed layout). No SPA fallback — unknown routes 404 so the
  // demo/shared static middleware below stays in full control.
  appType: 'mpa',
  plugins: [
    svelte(),
    // Dev: zpřístupní soubory z repo rootu na /demos/
    command === 'serve' && {
      name: 'demo-files',
      configureServer(server) {
        const mimes = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript' };

        // ── Page routing ──────────────────────────────────────────────────────
        // `/`        → index-page.html  (přehled sessions / landing)
        // `/editor/` → index.html       (CSS editor; loaded via ?demo=s1/d1)
        // Registered in the configureServer body, so it runs *before* Vite's
        // own HTML middleware. Only exact page URLs are rewritten — every asset,
        // module and /demos|/shared request falls through untouched.
        server.middlewares.use((req, res, next) => {
          const [pathname, query = ''] = (req.url ?? '').split('?');
          const qs = query ? `?${query}` : '';
          if (pathname === '/' || pathname === '/index.html') {
            req.url = `/index-page.html${qs}`;
          } else if (pathname === '/editor' || pathname === '/editor/' || pathname === '/editor/index.html') {
            req.url = `/index.html${qs}`;
          }
          next();
        });

        // ── Design-system theme: src/spectro → shared (live) ──────────────────
        // Publish once at startup so shared/ reflects src/ from the first paint,
        // then on every save (handled in handleHotUpdate). No-op when src/ is
        // absent (e.g. a fresh clone — src/ is gitignored).
        const initial = syncTheme();
        if (initial === 'synced') console.log('\x1b[36m[theme-sync]\x1b[0m published src/spectro → shared/spectro-theme.css');
        if (initial === 'no-source') console.log('\x1b[33m[theme-sync]\x1b[0m src/spectro/ not found — skipping (local-only source)');

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
        server.watcher.add(repoRoot + '/shared/*.js');
        // Watch the design-system source so edits propagate to shared/ (below)
        server.watcher.add(THEME_SRC);
      },

      handleHotUpdate({ file, server }) {
        const rel = path.relative(repoRoot, file);

        // Design-system theme source changed → republish to shared/. The write
        // re-triggers this hook for shared/spectro-theme.css, which fans out the
        // demo-file-changed event below. Avoids duplicating the HMR wiring.
        if (rel === 'src/spectro/spectro-theme.css') {
          if (syncTheme() === 'synced') console.log(`\x1b[36m[theme-sync]\x1b[0m ${rel} → shared/spectro-theme.css`);
          return [];
        }

        const isDemo = /^s\d+\/d\d+\/(index\.html|style\.css|script\.js)$/.test(rel);
        const isShared = /^shared\/.+\.(css|js)$/.test(rel);
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

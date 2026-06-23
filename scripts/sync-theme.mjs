// Sync the Spectro design-system theme from the local source (`src/spectro/`,
// gitignored — exported by the Spectro tool with relative font paths) into the
// deployed artifact (`shared/spectro-theme.css`, committed & served via jsDelivr).
//
// The only difference between the two files is the @font-face `url(...)`: the
// source uses relative paths (`../fonts/x.woff2`) so it previews locally inside
// the Spectro tool, while the published copy must point at the jsDelivr CDN so
// the woff2 files load with the correct MIME type on GitHub Pages / StackBlitz.
//
// Used in two places:
//   - `npm run sync:theme`        → one-shot manual sync
//   - the dev server's watcher    → auto-sync on every save to the source
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, '..');

const SRC  = path.join(repoRoot, 'src/spectro/spectro-theme.css');
const DEST = path.join(repoRoot, 'shared/spectro-theme.css');

const CDN_FONTS = 'https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@main/shared/fonts/';

/** Rewrite relative font URLs to the jsDelivr CDN (handles both quote styles). */
function publishFontUrls(css) {
  return css
    .replaceAll("url('../fonts/", `url('${CDN_FONTS}`)
    .replaceAll('url("../fonts/', `url("${CDN_FONTS}`);
}

/**
 * Copy `src/spectro/spectro-theme.css` → `shared/spectro-theme.css`, rewriting
 * font URLs. Idempotent: only writes when the result actually differs, so it
 * never produces spurious git noise.
 *
 * @returns {'synced' | 'unchanged' | 'no-source'}
 */
export function syncTheme() {
  if (!fs.existsSync(SRC)) return 'no-source';
  const published = publishFontUrls(fs.readFileSync(SRC, 'utf8'));
  const current = fs.existsSync(DEST) ? fs.readFileSync(DEST, 'utf8') : null;
  if (published === current) return 'unchanged';
  fs.writeFileSync(DEST, published);
  return 'synced';
}

// CLI entry: `node scripts/sync-theme.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = syncTheme();
  const msg = {
    synced: '✓ shared/spectro-theme.css synced from src/spectro/',
    unchanged: '· shared/spectro-theme.css already up to date',
    'no-source': '! src/spectro/spectro-theme.css not found — nothing to sync (src/ is gitignored, local-only)',
  }[result];
  console.log(msg);
}

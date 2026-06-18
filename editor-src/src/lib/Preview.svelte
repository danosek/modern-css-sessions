<script>
  const DEMOS_BASE = import.meta.env.VITE_DEMOS_BASE ?? '../';
  const STYLE_ID = '__preview_user_css';

  let { html = '', css = '', js = '', sharedCss = '', sharedJs = '', demoPath = '', theme = 'light' } = $props();

  let iframe;
  let lastScroll = { x: 0, y: 0 };
  // Snapshot of the inputs whose change requires a full iframe reload.
  let prev = null;

  function buildSrcdoc(html, css, js, sharedCss, sharedJs, demoPath, theme) {
    if (!html) return '';

    const baseHref = new URL(DEMOS_BASE + demoPath + '/', window.location.href).href;

    let doc = html
      .replace(/(<html[^>]*\s)data-theme="[^"]*"/, `$1data-theme="${theme}"`)
      .replace('<head>', `<head>\n  <base href="${baseHref}">`)
      .replace(
        /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/,
        `<style id="${STYLE_ID}">\n${css}\n</style>`,
      )
      .replace(/<script\s+src="script\.js"\s*><\/script>/, '');

    if (sharedCss) {
      doc = doc
        .replace(/\s*<link\s+rel="stylesheet"\s+href="https:\/\/cdn\.jsdelivr\.net[^"]*"[^>]*>/g, '')
        .replace('<head>', `<head>\n<style>\n${sharedCss}\n</style>`);
    }

    // Dev: nahraď CDN highlighter lokální verzí (jinak by se v preview načítal
    // z napinovaného CDN hashe a lokální úpravy by se neprojevily).
    if (sharedJs) {
      doc = doc.replace(/\s*<script[^>]*\bsrc="https:\/\/cdn\.jsdelivr\.net[^"]*demo-highlight\.js"[^>]*><\/script>/g, '');
    }

    if (js) doc = doc.replace('</body>', '<script>\n' + js + '\n<\/script>\n</body>');
    if (sharedJs) doc = doc.replace('</body>', '<script>\n' + sharedJs + '\n<\/script>\n</body>');

    return doc;
  }

  function captureScroll() {
    try {
      const w = iframe?.contentWindow;
      if (w) lastScroll = { x: w.scrollX, y: w.scrollY };
    } catch { /* same-origin guard */ }
  }

  function restoreScroll() {
    try {
      iframe?.contentWindow?.scrollTo(lastScroll.x, lastScroll.y);
    } catch { /* same-origin guard */ }
  }

  // Live-patch the user's CSS without reloading the iframe.
  function applyCss() {
    const el = iframe?.contentDocument?.getElementById(STYLE_ID);
    if (el) el.textContent = '\n' + css + '\n';
  }

  // Live-patch the theme attribute without reloading the iframe.
  function applyTheme() {
    const root = iframe?.contentDocument?.documentElement;
    if (root) root.dataset.theme = theme;
  }

  // After a (re)load: re-sync the live values (they may have changed while the
  // document was loading) and restore the scroll position captured beforehand.
  function handleLoad() {
    applyCss();
    applyTheme();
    restoreScroll();
  }

  $effect(() => {
    // Track every input so the effect re-runs on any change.
    const cur = { html, css, js, sharedCss, sharedJs, demoPath, theme };
    if (!iframe) return;

    const needsReload =
      !prev ||
      prev.html      !== cur.html ||
      prev.js        !== cur.js ||
      prev.sharedCss !== cur.sharedCss ||
      prev.sharedJs  !== cur.sharedJs ||
      prev.demoPath  !== cur.demoPath;

    if (needsReload) {
      // Structural change (initial load / HMR). CSS + theme are baked into the
      // fresh document; handleLoad re-syncs them and restores the scroll position.
      captureScroll();
      iframe.srcdoc = buildSrcdoc(cur.html, cur.css, cur.js, cur.sharedCss, cur.sharedJs, cur.demoPath, cur.theme);
    } else {
      // Only CSS and/or theme changed (typing, reset, theme toggle) → patch the
      // live document in place. No reload, so scroll position is kept and there
      // is no flicker.
      if (cur.css   !== prev.css)   applyCss();
      if (cur.theme !== prev.theme) applyTheme();
    }

    prev = cur;
  });
</script>

<iframe bind:this={iframe} title="Preview" onload={handleLoad}></iframe>

<style>
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
</style>

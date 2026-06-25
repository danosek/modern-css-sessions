<script>
  import { onMount } from 'svelte';
  import CssEditor from './lib/CssEditor.svelte';
  import Preview from './lib/Preview.svelte';
  import HtmlPanel from './lib/HtmlPanel.svelte';
  import JsPanel from './lib/JsPanel.svelte';
  import { ArrowLeft, Code2, FileCode, RotateCcw, Sun, Moon } from 'lucide-svelte';

  const DEMOS_BASE = import.meta.env.VITE_DEMOS_BASE ?? '../';
  const demoPath = new URLSearchParams(location.search).get('demo')?.replace(/\/$/, '') ?? '';

  function cssUrl(path) {
    return import.meta.env.DEV ? `/__demo_css/${path}` : `${DEMOS_BASE}${path}/style.css`;
  }

  function unwrapViteCss(text) {
    const m = text.match(/const __vite__css = ("(?:[^"\\]|\\.)*")/);
    return m ? JSON.parse(m[1]) : text;
  }

  function extractBody(fullHtml) {
    const m = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return m ? m[1].trim() : fullHtml;
  }

  let html        = $state('');
  let css         = $state('');
  let js          = $state('');
  let sharedCss   = $state('');
  let sharedJs    = $state('');
  let originalCss = $state('');
  let htmlOpen    = $state(false);
  let jsOpen      = $state(false);
  let session     = $state('');
  let feature     = $state('');
  let theme       = $state(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  let loading     = $state(true);
  let error       = $state('');
  let title       = $state(demoPath);

  // Resize state
  let leftFraction    = $state(0.33);  // fraction of grid width for left column
  let htmlPanelHeight = $state(220);   // px height of HTML panel when open
  let jsPanelHeight   = $state(220);   // px height of JS panel when open
  let colResizing     = $state(false);
  let rowResizing     = $state(false);

  let editorEl;

  onMount(async () => {
    if (!demoPath) {
      error = 'Chybí URL parametr ?demo= (např. ?demo=s1/t1)';
      loading = false;
      return;
    }
    try {
      const fetches = [
        fetch(DEMOS_BASE + demoPath + '/index.html'),
        fetch(cssUrl(demoPath)),
        fetch(DEMOS_BASE + demoPath + '/script.js'),
      ];
      if (import.meta.env.DEV) {
        fetches.push(
          fetch('/shared/spectro-theme.css'),
          fetch('/shared/demo-base.css'),
          fetch('/shared/demo-highlight.js'),
        );
      }
      const [htmlRes, cssRes, jsRes, themeRes, baseRes, hlRes] = await Promise.all(fetches);
      if (!htmlRes.ok) throw new Error(`Demo nenalezeno: ${demoPath}`);
      html        = await htmlRes.text();
      css         = cssRes.ok ? unwrapViteCss(await cssRes.text()) : '';
      js          = jsRes.ok ? await jsRes.text() : '';
      if (import.meta.env.DEV) {
        sharedCss = (themeRes?.ok ? await themeRes.text() : '')
                  + (baseRes?.ok  ? await baseRes.text()  : '');
        sharedJs  = hlRes?.ok ? await hlRes.text() : '';
      }
      originalCss = css;
      const mTitle   = html.match(/<h1[^>]*class="demo-title"[^>]*>([^<]+)<\/h1>/);
      const mSession = html.match(/class="demo-session"[^>]*>([^<]+)</);
      const mFeature = html.match(/class="demo-feature"[^>]*>([^<]+)</);
      if (mTitle)   title   = mTitle[1];
      if (mSession) session = mSession[1];
      if (mFeature) feature = mFeature[1];
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  $effect(() => { document.documentElement.dataset.theme = theme; });

  if (import.meta.hot) {
    import.meta.hot.on('demo-file-changed', async ({ file }) => {
      if (!demoPath) return;
      const t = Date.now();
      if (file === `${demoPath}/style.css`) {
        const res = await fetch(cssUrl(demoPath) + '?t=' + t);
        if (res.ok) { const v = unwrapViteCss(await res.text()); css = v; originalCss = v; }
      } else if (file === `${demoPath}/script.js`) {
        const res = await fetch(`${DEMOS_BASE}${demoPath}/script.js?t=` + t);
        if (res.ok) js = await res.text();
      } else if (file === `${demoPath}/index.html`) {
        const res = await fetch(`${DEMOS_BASE}${demoPath}/index.html?t=` + t);
        if (res.ok) html = await res.text();
      } else if (file.startsWith('shared/')) {
        const [a, b, c] = await Promise.all([
          fetch('/shared/spectro-theme.css?t=' + t),
          fetch('/shared/demo-base.css?t=' + t),
          fetch('/shared/demo-highlight.js?t=' + t),
        ]);
        sharedCss = (a.ok ? await a.text() : '') + (b.ok ? await b.text() : '');
        sharedJs  = c.ok ? await c.text() : '';
      }
    });
  }

  function startColResize(e) {
    e.preventDefault();
    colResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const rect = editorEl.getBoundingClientRect();

    function onMove(e) {
      leftFraction = Math.max(0.15, Math.min(0.85, (e.clientX - rect.left) / rect.width));
    }
    function onUp() {
      colResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function startRowResize(e) {
    e.preventDefault();
    rowResizing = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    const startY  = e.clientY;
    const startH  = htmlPanelHeight;

    function onMove(e) {
      htmlPanelHeight = Math.max(80, Math.min(600, startH + (startY - e.clientY)));
    }
    function onUp() {
      rowResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
</script>

<div
  class="editor-layout"
  class:resizing={colResizing || rowResizing}
  style="grid-template-columns: {leftFraction * 100}% 4px 1fr"
  bind:this={editorEl}
>

  <header class="editor-toolbar">
    <a href="../" class="btn btn-ghost"><ArrowLeft size={14} /> Demos</a>
    <div class="editor-title-block">
      {#if session}<span class="editor-session">{session}</span>{/if}
      <span class="editor-title">{title}</span>
      {#if feature}<span class="editor-feature">{feature}</span>{/if}
    </div>
    <div class="toolbar-actions">
      <button class="btn" class:active={htmlOpen} onclick={() => htmlOpen = !htmlOpen}>
        <Code2 size={14} /> HTML
      </button>
      {#if js}
        <button class="btn btn-js" class:active={jsOpen} onclick={() => jsOpen = !jsOpen}>
          <FileCode size={14} /> JS
        </button>
      {/if}
      <button class="btn" onclick={() => css = originalCss}><RotateCcw size={14} /> Reset</button>

      <div class="theme-seg" role="group" aria-label="Barevné téma">
        <button
          class="seg-btn"
          class:seg-active={theme === 'light'}
          onclick={() => theme = 'light'}
        ><Sun size={14} /> Light</button>
        <button
          class="seg-btn"
          class:seg-active={theme === 'dark'}
          onclick={() => theme = 'dark'}
        ><Moon size={14} /> Dark</button>
      </div>
    </div>
  </header>

  {#if loading}
    <p class="status-msg">Načítám demo…</p>
  {:else if error}
    <p class="status-msg status-error">{error}</p>
  {:else}
    <div class="left-column">
      <div class="css-pane">
        <div class="pane-label">CSS</div>
        <div class="pane-content">
          <CssEditor value={css} onchange={(v) => css = v} />
        </div>
      </div>
      {#if htmlOpen}
        <div
          class="splitter-row"
          class:active={rowResizing}
          role="separator"
          aria-label="Resize HTML panel"
          onmousedown={startRowResize}
        ></div>
      {/if}
      <HtmlPanel value={extractBody(html)} open={htmlOpen} panelHeight={htmlPanelHeight} />
      {#if js}
        {#if jsOpen}
          <div
            class="splitter-row"
            class:active={rowResizing}
            role="separator"
            aria-label="Resize JS panel"
            onmousedown={startRowResize}
          ></div>
        {/if}
        <JsPanel value={js} open={jsOpen} panelHeight={jsPanelHeight} />
      {/if}
    </div>

    <div
      class="splitter-col"
      class:active={colResizing}
      role="separator"
      aria-label="Resize panels"
      onmousedown={startColResize}
    ></div>

    <div class="preview-pane">
      <div class="pane-label">Preview</div>
      <div class="pane-content">
        <Preview {html} {css} {js} {sharedCss} {sharedJs} {demoPath} {theme} />
      </div>
    </div>
  {/if}

</div>

<style>
  .editor-layout {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 33% 4px 1fr; /* default; inline style overrides on resize */
    height: 100vh;
    overflow: hidden;
    background: var(--surface-main);
    color: var(--text-primary);
    font-family: var(--font-stack-main);
    font-size: var(--font-size-base);
  }

  /* Disable iframe pointer capture during resize so mouse events don't get swallowed */
  .editor-layout.resizing :global(iframe) {
    pointer-events: none;
  }

  /* ── Toolbar ─────────────────────────────────────────────────────────────── */
  .editor-toolbar {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: var(--base-2);
    padding: var(--base-h) var(--base-3);
    background: var(--surface-main);
    border-bottom: 2px solid var(--text-primary);
    min-height: 48px;
  }

  .editor-title-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    overflow: hidden;
    min-width: 0;
  }

  .editor-session {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .editor-title {
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-headings-regular);
    text-transform: uppercase;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .editor-feature {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-brand-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: var(--base);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--base-h);
    padding: var(--base-h) var(--base-2);
    background: var(--surface-main);
    color: var(--text-primary);
    border: 1px solid var(--text-primary);
    border-radius: 0;
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1;
  }
  .btn:hover  { background: var(--surface-main-variant); }
  .btn.active {
    background: var(--text-primary);
    color: var(--surface-base);
    border-color: var(--text-primary);
  }
  .btn-ghost {
    background: transparent;
    border-color: transparent;
    text-decoration: none;
    color: var(--text-primary);
  }
  .btn-ghost:hover { background: var(--surface-main-variant); }

  /* ── Segmented control (theme toggle) ────────────────────────────────────── */
  .theme-seg {
    display: flex;
    background: transparent;
    border: 1px solid var(--text-primary);
    border-radius: 0;
    padding: 0;
    gap: 0;
  }

  .seg-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--base-h);
    padding: var(--base-h) var(--base-2);
    border-radius: 0;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1;
    transition: background 0.1s, color 0.1s;
  }
  .seg-btn + .seg-btn { border-left: 1px solid var(--text-primary); }
  .seg-btn:not(.seg-active):hover {
    color: var(--text-primary);
  }
  .seg-btn.seg-active {
    background: var(--text-primary);
    color: var(--surface-base);
    box-shadow: none;
  }

  /* ── Panes ───────────────────────────────────────────────────────────────── */
  .left-column {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .preview-pane {
    grid-column: 3;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .css-pane {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
  }

  .pane-label {
    position: relative;
    padding: var(--base-h) var(--base-2);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
    background: var(--surface-main-dim);
    border-bottom: 2px solid var(--text-primary);
    flex-shrink: 0;
  }
  /* Dither swatch vpravo — pane label čte jako telemetry header */
  .pane-label::after {
    content: "";
    position: absolute;
    right: var(--base-2);
    top: 50%;
    transform: translateY(-50%);
    width: var(--base-4);
    height: var(--base-h);
    pointer-events: none;
    background:
      repeating-linear-gradient(90deg,
        color-mix(in oklch, var(--text-primary) 14%, transparent) 0 1px,
        transparent 1px 3px);
  }

  .pane-content {
    flex: 1;
    overflow: hidden;
  }

  /* ── Resize splitters ────────────────────────────────────────────────────── */
  /* Splittery jako kalibrované rails — dither "grip" zářezy přes plnou barvu.
     Grip se opakuje i v hover vrstvě, aby nezmizel při uchopení. */
  .splitter-col {
    grid-column: 2;
    grid-row: 2;
    width: 4px;
    background:
      repeating-linear-gradient(0deg,
        color-mix(in oklch, var(--surface-main) 45%, transparent) 0 1px,
        transparent 1px 4px),
      var(--text-primary);
    cursor: col-resize;
    transition: background 0.1s;
    flex-shrink: 0;
  }
  .splitter-col:hover,
  .splitter-col.active {
    background:
      repeating-linear-gradient(0deg,
        color-mix(in oklch, var(--surface-main) 45%, transparent) 0 1px,
        transparent 1px 4px),
      var(--surface-brand-primary-strong);
  }

  .splitter-row {
    height: 4px;
    flex-shrink: 0;
    background:
      repeating-linear-gradient(90deg,
        color-mix(in oklch, var(--surface-main) 45%, transparent) 0 1px,
        transparent 1px 4px),
      var(--text-primary);
    cursor: row-resize;
    transition: background 0.1s;
  }
  .splitter-row:hover,
  .splitter-row.active {
    background:
      repeating-linear-gradient(90deg,
        color-mix(in oklch, var(--surface-main) 45%, transparent) 0 1px,
        transparent 1px 4px),
      var(--surface-brand-primary-strong);
  }

  /* ── Status messages ─────────────────────────────────────────────────────── */
  .status-msg {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--base-2);
    font-family: var(--font-stack-monospace);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
  }
  /* Radar/přístrojový motiv nad status textem (blueprint) — prstenec + nitkový kříž */
  .status-msg::before {
    content: "";
    width: 40px;
    height: 40px;
    pointer-events: none;
    background:
      radial-gradient(circle, transparent 0 18px,
        var(--border-strong) 18px 19px, transparent 19px),
      linear-gradient(var(--border-strong) 0 0) center / 1px 100% no-repeat,
      linear-gradient(var(--border-strong) 0 0) center / 100% 1px no-repeat;
  }
  .status-error { color: var(--text-red); }
</style>

<script>
  import { onMount } from 'svelte';
  import CssEditor from './lib/CssEditor.svelte';
  import Preview from './lib/Preview.svelte';
  import HtmlPanel from './lib/HtmlPanel.svelte';

  const DEMOS_BASE = import.meta.env.VITE_DEMOS_BASE ?? '../';
  const demoPath = new URLSearchParams(location.search).get('demo')?.replace(/\/$/, '') ?? '';

  function cssUrl(path) {
    return import.meta.env.DEV ? `/__demo_css/${path}` : `${DEMOS_BASE}${path}/style.css`;
  }

  function unwrapViteCss(text) {
    const m = text.match(/const __vite__css = ("(?:[^"\\]|\\.)*")/);
    return m ? JSON.parse(m[1]) : text;
  }

  let html        = $state('');
  let css         = $state('');
  let originalCss = $state('');
  let htmlOpen    = $state(false);
  let theme       = $state(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  let loading     = $state(true);
  let error       = $state('');
  let title       = $state(demoPath);

  // Resize state
  let leftFraction    = $state(0.5);   // fraction of grid width for left column
  let htmlPanelHeight = $state(220);   // px height of HTML panel when open
  let colResizing     = $state(false);
  let rowResizing     = $state(false);

  let editorEl;

  onMount(async () => {
    if (!demoPath) {
      error = 'Chybí URL parametr ?demo= (např. ?demo=s1/d1)';
      loading = false;
      return;
    }
    try {
      const [htmlRes, cssRes] = await Promise.all([
        fetch(DEMOS_BASE + demoPath + '/index.html'),
        fetch(cssUrl(demoPath)),
      ]);
      if (!htmlRes.ok) throw new Error(`Demo nenalezeno: ${demoPath}`);
      html        = await htmlRes.text();
      css         = cssRes.ok ? unwrapViteCss(await cssRes.text()) : '';
      originalCss = css;
      const m = html.match(/<title>([^<]+)<\/title>/);
      if (m) title = m[1];
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  $effect(() => { document.documentElement.dataset.theme = theme; });

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
    <a href="../" class="btn btn-ghost">← Demos</a>
    <span class="editor-title">{title}</span>
    <div class="toolbar-actions">
      <button class="btn" class:active={htmlOpen} onclick={() => htmlOpen = !htmlOpen}>
        ◑ HTML
      </button>
      <button class="btn" onclick={() => css = originalCss}>↺ Reset</button>

      <div class="theme-seg" role="group" aria-label="Barevné téma">
        <button
          class="seg-btn"
          class:seg-active={theme === 'light'}
          onclick={() => theme = 'light'}
        >☀ Light</button>
        <button
          class="seg-btn"
          class:seg-active={theme === 'dark'}
          onclick={() => theme = 'dark'}
        >☾ Dark</button>
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
        <div class="pane-label">style.css</div>
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
      <HtmlPanel value={html} open={htmlOpen} panelHeight={htmlPanelHeight} />
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
        <Preview {html} {css} {demoPath} {theme} />
      </div>
    </div>
  {/if}

</div>

<style>
  .editor-layout {
    display: grid;
    grid-template-rows: 48px 1fr;
    /* grid-template-columns set via inline style */
    height: 100vh;
    overflow: hidden;
    background: var(--surface-base);
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
    padding: 0 var(--base-3);
    background: var(--surface-main);
    border-bottom: 1px solid var(--border);
  }

  .editor-title {
    flex: 1;
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-headings-regular);
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
    padding: var(--base-h) var(--base-2);
    background: var(--surface-control);
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    cursor: pointer;
    white-space: nowrap;
    line-height: 1;
  }
  .btn:hover  { background: var(--surface-main-variant); }
  .btn.active {
    background: var(--surface-brand-primary-subtle);
    color: var(--text-primary-on-surface-brand-primary-subtle);
    border-color: transparent;
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
    background: var(--surface-main-variant);
    border-radius: var(--radius);
    padding: 2px;
    gap: 2px;
  }

  .seg-btn {
    padding: var(--base-h) var(--base-2);
    border-radius: calc(var(--radius) - 2px);
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    cursor: pointer;
    white-space: nowrap;
    line-height: 1;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .seg-btn:not(.seg-active):hover {
    color: var(--text-primary);
  }
  .seg-btn.seg-active {
    background: var(--surface-main);
    color: var(--text-primary);
    box-shadow: 0 1px 3px color-mix(in oklch, currentColor 0%, var(--overlay-moderate) 100%);
  }

  /* ── Panes ───────────────────────────────────────────────────────────────── */
  .left-column {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .css-pane,
  .preview-pane {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
  }

  .css-pane { flex: 1; }

  .pane-label {
    padding: var(--base-h) var(--base-2);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    background: var(--surface-main-dim);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .pane-content {
    flex: 1;
    overflow: hidden;
  }

  /* ── Resize splitters ────────────────────────────────────────────────────── */
  .splitter-col {
    grid-row: 2;
    width: 4px;
    background: var(--border);
    cursor: col-resize;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .splitter-col:hover,
  .splitter-col.active {
    background: var(--surface-brand-primary-moderate);
  }

  .splitter-row {
    height: 4px;
    flex-shrink: 0;
    background: var(--border);
    cursor: row-resize;
    transition: background 0.15s;
  }
  .splitter-row:hover,
  .splitter-row.active {
    background: var(--surface-brand-primary-moderate);
  }

  /* ── Status messages ─────────────────────────────────────────────────────── */
  .status-msg {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
  .status-error { color: var(--status-error); }
</style>

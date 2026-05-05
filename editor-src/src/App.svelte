<script>
  import { onMount } from 'svelte';
  import CssEditor from './lib/CssEditor.svelte';
  import Preview from './lib/Preview.svelte';
  import HtmlPanel from './lib/HtmlPanel.svelte';

  const DEMOS_BASE = import.meta.env.VITE_DEMOS_BASE ?? '../';
  const demoPath = new URLSearchParams(location.search).get('demo')?.replace(/\/$/, '') ?? '';

  let html        = $state('');
  let css         = $state('');
  let originalCss = $state('');
  let htmlOpen    = $state(false);
  let theme       = $state('light');
  let loading     = $state(true);
  let error       = $state('');
  let title       = $state(demoPath);

  onMount(async () => {
    if (!demoPath) {
      error = 'Chybí URL parametr ?demo= (např. ?demo=s1/d1)';
      loading = false;
      return;
    }
    try {
      const [htmlRes, cssRes] = await Promise.all([
        fetch(DEMOS_BASE + demoPath + '/index.html'),
        fetch(DEMOS_BASE + demoPath + '/style.css'),
      ]);
      if (!htmlRes.ok) throw new Error(`Demo nenalezeno: ${demoPath}`);
      html        = await htmlRes.text();
      css         = cssRes.ok ? await cssRes.text() : '';
      originalCss = css;
      const m = html.match(/<title>([^<]+)<\/title>/);
      if (m) title = m[1];
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
  }
</script>

<div class="editor-layout">

  <header class="editor-toolbar">
    <a href="../" class="btn btn-ghost">← Demos</a>
    <span class="editor-title">{title}</span>
    <div class="toolbar-actions">
      <button class="btn" class:active={htmlOpen} onclick={() => htmlOpen = !htmlOpen}>
        ◑ HTML
      </button>
      <button class="btn" onclick={() => css = originalCss}>↺ Reset</button>
      <button class="btn" onclick={toggleTheme}>
        {theme === 'light' ? '☀ Light' : '☾ Dark'}
      </button>
    </div>
  </header>

  {#if loading}
    <p class="status-msg">Načítám demo…</p>
  {:else if error}
    <p class="status-msg status-error">{error}</p>
  {:else}
    <div class="css-pane">
      <div class="pane-label">style.css</div>
      <div class="pane-content">
        <CssEditor value={css} onchange={(v) => css = v} />
      </div>
    </div>

    <div class="preview-pane">
      <div class="pane-label">Preview</div>
      <div class="pane-content">
        <Preview {html} {css} {demoPath} {theme} />
      </div>
    </div>

    <HtmlPanel value={html} open={htmlOpen} />
  {/if}

</div>

<style>
  .editor-layout {
    display: grid;
    grid-template-rows: 48px 1fr auto;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
    overflow: hidden;
    background: var(--surface-base);
    color: var(--text-primary);
    font-family: var(--font-stack-main);
    font-size: var(--font-size-base);
  }

  /* Toolbar */
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
  .btn:hover     { background: var(--surface-main-variant); }
  .btn.active    {
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

  /* Panes */
  .css-pane,
  .preview-pane {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .css-pane { border-right: 1px solid var(--border); }

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

  /* Status messages */
  .status-msg {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }
  .status-error { color: var(--status-error); }
</style>

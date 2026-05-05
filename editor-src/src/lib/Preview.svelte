<script>
  const DEMOS_BASE = import.meta.env.VITE_DEMOS_BASE ?? '../';

  let { html = '', css = '', demoPath = '', theme = 'light' } = $props();

  function buildSrcdoc(html, css, demoPath, theme) {
    if (!html) return '';

    const baseHref = new URL(DEMOS_BASE + demoPath + '/', window.location.href).href;

    return html
      .replace(/(<html[^>]*\s)data-theme="[^"]*"/, `$1data-theme="${theme}"`)
      .replace('<head>', `<head>\n  <base href="${baseHref}">`)
      .replace(
        /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/,
        `<style>\n${css}\n</style>`,
      );
  }

  let srcdoc = $derived(buildSrcdoc(html, css, demoPath, theme));
</script>

<iframe title="Preview" {srcdoc}></iframe>

<style>
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
</style>

<script>
  const DEMOS_BASE = import.meta.env.VITE_DEMOS_BASE ?? '../';

  let { html = '', css = '', js = '', sharedCss = '', demoPath = '', theme = 'light' } = $props();

  function buildSrcdoc(html, css, js, sharedCss, demoPath, theme) {
    if (!html) return '';

    const baseHref = new URL(DEMOS_BASE + demoPath + '/', window.location.href).href;

    let doc = html
      .replace(/(<html[^>]*\s)data-theme="[^"]*"/, `$1data-theme="${theme}"`)
      .replace('<head>', `<head>\n  <base href="${baseHref}">`)
      .replace(
        /<link\s+rel="stylesheet"\s+href="style\.css"\s*\/?>/,
        `<style>\n${css}\n</style>`,
      )
      .replace(/<script\s+src="script\.js"\s*><\/script>/, '');

    if (sharedCss) {
      doc = doc
        .replace(/\s*<link\s+rel="stylesheet"\s+href="https:\/\/cdn\.jsdelivr\.net[^"]*"[^>]*>/g, '')
        .replace('<head>', `<head>\n<style>\n${sharedCss}\n</style>`);
    }

    if (js) doc = doc.replace('</body>', '<script>\n' + js + '\n<\/script>\n</body>');

    return doc;
  }

  let srcdoc = $derived(buildSrcdoc(html, css, js, sharedCss, demoPath, theme));
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

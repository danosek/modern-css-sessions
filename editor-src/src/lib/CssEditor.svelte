<script>
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { css as cssLang } from '@codemirror/lang-css';

  let { value = '', onchange } = $props();

  let container;
  let view;

  const spectroTheme = EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: 'var(--surface-main)',
    },
    '.cm-content': {
      fontFamily: 'var(--font-stack-monospace)',
      fontSize: 'var(--font-size-s)',
      caretColor: 'var(--brand-primary)',
      padding: 'var(--base) 0',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--brand-primary)',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--surface-main-dim)',
      color: 'var(--text-secondary)',
      borderRight: '1px solid var(--border)',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 var(--base-2) 0 var(--base)',
    },
    '.cm-activeLine': {
      backgroundColor: 'var(--overlay-subtle)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--surface-main-variant)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'var(--surface-brand-primary-subtle) !important',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'var(--surface-main-variant)',
      borderColor: 'var(--border)',
    },
  });

  onMount(() => {
    view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        cssLang(),
        spectroTheme,
        EditorView.updateListener.of(u => {
          if (u.docChanged) onchange?.(u.state.doc.toString());
        }),
      ],
      parent: container,
    });
    return () => view.destroy();
  });

  // Aktualizace dokumentu při externích změnách (reset)
  $effect(() => {
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  });
</script>

<div bind:this={container} class="cm-wrapper"></div>

<style>
  .cm-wrapper {
    height: 100%;
    overflow: hidden;
  }
  .cm-wrapper :global(.cm-editor) {
    height: 100%;
  }
</style>

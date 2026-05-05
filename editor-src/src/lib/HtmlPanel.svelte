<script>
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { html as htmlLang } from '@codemirror/lang-html';
  import { EditorState } from '@codemirror/state';
  import { spectroSyntax } from './spectroHighlight.js';

  let { value = '', open = false } = $props();

  let container;

  onMount(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          htmlLang(),
          spectroSyntax,
          EditorState.readOnly.of(true),
          EditorView.theme({
            '&': { height: '100%', backgroundColor: 'var(--surface-main-dim)' },
            '.cm-content': {
              fontFamily: 'var(--font-stack-monospace)',
              fontSize: 'var(--font-size-xs)',
              caretColor: 'transparent',
            },
            '.cm-scroller': { overflow: 'auto' },
            '.cm-gutters': {
              backgroundColor: 'var(--surface-main-dim)',
              color: 'var(--text-secondary)',
              borderRight: '1px solid var(--border)',
            },
          }),
        ],
      }),
      parent: container,
    });
    return () => view.destroy();
  });
</script>

<div class="html-panel" class:open>
  <div class="pane-label">index.html (readonly)</div>
  <div bind:this={container} class="cm-wrapper"></div>
</div>

<style>
  .html-panel {
    grid-column: 1 / -1;
    height: 0;
    overflow: hidden;
    transition: height 0.2s ease;
    border-top: 0 solid var(--border);
    display: flex;
    flex-direction: column;
  }

  .html-panel.open {
    height: 220px;
    border-top-width: 1px;
  }

  .pane-label {
    padding: var(--base-h) var(--base-2);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    background: var(--surface-main-dim);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .cm-wrapper {
    flex: 1;
    overflow: hidden;
  }

  .cm-wrapper :global(.cm-editor) {
    height: 100%;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { css as cssLang } from '@codemirror/lang-css';
  import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
  import { tags } from '@lezer/highlight';

  let { value = '', onchange } = $props();

  let container;
  let view;

  // Syntax highlight colors using Spectro semantic tokens.
  // basicSetup uses defaultHighlightStyle with { fallback: true }, so this takes precedence.
  const spectroSyntax = syntaxHighlighting(HighlightStyle.define([
    // Comments
    { tag: tags.blockComment,                    color: 'var(--text-green)', fontStyle: 'italic' },

    // @ rules: @media, @keyframes, @layer, @import …
    { tag: tags.definitionKeyword,               color: 'var(--text-fuchsia)' },

    // Selectors
    { tag: tags.tagName,                         color: 'var(--text-blue)' },
    { tag: tags.className,                       color: 'var(--text-blue)' },
    { tag: tags.constant(tags.className),        color: 'var(--text-blue-variant)' }, // :pseudo-class-name
    { tag: tags.labelName,                       color: 'var(--text-navy)' },         // #id, @keyframe name
    { tag: tags.attributeName,                   color: 'var(--text-blue-variant)' },
    { tag: tags.definitionOperator,              color: 'var(--text-blue)' },          // *, &

    // Properties
    { tag: tags.propertyName,                    color: 'var(--text-teal)' },

    // CSS Custom properties (--foo)
    { tag: tags.variableName,                    color: 'var(--text-navy)' },

    // Value keywords: auto, none, flex, block …
    { tag: tags.atom,                            color: 'var(--text-primary)' },
    { tag: tags.keyword,                         color: 'var(--text-primary)' },

    // Function callees: var(), calc(), rgb(), translate() …
    { tag: tags.operatorKeyword,                 color: 'var(--text-teal-variant)' },

    // Literals
    { tag: tags.color,                           color: 'var(--text-pink)' },   // #fff, #3498db
    { tag: tags.number,                          color: 'var(--text-amber)' },
    { tag: tags.unit,                            color: 'var(--text-amber)' },
    { tag: tags.string,                          color: 'var(--text-orange)' },

    // !important
    { tag: tags.modifier,                        color: 'var(--text-red)', fontWeight: 'bold' },

    // Namespace
    { tag: tags.namespace,                       color: 'var(--text-navy)' },

    // Punctuation — keep muted so code structure recedes
    { tag: tags.punctuation,                     color: 'var(--text-secondary)' },
    { tag: tags.separator,                       color: 'var(--text-secondary)' },
    { tag: tags.paren,                           color: 'var(--text-secondary)' },
    { tag: tags.squareBracket,                   color: 'var(--text-secondary)' },
    { tag: tags.brace,                           color: 'var(--text-secondary)' },
    { tag: tags.derefOperator,                   color: 'var(--text-secondary)' },
    { tag: tags.compareOperator,                 color: 'var(--text-secondary)' },
    { tag: tags.logicOperator,                   color: 'var(--text-secondary)' },
    { tag: tags.arithmeticOperator,              color: 'var(--text-secondary)' },
  ]));

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
        spectroSyntax,
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

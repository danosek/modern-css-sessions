<script>
  import SessionCard from './lib/SessionCard.svelte';

  const sessions = [
    {
      id: 's1', number: 'S1', title: 'Foundations Refresh', duration: 90,
      demos: [
        { id: 'd1', index: 'D1', name: 'Intrinsic Sizing' },
        { id: 'd2', index: 'D2', name: 'clamp() · min() · max()' },
        { id: 'd3', index: 'D3', name: 'Logical Properties' },
        { id: 'd4', index: 'D4', name: 'CSS Nesting' },
        { id: 'd5', index: 'D5', name: '@layer' },
        { id: 'd6', index: 'D6', name: ':has() · :is() · :where()' },
        { id: 'd7', index: 'D7', name: 'Container Queries' },
        { id: 'd8', index: 'D8', name: 'Subgrid' },
      ],
    },
    {
      id: 's2', number: 'S2', title: 'Colors & Typography', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'oklch()' },
        { id: 'd2', index: 'D2', name: 'color-mix()' },
        { id: 'd3', index: 'D3', name: 'light-dark()' },
        { id: 'd4', index: 'D4', name: 'text-wrap' },
        { id: 'd5', index: 'D5', name: 'color-scheme · prefers-color-scheme' },
      ],
    },
    {
      id: 's3', number: 'S3', title: 'Sizing, Layout & Shapes', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'interpolate-size' },
        { id: 'd2', index: 'D2', name: 'field-sizing' },
        { id: 'd3', index: 'D3', name: 'gap decorations' },
        { id: 'd4', index: 'D4', name: 'shape()' },
      ],
    },
    {
      id: 's4', number: 'S4', title: 'Anchor Positioning + Popover', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'anchor-positioning' },
        { id: 'd2', index: 'D2', name: 'popover API' },
        { id: 'd3', index: 'D3', name: 'invoker commands' },
      ],
    },
    {
      id: 's5', number: 'S5', title: 'Customizable Select & Form UX', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'appearance: base-select' },
        { id: 'd2', index: 'D2', name: 'selectedcontent' },
        { id: 'd3', index: 'D3', name: ':user-valid' },
        { id: 'd4', index: 'D4', name: ':focus-visible · :focus-within' },
      ],
    },
    {
      id: 's6', number: 'S6', title: 'Scroll Universe', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'scroll()' },
        { id: 'd2', index: 'D2', name: 'view()' },
        { id: 'd3', index: 'D3', name: 'carousel' },
        { id: 'd4', index: 'D4', name: 'scroll-state' },
      ],
    },
    {
      id: 's7', number: 'S7', title: 'View Transitions', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'same-doc' },
        { id: 'd2', index: 'D2', name: 'cross-doc' },
        { id: 'd3', index: 'D3', name: 'shared element' },
      ],
    },
    {
      id: 's8', number: 'S8', title: 'CSS as a Programming Language', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: '@property' },
        { id: 'd2', index: 'D2', name: 'attr()' },
        { id: 'd3', index: 'D3', name: '@scope' },
        { id: 'd4', index: 'D4', name: 'if()' },
        { id: 'd5', index: 'D5', name: '@function' },
      ],
    },
  ];

  let theme = $state(document.documentElement.dataset.theme ?? 'light');
  $effect(() => { document.documentElement.dataset.theme = theme; });
</script>

<button class="theme-toggle" onclick={() => theme = theme === 'dark' ? 'light' : 'dark'}>
  [ {theme === 'dark' ? 'LIGHT' : 'DARK'} ]
</button>

<header class="masthead">
  <div class="masthead__bar">
    <span>[ TESCO SW ]</span>
    <span class="mut">ČVN 2026 — BŘE 2027</span>
  </div>

  <h1 class="masthead__title">MODERN CSS<span class="reg">®</span></h1>

  <p class="masthead__sub">
    <span class="acc">&gt;&gt;&gt;</span> INTERAKTIVNÍ CSS DEMA KE ŠKOLÍCÍMU CYKLU
  </p>

  <div class="masthead__index">
    <span>{sessions.length} SESSIONS</span>
    <span>{sessions.reduce((n, s) => n + (s.demos?.length ?? 0), 0)} DEMO</span>
  </div>
</header>

<main class="matrix">
  {#each sessions as session}
    <SessionCard {session} />
  {/each}
</main>

<style>
  :global(body) {
    max-width: 1600px;
    margin: 0 auto;
    padding: var(--base-3);
    background: var(--surface-main);
    color: var(--text-primary);
  }

  /* Jemné scanline/grain přes celou plochu — analogová degradace */
  :global(body)::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
    background: repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 2px,
      color-mix(in oklch, var(--text-primary) 4%, transparent) 3px,
      transparent 4px
    );
  }

  /* ── Theme toggle (utilitární přepínač) ───────────────────── */
  .theme-toggle {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 210;
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    background: var(--text-primary);
    color: var(--surface-base);
    border: none;
    border-radius: 0;
    padding: var(--base) var(--base-2);
    cursor: pointer;
    box-shadow: none;
  }
  .theme-toggle:hover { background: var(--surface-brand-primary-strong); color: var(--text-primary-on-surface-brand-primary-strong); }

  /* ── Masthead (blueprint title block) ─────────────────────── */
  .masthead {
    border: 2px solid var(--text-primary);
    background: var(--surface-main);
    margin-bottom: var(--base-3);
  }

  .masthead__bar,
  .masthead__index {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--base-3);
    padding: var(--base) var(--base-2);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-primary);
  }
  .masthead__bar { border-bottom: 2px solid var(--text-primary); justify-content: space-between; }
  .masthead__index { border-top: 2px solid var(--text-primary); }
  .mut { color: var(--text-secondary); }
  .acc { color: var(--text-brand-primary); }
  .masthead__index .mut { margin-left: auto; }

  .masthead__title {
    font-family: var(--font-stack-headings);
    font-weight: var(--font-weight-headings-regular);
    font-size: clamp(2.5rem, 10vw, 7rem);
    line-height: 0.85;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--text-primary);
    padding: var(--base-3) var(--base-2) var(--base-2);
  }
  .masthead__title .reg {
    color: var(--text-brand-primary);
    font-size: 0.16em;
    vertical-align: super;
    letter-spacing: 0;
  }

  .masthead__sub {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-primary);
    padding: 0 var(--base-2) var(--base-3);
  }
  .masthead__sub .acc { margin-right: var(--base); }

  /* ── Matrix (sessions) — razor-thin grid lines via gap ────── */
  .matrix {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2px;
    background: var(--text-primary);
    border: 2px solid var(--text-primary);

  }
  .matrix::before {
    content: '';
    padding-top: 100%;
    background: red;
    grid-column: 1 / -1;
  }

</style>

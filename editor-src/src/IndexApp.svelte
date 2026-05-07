<script>
  import SessionCard from './lib/SessionCard.svelte';

  const sessions = [
    {
      id: 's1', number: 'S1', title: 'Foundations Refresh', duration: 90,
      demos: [
        { id: 'd1', index: 'D1', name: 'Intrinsic Sizing' },
        { id: 'd2', index: 'D2', name: ':has() · :is() · :where()' },
        { id: 'd3', index: 'D3', name: 'Container Queries' },
        { id: 'd4', index: 'D4', name: '@layer' },
        { id: 'd5', index: 'D5', name: 'Subgrid' },
        { id: 'd6', index: 'D6', name: 'reading-flow' },
      ],
    },
    {
      id: 's2', number: 'S2', title: 'Colors & Typography', duration: 90, future: true,
      demos: [
        { id: 'd1', index: 'D1', name: 'oklch()' },
        { id: 'd2', index: 'D2', name: 'color-mix()' },
        { id: 'd3', index: 'D3', name: 'light-dark()' },
        { id: 'd4', index: 'D4', name: 'text-wrap' },
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
  Toggle theme
</button>

<div class="page-header demo-header">
  <div class="demo-session">Tesco SW · červen 2026 – březen 2027</div>
  <h1 class="page-title">Modern CSS Sessions</h1>
  <p class="page-subtitle">Interaktivní CSS dema ke školícímu cyklu.</p>
</div>

<div class="sessions-grid">
  {#each sessions as session}
    <SessionCard {session} />
  {/each}
</div>

<style>
  :global(body) {
    max-width: 1440px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: var(--base-6);
  }

  .page-title {
    font-family: var(--font-stack-headings);
    font-size: var(--font-size-xxxxl);
    font-weight: var(--font-weight-headings-regular);
    color: var(--text-primary);
    margin-bottom: var(--base);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
  }

  .sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--base-3);
  }
</style>

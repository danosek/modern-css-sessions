<script>
  import SessionCard from './lib/SessionCard.svelte';

  const sessions = [
    {
      id: 's1', number: 'S1', title: 'Foundations Refresh',
      demos: [
        { id: 'd1', index: 'D1', name: 'Intrinsic Sizing' },
        { id: 'd2', index: 'D2', name: ':has() · :is() · :where()' },
        { id: 'd3', index: 'D3', name: 'Container Queries' },
        { id: 'd4', index: 'D4', name: '@layer' },
        { id: 'd5', index: 'D5', name: 'Subgrid' },
        { id: 'd6', index: 'D6', name: 'reading-flow' },
      ],
    },
    { id: 's2', number: 'S2', title: 'Colors & Typography',             placeholder: 'oklch() · color-mix() · light-dark() · text-wrap' },
    { id: 's3', number: 'S3', title: 'Sizing, Layout & Shapes',         placeholder: 'interpolate-size · field-sizing · gap decorations · shape()' },
    { id: 's4', number: 'S4', title: 'Anchor Positioning + Popover',    placeholder: 'anchor-positioning · popover API · invoker commands' },
    { id: 's5', number: 'S5', title: 'Customizable Select & Form UX',   placeholder: 'appearance: base-select · selectedcontent · :user-valid' },
    { id: 's6', number: 'S6', title: 'Scroll Universe',                 placeholder: 'scroll() · view() · carousel · scroll-state' },
    { id: 's7', number: 'S7', title: 'View Transitions',                placeholder: 'same-doc · cross-doc · shared element' },
    { id: 's8', number: 'S8', title: 'CSS as a Programming Language',   placeholder: '@property · attr() · @scope · if() · @function' },
  ];

  let theme = $state(document.documentElement.dataset.theme ?? 'light');
  $effect(() => { document.documentElement.dataset.theme = theme; });
</script>

<button class="theme-toggle" onclick={() => theme = theme === 'dark' ? 'light' : 'dark'}>
  Toggle theme
</button>

<header class="page-header">
  <p class="page-kicker">Tesco SW · 2026–2027</p>
  <h1 class="page-title">Modern CSS Sessions</h1>
  <p class="page-subtitle">Interaktivní CSS dema ke školícímu cyklu.</p>
</header>

<div class="sessions-grid">
  {#each sessions as session}
    <SessionCard {session} />
  {/each}
</div>

<style>
</style>

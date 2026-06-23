<script>
  let { sessionId, demo, disabled = false } = $props();
</script>

<li class="row">
  {#if disabled}
    <span class="row__cell row__disabled">
      <span class="row__idx">{demo.index}</span>
      <span class="row__name">{demo.name}</span>
      <span class="row__mark">//</span>
    </span>
  {:else}
    <a class="row__cell row__link" href="editor/?demo={sessionId}/{demo.id}">
      <span class="row__idx">{demo.index}</span>
      <span class="row__name">{demo.name}</span>
      <span class="row__mark">&rarr;</span>
    </a>
  {/if}
</li>

<style>
  .row {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-s);
    /* Bez uppercase — názvy jsou case-sensitive CSS termíny (oklch(), :has(),
       appearance: base-select). Zobrazujeme je v korektním tvaru z dat. */
    letter-spacing: 0.04em;
    border-bottom: 1px solid var(--border);
  }
  .row:last-child { border-bottom: none; }

  .row__cell {
    display: grid;
    grid-template-columns: 2.4em 1fr auto;
    align-items: center;
    gap: var(--base);
    padding: var(--base-h) var(--base-h);
  }

  .row__link {
    text-decoration: none;
    color: var(--text-primary);
  }
  .row__link:hover {
    background: var(--text-primary);
    color: var(--surface-base);
  }

  .row__idx { color: var(--text-brand-primary); }
  .row__link:hover .row__idx,
  .row__link:hover .row__mark { color: var(--surface-base); }

  .row__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row__mark { color: var(--text-secondary); }

  .row__disabled {
    color: var(--text-secondary);
    cursor: not-allowed;
  }
  .row__disabled .row__idx { color: var(--text-secondary); }
</style>

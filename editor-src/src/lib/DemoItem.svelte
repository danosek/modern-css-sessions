<script>
  let { sessionId, demo, disabled = false } = $props();
</script>

<li class="session-card__demo-item">
  {#if disabled}
    <span class="session-card__demo-index">{demo.index}</span>
    <span class="session-card__demo-name">{demo.name}</span>
  {:else}
    <a class="session-card__demo-link" href="editor/?demo={sessionId}/{demo.id}">
      <span class="session-card__demo-index">{demo.index}</span>
      <span class="session-card__demo-name">{demo.name}</span>
    </a>
  {/if}
</li>

<style>
  .session-card__demo-item {
    display: flex;
    font-size: var(--font-size-s);
    color: var(--text-primary);
    border-radius: var(--radius);
  }

  .session-card__demo-link {
    display: flex;
    align-items: center;
    gap: var(--base);
    padding: var(--base-h) var(--base);
    border-radius: var(--radius);
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .session-card__demo-link:hover {
    background: var(--surface-main-variant);
  }

  .session-card__demo-link:hover .session-card__demo-name {
    text-decoration: underline;
  }

  .session-card__demo-item:not(:has(.session-card__demo-link)) {
    align-items: center;
    gap: var(--base);
    padding: var(--base-h) var(--base);
  }

  .session-card__demo-index {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    color: var(--surface-brand-secondary-strong);
    min-width: var(--base-3);
    flex-shrink: 0;
  }

  .session-card__demo-name {
    flex: 1;
    min-width: 0;
  }
</style>

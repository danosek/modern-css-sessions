<script>
  let { sessionId, demo, disabled = false } = $props();
</script>

<li class="session-card__demo-item" class:session-card__demo-item--disabled={disabled}>
  <span class="session-card__demo-index">{demo.index}</span>
  <span class="session-card__demo-name">{demo.name}</span>
  {#if !disabled}
    <div class="session-card__demo-links">
      <a class="demo-link" href="{sessionId}/{demo.id}/">↗ live</a>
      <a class="demo-link" href="editor/?demo={sessionId}/{demo.id}">✏ edit</a>
    </div>
  {/if}
</li>

<style>
  .session-card__demo-item {
    display: flex;
    align-items: center;
    gap: var(--base);
    padding: var(--base-h) var(--base);
    border-radius: var(--radius);
    font-size: var(--font-size-s);
    color: var(--text-primary);
  }

  .session-card__demo-item:not(.session-card__demo-item--disabled):hover {
    background: var(--surface-main-variant);
  }

  .session-card__demo-index {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    min-width: var(--base-3);
  }

  .session-card__demo-name {
    flex: 1;
    min-width: 0;
  }

  .session-card__demo-links {
    display: flex;
    gap: var(--base-h);
    margin-left: auto;
  }

  .demo-link {
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    padding: 2px var(--base-h);
    border-radius: var(--radius-subtle);
    text-decoration: none;
    background: var(--surface-control);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    transition: background 0.1s, color 0.1s;
  }

  .demo-link:hover {
    background: var(--surface-brand-primary-subtle);
    color: var(--text-primary-on-surface-brand-primary-subtle);
    border-color: transparent;
  }
</style>

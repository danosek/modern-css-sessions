<script>
  import DemoItem from './DemoItem.svelte';

  let { session } = $props();
</script>

<div class="session-card" class:session-card--future={!session.demos}>
  <div class="session-card__head">
    <span class="session-card__number">{session.number}</span>
    <h2 class="session-card__title">{session.title}</h2>
  </div>
  {#if session.demos}
    <ul class="session-card__demos">
      {#each session.demos as demo}
        <DemoItem sessionId={session.id} {demo} />
      {/each}
    </ul>
  {:else if session.placeholder}
    <p class="session-card__placeholder">{session.placeholder}</p>
  {/if}
</div>

<style>
</style>

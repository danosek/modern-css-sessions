<script>
  import { Eye, PenLine } from 'lucide-svelte';

  let { sessionId, demo } = $props();
</script>

<li class="demo-item">
  <span class="demo-item__index">{demo.index}</span>
  <span class="demo-item__name">{demo.name}</span>
  <div class="demo-item__actions">
    <a class="demo-item__btn demo-item__btn--view" href="{sessionId}/{demo.id}/" title="View">
      <Eye size={13} strokeWidth={1.75} />
    </a>
    <a class="demo-item__btn demo-item__btn--edit" href="editor/?demo={sessionId}/{demo.id}" title="Edit">
      <PenLine size={13} strokeWidth={1.75} />
    </a>
  </div>
</li>

<style>
</style>

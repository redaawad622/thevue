<script setup lang="ts">
defineProps<{
  pageIndex: number
  pageCount: number
  canPrevious: boolean
  canNext: boolean
}>()

const emit = defineEmits<{
  previous: []
  next: []
}>()
</script>

<template>
  <div class="thevue-table__pagination">
    <button
      type="button"
      class="thevue-table__page-btn"
      :disabled="!canPrevious"
      aria-label="Previous page"
      @click="emit('previous')"
    >
      ‹
    </button>
    <span class="thevue-table__page-info">{{ pageIndex + 1 }} / {{ Math.max(pageCount, 1) }}</span>
    <button
      type="button"
      class="thevue-table__page-btn"
      :disabled="!canNext"
      aria-label="Next page"
      @click="emit('next')"
    >
      ›
    </button>
  </div>
</template>

<style>
.thevue-table__pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--thevue-space-2);
  padding: var(--thevue-space-2) var(--thevue-space-3);
}

.thevue-table__page-info {
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-muted);
  min-width: 3ch;
  text-align: center;
}

.thevue-table__page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  background: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  font-size: var(--thevue-font-size-lg);
  line-height: 1;
  cursor: pointer;
}

.thevue-table__page-btn:hover:not(:disabled) {
  background: var(--thevue-bg-subtle);
}

.thevue-table__page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>

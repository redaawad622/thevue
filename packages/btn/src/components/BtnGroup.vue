<script setup lang="ts">
import type { BtnGroupProps } from '../types'

defineProps<BtnGroupProps>()
</script>

<template>
  <div class="thevue-btn-group" role="group" :aria-label="label">
    <slot />
  </div>
</template>

<style>
.thevue-btn-group {
  display: inline-flex;
}

.thevue-btn-group .thevue-btn {
  border-radius: 0;
}

.thevue-btn-group .thevue-btn:first-child {
  border-top-left-radius: var(--thevue-btn-radius);
  border-bottom-left-radius: var(--thevue-btn-radius);
}

.thevue-btn-group .thevue-btn:last-child {
  border-top-right-radius: var(--thevue-btn-radius);
  border-bottom-right-radius: var(--thevue-btn-radius);
}

.thevue-btn-group .thevue-btn + .thevue-btn {
  margin-left: -1px;
}

.thevue-btn-group .thevue-btn--solid + .thevue-btn--solid {
  box-shadow: inset 1px 0 0 rgb(255 255 255 / 0.2);
}
</style>

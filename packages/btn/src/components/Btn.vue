<script setup lang="ts">
import type { BtnProps } from '../types'

withDefaults(defineProps<BtnProps>(), {})
</script>

<template>
  <div class="thevue-btn">
    <slot />
  </div>
</template>

<style>
.thevue-btn {
  color: var(--thevue-text-base);
}
</style>

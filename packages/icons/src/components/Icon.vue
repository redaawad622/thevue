<script setup lang="ts">
import type { IconProps } from '../types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed } from 'vue'
import { resolveCustomIcon } from '../registry'

const props = withDefaults(defineProps<IconProps>(), {
  size: 'md',
  color: 'currentColor',
})

const customSvg = computed(() => resolveCustomIcon(props.name))

const sizeValue = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : `var(--thevue-font-size-${props.size})`,
)

const classes = computed(() => [
  'thevue-icon',
  {
    'thevue-icon--spin': props.spin,
    [`thevue-icon--flip-${props.flip}`]: props.flip,
  },
])

const style = computed(() => ({
  color: props.color,
  width: sizeValue.value,
  height: sizeValue.value,
}))
</script>

<template>
  <!-- eslint-disable vue/no-v-html — registry content is developer-provided -->
  <span
    v-if="customSvg"
    :class="classes"
    :style="style"
    aria-hidden="true"
    v-html="customSvg"
  />
  <IconifyIcon
    v-else
    :icon="name"
    :class="classes"
    :style="style"
    aria-hidden="true"
  />
</template>

<style>
.thevue-icon {
  display: inline-block;
  flex-shrink: 0;
  line-height: 1;
  vertical-align: middle;
}

.thevue-icon svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentcolor;
}

.thevue-icon--spin {
  animation: thevue-icon-spin 1s linear infinite;
}

.thevue-icon--flip-horizontal {
  transform: scaleX(-1);
}

.thevue-icon--flip-vertical {
  transform: scaleY(-1);
}

.thevue-icon--flip-both {
  transform: scale(-1);
}

@keyframes thevue-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

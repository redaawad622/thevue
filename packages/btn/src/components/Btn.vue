<script setup lang="ts">
import type { BtnProps } from '../types'
import { Icon } from '@thevue/icons'
import { computed } from 'vue'
import { registerSpinnerIcon } from '../spinner'

const props = withDefaults(defineProps<BtnProps>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  as: 'button',
  type: 'button',
})

registerSpinnerIcon()

const isNativeButton = computed(() => props.as === 'button')
const isInert = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'thevue-btn',
  `thevue-btn--${props.variant}`,
  `thevue-btn--${props.color}`,
  `thevue-btn--${props.size}`,
  {
    'thevue-btn--full': props.fullWidth,
    'thevue-btn--loading': props.loading,
    'thevue-btn--disabled': isInert.value,
  },
])

function onClickCapture(event: MouseEvent): void {
  // native <button disabled> already blocks clicks; this guards loading
  // state and non-button elements rendered via `as`
  if (isInert.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :type="isNativeButton ? type : undefined"
    :disabled="isNativeButton ? isInert || undefined : undefined"
    :aria-disabled="!isNativeButton && isInert ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    @click.capture="onClickCapture"
  >
    <Icon
      v-if="loading"
      class="thevue-btn__icon thevue-btn__spinner"
      name="thevue:spinner"
      spin
      size="md"
    />
    <Icon
      v-else-if="leftIcon"
      class="thevue-btn__icon"
      :name="leftIcon"
      size="md"
    />
    <span v-if="$slots.default" class="thevue-btn__label">
      <slot />
    </span>
    <Icon
      v-if="rightIcon"
      class="thevue-btn__icon"
      :name="rightIcon"
      size="md"
    />
  </component>
</template>

<style>
.thevue-btn {
  /* per-color palette hooks — overridden by color modifiers below */
  --thevue-btn-base: var(--thevue-color-primary-600);
  --thevue-btn-hover: var(--thevue-color-primary-700);
  --thevue-btn-active: var(--thevue-color-primary-800);
  --thevue-btn-soft: var(--thevue-color-primary-50);
  --thevue-btn-soft-hover: var(--thevue-color-primary-100);
  --thevue-btn-contrast: var(--thevue-text-inverted);
  --thevue-btn-radius: var(--thevue-radius-md);

  display: inline-flex;
  gap: var(--thevue-space-2);
  align-items: center;
  justify-content: center;
  font-family: var(--thevue-font-sans);
  font-weight: var(--thevue-font-weight-medium);
  line-height: var(--thevue-leading-tight);
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  border: 1px solid transparent;
  border-radius: var(--thevue-btn-radius);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.thevue-btn:focus-visible {
  outline: 2px solid var(--thevue-btn-base);
  outline-offset: 2px;
}

/* color modifiers */
.thevue-btn--primary {
  --thevue-btn-base: var(--thevue-color-primary-600);
  --thevue-btn-hover: var(--thevue-color-primary-700);
  --thevue-btn-active: var(--thevue-color-primary-800);
  --thevue-btn-soft: var(--thevue-color-primary-50);
  --thevue-btn-soft-hover: var(--thevue-color-primary-100);
}

.thevue-btn--neutral {
  --thevue-btn-base: var(--thevue-color-neutral-600);
  --thevue-btn-hover: var(--thevue-color-neutral-700);
  --thevue-btn-active: var(--thevue-color-neutral-800);
  --thevue-btn-soft: var(--thevue-color-neutral-100);
  --thevue-btn-soft-hover: var(--thevue-color-neutral-200);
}

.thevue-btn--success {
  --thevue-btn-base: var(--thevue-color-success-600);
  --thevue-btn-hover: var(--thevue-color-success-700);
  --thevue-btn-active: var(--thevue-color-success-800);
  --thevue-btn-soft: var(--thevue-color-success-50);
  --thevue-btn-soft-hover: var(--thevue-color-success-100);
}

.thevue-btn--warning {
  --thevue-btn-base: var(--thevue-color-warning-600);
  --thevue-btn-hover: var(--thevue-color-warning-700);
  --thevue-btn-active: var(--thevue-color-warning-800);
  --thevue-btn-soft: var(--thevue-color-warning-50);
  --thevue-btn-soft-hover: var(--thevue-color-warning-100);
}

.thevue-btn--danger {
  --thevue-btn-base: var(--thevue-color-danger-600);
  --thevue-btn-hover: var(--thevue-color-danger-700);
  --thevue-btn-active: var(--thevue-color-danger-800);
  --thevue-btn-soft: var(--thevue-color-danger-50);
  --thevue-btn-soft-hover: var(--thevue-color-danger-100);
}

/* variants */
.thevue-btn--solid {
  color: var(--thevue-btn-contrast);
  background-color: var(--thevue-btn-base);
}

.thevue-btn--solid:hover:not(.thevue-btn--disabled) {
  background-color: var(--thevue-btn-hover);
}

.thevue-btn--solid:active:not(.thevue-btn--disabled) {
  background-color: var(--thevue-btn-active);
}

.thevue-btn--outline {
  color: var(--thevue-btn-base);
  background-color: transparent;
  border-color: var(--thevue-btn-base);
}

.thevue-btn--outline:hover:not(.thevue-btn--disabled),
.thevue-btn--ghost:hover:not(.thevue-btn--disabled) {
  background-color: var(--thevue-btn-soft);
}

.thevue-btn--ghost {
  color: var(--thevue-btn-base);
  background-color: transparent;
}

.thevue-btn--soft {
  color: var(--thevue-btn-hover);
  background-color: var(--thevue-btn-soft);
}

.thevue-btn--soft:hover:not(.thevue-btn--disabled) {
  background-color: var(--thevue-btn-soft-hover);
}

.thevue-btn--link {
  padding: 0;
  color: var(--thevue-btn-base);
  background-color: transparent;
  border: none;
}

.thevue-btn--link:hover:not(.thevue-btn--disabled) {
  text-decoration: underline;
}

/* sizes */
.thevue-btn--xs {
  height: var(--thevue-space-6);
  padding: 0 var(--thevue-space-2);
  font-size: var(--thevue-font-size-xs);
}

.thevue-btn--sm {
  height: var(--thevue-space-8);
  padding: 0 var(--thevue-space-3);
  font-size: var(--thevue-font-size-sm);
}

.thevue-btn--md {
  height: var(--thevue-space-10);
  padding: 0 var(--thevue-space-4);
  font-size: var(--thevue-font-size-sm);
}

.thevue-btn--lg {
  height: var(--thevue-space-12);
  padding: 0 var(--thevue-space-5);
  font-size: var(--thevue-font-size-md);
}

.thevue-btn--xl {
  height: var(--thevue-space-16);
  padding: 0 var(--thevue-space-6);
  font-size: var(--thevue-font-size-lg);
}

.thevue-btn--link.thevue-btn--xs,
.thevue-btn--link.thevue-btn--sm,
.thevue-btn--link.thevue-btn--md,
.thevue-btn--link.thevue-btn--lg,
.thevue-btn--link.thevue-btn--xl {
  height: auto;
  padding: 0;
}

/* states and layout */
.thevue-btn--full {
  display: flex;
  width: 100%;
}

.thevue-btn--disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.thevue-btn__label {
  display: inline-flex;
  align-items: center;
}
</style>

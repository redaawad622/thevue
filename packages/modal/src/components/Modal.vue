<script setup lang="ts">
import type { ModalEmits, ModalProps } from '../types'
import { Icon } from '@thevue/icons'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  size: 'md',
  closeOnOverlayClick: true,
  closeOnEsc: true,
  teleport: true,
  teleportTo: 'body',
  hideCloseButton: false,
  scrollLock: true,
})

const emit = defineEmits<ModalEmits>()

const previousActiveElement = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'thevue-modal',
  `thevue-modal--${props.size}`,
])

function close() {
  emit('update:modelValue', false)
}

function onBackdropClick() {
  if (props.closeOnOverlayClick) {
    close()
  }
}

const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getFocusableElements() {
  if (!dialogRef.value)
    return []
  const elements = dialogRef.value.querySelectorAll(focusableElementsSelector)
  return Array.from(elements).filter((el) => {
    if ((el as HTMLButtonElement).disabled)
      return false
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0)
      return false
    return true
  }) as HTMLElement[]
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc) {
    close()
    return
  }

  if (e.key === 'Tab') {
    const focusable = getFocusableElements()
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (first && last) {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus()
          e.preventDefault()
        }
      }
      else {
        if (document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }
  }
}

async function openModal() {
  emit('open')
  if (props.scrollLock) {
    document.body.style.overflow = 'hidden'
  }
  previousActiveElement.value = document.activeElement as HTMLElement
  window.addEventListener('keydown', handleKeyDown)

  await nextTick()
  if (dialogRef.value) {
    const focusable = getFocusableElements()
    if (focusable.length > 0 && focusable[0]) {
      focusable[0].focus()
    }
    else {
      dialogRef.value.focus()
    }
  }
}

function cleanup() {
  if (props.scrollLock) {
    // Check if there are other open modals in the document
    const otherOpenModals = document.querySelectorAll('.thevue-modal__wrapper').length
    if (otherOpenModals <= 1) {
      document.body.style.overflow = ''
    }
  }
  if (previousActiveElement.value) {
    previousActiveElement.value.focus()
  }
  window.removeEventListener('keydown', handleKeyDown)
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    openModal()
  }
  else {
    cleanup()
    emit('close')
  }
})

onMounted(() => {
  if (props.modelValue) {
    openModal()
  }
})

onUnmounted(() => {
  if (props.modelValue) {
    cleanup()
  }
})
</script>

<template>
  <Teleport :to="teleportTo" :disabled="!teleport">
    <Transition name="thevue-modal-fade">
      <div v-if="modelValue" class="thevue-modal__wrapper">
        <div class="thevue-modal__backdrop" @click="onBackdropClick" />
        <div
          ref="dialogRef"
          :class="classes"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          aria-labelledby="thevue-modal-title"
        >
          <!-- Header -->
          <header v-if="title || $slots.header || !hideCloseButton" class="thevue-modal__header">
            <slot name="header">
              <div class="thevue-modal__title-group">
                <h2 v-if="title" id="thevue-modal-title" class="thevue-modal__title">
                  {{ title }}
                </h2>
                <p v-if="subtitle" class="thevue-modal__subtitle">
                  {{ subtitle }}
                </p>
              </div>
            </slot>
            <button
              v-if="!hideCloseButton"
              class="thevue-modal__close-btn"
              type="button"
              aria-label="Close modal"
              @click="close"
            >
              <Icon name="octicon:x-16" size="md" />
            </button>
          </header>

          <!-- Content -->
          <section class="thevue-modal__body">
            <slot />
          </section>

          <!-- Footer -->
          <footer v-if="$slots.footer" class="thevue-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.thevue-modal__wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--thevue-z-modal);
  padding: var(--thevue-space-4);
  pointer-events: auto;
}

.thevue-modal__backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--thevue-modal-overlay-bg, rgba(15, 23, 42, 0.6));
  z-index: -1;
  pointer-events: auto;
}

[data-theme="dark"] .thevue-modal__backdrop {
  background-color: var(--thevue-modal-overlay-bg, rgba(2, 6, 23, 0.8));
}

.thevue-modal {
  --thevue-modal-bg: var(--thevue-bg-base);
  --thevue-modal-radius: var(--thevue-radius-lg);
  --thevue-modal-shadow: var(--thevue-shadow-xl);

  display: flex;
  flex-direction: column;
  background-color: var(--thevue-modal-bg);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-modal-radius);
  box-shadow: var(--thevue-modal-shadow);
  width: 100%;
  max-height: calc(100vh - var(--thevue-space-8));
  overflow: hidden;
  outline: none;
  font-family: var(--thevue-font-sans);
  color: var(--thevue-text-base);
}

.thevue-modal:focus-visible {
  outline: none;
}

/* Modal Sizes */
.thevue-modal--sm {
  max-width: 384px;
}

.thevue-modal--md {
  max-width: 512px;
}

.thevue-modal--lg {
  max-width: 768px;
}

.thevue-modal--xl {
  max-width: 1024px;
}

.thevue-modal--full {
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: var(--thevue-radius-none);
  border: none;
}

/* Header */
.thevue-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--thevue-space-4) var(--thevue-space-6);
  border-bottom: 1px solid var(--thevue-border-subtle);
}

.thevue-modal__title-group {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-1);
}

.thevue-modal__title {
  margin: 0;
  font-size: var(--thevue-font-size-lg);
  font-weight: var(--thevue-font-weight-semibold);
  line-height: var(--thevue-leading-tight);
}

.thevue-modal__subtitle {
  margin: 0;
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-subtle);
  line-height: var(--thevue-leading-normal);
}

.thevue-modal__close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: var(--thevue-space-1);
  border-radius: var(--thevue-radius-md);
  color: var(--thevue-text-muted);
  cursor: pointer;
  transition: all 150ms ease;
}

.thevue-modal__close-btn:hover {
  background-color: var(--thevue-bg-muted);
  color: var(--thevue-text-base);
}

.thevue-modal__close-btn:focus-visible {
  outline: 2px solid var(--thevue-color-primary-500);
  outline-offset: 1px;
}

/* Body */
.thevue-modal__body {
  padding: var(--thevue-space-6);
  overflow-y: auto;
  flex-grow: 1;
  font-size: var(--thevue-font-size-md);
  line-height: var(--thevue-leading-normal);
}

/* Footer */
.thevue-modal__footer {
  padding: var(--thevue-space-4) var(--thevue-space-6);
  background-color: var(--thevue-bg-subtle);
  border-top: 1px solid var(--thevue-border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--thevue-space-3);
}

/* Transitions */
.thevue-modal-fade-enter-active,
.thevue-modal-fade-leave-active {
  transition: opacity 200ms ease;
}

.thevue-modal-fade-enter-from,
.thevue-modal-fade-leave-to {
  opacity: 0;
}

.thevue-modal-fade-enter-active .thevue-modal,
.thevue-modal-fade-leave-active .thevue-modal {
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease;
}

.thevue-modal-fade-enter-from .thevue-modal,
.thevue-modal-fade-leave-to .thevue-modal {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>

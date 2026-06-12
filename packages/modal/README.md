# @thevue/modal

> A highly accessible, modular, and custom-stylable dialog window package for the `thevue` framework.

## Features

- **Standard Dialog Structure**: Slots for `header`, `footer`, and default body content.
- **Focus Trapping**: Keyboard focus is trapped inside the active modal during tab loops.
- **Body Scroll Locking**: Prevents parent page scrolling while open, handling stacked modal triggers.
- **Dynamic Closures**: Listen for backdrop overlay clicks or `Escape` key down events.
- **Teleport Support**: Teleports the component DOM wrapper to body or custom selectors.
- **Custom Styling**: Native CSS variables mapped to the `@thevue/core` design tokens.

## Install

```bash
npm install @thevue/core @thevue/modal
```

```ts
import '@thevue/modal/style'
```

## Usage

```vue
<script setup lang="ts">
import { Btn } from '@thevue/btn'
import { Modal } from '@thevue/modal'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Btn @click="isOpen = true">
    Open Dialog
  </Btn>

  <Modal
    v-model="isOpen"
    title="Are you sure?"
    subtitle="This operation will modify the repository data."
  >
    <p>This action cannot be undone. Please confirm before continuing.</p>

    <template #footer>
      <Btn variant="ghost" color="neutral" @click="isOpen = false">
        Cancel
      </Btn>
      <Btn color="danger" @click="isOpen = false">
        Confirm
      </Btn>
    </template>
  </Modal>
</template>
```

## API Reference

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Controls the visible open state of the modal. Supports two-way binding. |
| `title` | `string` | `undefined` | The primary heading text shown in the header. |
| `subtitle` | `string` | `undefined` | Secondary description text shown below the title. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Controls the maximum width profile of the dialog card. |
| `closeOnOverlayClick` | `boolean` | `true` | Click on the backdrop area closes the modal. |
| `closeOnEsc` | `boolean` | `true` | Pressing the Escape key closes the modal. |
| `teleport` | `boolean` | `true` | Teleports component elements to another DOM location. |
| `teleportTo` | `string \| HTMLElement` | `'body'` | Target selector/element to append the modal markup. |
| `hideCloseButton` | `boolean` | `false` | Hides the top-right "X" close button. |
| `scrollLock` | `boolean` | `true` | Locks body/HTML document scroll when active. |

### Slots

| Slot | Description |
| --- | --- |
| `default` | The main content body of the modal dialogue card. |
| `header` | Custom header replacement (overrides `title` and `subtitle` props). |
| `footer` | Bottom action button layout container. |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | Dispatched when the modal requests to close. |
| `open` | `void` | Dispatched when the modal begins to open. |
| `close` | `void` | Dispatched when the modal closes. |

## Styling Customizations

Customize modal appearance locally or globally using CSS custom variables:

| CSS Variable | Default Value | Description |
| --- | --- | --- |
| `--thevue-modal-bg` | `var(--thevue-bg-base)` | Backdrop container card background color. |
| `--thevue-modal-radius` | `var(--thevue-radius-lg)` | Corner rounding of the dialog card. |
| `--thevue-modal-shadow` | `var(--thevue-shadow-xl)` | Shadow elevation style. |
| `--thevue-modal-overlay-bg` | `rgba(15, 23, 42, 0.6)` (Light) / `rgba(2, 6, 23, 0.8)` (Dark) | Background color of the backdrop wrapper overlay. |

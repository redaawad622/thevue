# @thevue/btn

> Button and button-group components for the thevue framework — five variants × five colors × five sizes, loading state, icons, and polymorphic rendering.

## Install

**Standalone (just the button):**

```bash
npm install @thevue/core @thevue/btn
```

```ts
import '@thevue/core/style' // design tokens
import '@thevue/btn/style' // button styles
```

**As part of the full framework:**

```bash
npm install @thevue/vue
```

`Btn` and `BtnGroup` are then re-exported from `@thevue/vue` and registered globally by the `Thevue` plugin.

## Basic usage

```vue
<script setup lang="ts">
import { Btn } from '@thevue/btn'
</script>

<template>
  <Btn>Save</Btn>
  <Btn color="danger" variant="outline">
    Delete
  </Btn>
</template>
```

## Variants

```vue
<Btn variant="solid">
Solid
</Btn>

<Btn variant="outline">
Outline
</Btn>

<Btn variant="ghost">
Ghost
</Btn>

<Btn variant="soft">
Soft
</Btn>

<Btn variant="link">
Link
</Btn>
```

## Colors

```vue
<Btn color="primary">
Primary
</Btn>

<Btn color="neutral">
Neutral
</Btn>

<Btn color="success">
Success
</Btn>

<Btn color="warning">
Warning
</Btn>

<Btn color="danger">
Danger
</Btn>
```

## Sizes

```vue
<Btn size="xs">
Extra small
</Btn>

<Btn size="sm">
Small
</Btn>

<Btn size="md">
Medium
</Btn>

<Btn size="lg">
Large
</Btn>

<Btn size="xl">
Extra large
</Btn>

<Btn full-width>
Full width
</Btn>
```

## Loading state

Shows a spinner, sets `aria-busy="true"` and blocks interaction:

```vue
<Btn :loading="isSaving" @click="save">
  Save
</Btn>
```

## Icons

Any Iconify name or icon registered with `@thevue/icons`:

```vue
<Btn left-icon="mdi:plus">
Add item
</Btn>

<Btn right-icon="mdi:arrow-right">
Continue
</Btn>
```

## BtnGroup

Groups buttons into a single segmented control (inner radii and double borders removed):

```vue
<script setup lang="ts">
import { Btn, BtnGroup } from '@thevue/btn'
</script>

<template>
  <BtnGroup label="Text alignment">
    <Btn variant="outline">
      Left
    </Btn>
    <Btn variant="outline">
      Center
    </Btn>
    <Btn variant="outline">
      Right
    </Btn>
  </BtnGroup>
</template>
```

## Polymorphic rendering

Render as any element or component with the `as` prop. Attributes fall through (`href`, `to`, …):

```vue
<Btn as="a" href="https://example.com" target="_blank">
  Visit site
</Btn>

<Btn :as="RouterLink" to="/settings">
  Settings
</Btn>
```

When `as` is not a native `<button>`, the component sets `aria-disabled` and blocks clicks itself for disabled/loading states.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'solid' \| 'outline' \| 'ghost' \| 'link' \| 'soft'` | `'solid'` | Visual style |
| `color` | `'primary' \| 'neutral' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Semantic color |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size |
| `loading` | `boolean` | `false` | Spinner + blocks interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `fullWidth` | `boolean` | `false` | Stretch to container width |
| `leftIcon` | `string` | — | Icon before the label |
| `rightIcon` | `string` | — | Icon after the label |
| `as` | `string \| Component` | `'button'` | Element/component to render |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native type (real buttons only) |

`BtnGroup` props: `label?: string` (accessible group label).

## TypeScript

```ts
import type { BtnColor, BtnGroupProps, BtnProps, BtnSize, BtnVariant } from '@thevue/btn'
```

## Theming

All styling reads `--thevue-*` tokens from `@thevue/core` — override the theme (or the `--thevue-btn-*` hooks per subtree) and buttons follow automatically. See [@thevue/core docs](../core/README.md). Design decisions are documented in [docs/DECISIONS.md](./docs/DECISIONS.md).

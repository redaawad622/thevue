# @thevue/icons

> One `<Icon>` component for 200,000+ icons (via [Iconify](https://iconify.design)) plus your own custom SVGs.

## Install

```bash
npm install @thevue/core @thevue/icons
```

```ts
import '@thevue/icons/style'
```

## Usage

```vue
<script setup lang="ts">
import { Icon } from '@thevue/icons'
</script>

<template>
  <Icon name="mdi:home" />
  <Icon name="lucide:settings" size="lg" />
  <Icon name="heroicons:trash" color="var(--thevue-color-danger-600)" />
  <Icon name="mdi:loading" spin />
  <Icon name="tabler:arrow-right" flip="horizontal" />
</template>
```

Any `collection:icon-name` from Iconify works. Icon data is fetched on demand and cached; for fully offline apps, bundle the data with `addIcon` from `@iconify/vue`.

### Popular icon sets

| Prefix | Set |
| --- | --- |
| `mdi` | Material Design Icons |
| `heroicons` | Heroicons |
| `lucide` | Lucide |
| `tabler` | Tabler Icons |
| `ph` | Phosphor |
| `carbon` | Carbon |
| `ri` | Remix Icon |

Browse everything at [icon-sets.iconify.design](https://icon-sets.iconify.design).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — (required) | Iconify name or registered custom name |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | Token size (uses `--thevue-font-size-*`) or pixels |
| `color` | `string` | `'currentColor'` | Any CSS color, including token variables |
| `spin` | `boolean` | `false` | Continuous rotation (spinners) |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | — | Mirror the icon |

### Size reference

| Size | Resolves to | Default value |
| --- | --- | --- |
| `xs` | `var(--thevue-font-size-xs)` | 0.75rem |
| `sm` | `var(--thevue-font-size-sm)` | 0.875rem |
| `md` | `var(--thevue-font-size-md)` | 1rem |
| `lg` | `var(--thevue-font-size-lg)` | 1.125rem |
| `xl` | `var(--thevue-font-size-xl)` | 1.25rem |
| `32` | `32px` | — |

## Custom SVG icons

Register project-specific SVGs once (e.g. in `main.ts`) and use them by name anywhere. Registered names take precedence over Iconify:

```ts
import { useIconRegistry } from '@thevue/icons'

const registry = useIconRegistry()

registry.register('brand:logo', '<svg viewBox="0 0 24 24"><path d="…" /></svg>')

registry.registerAll({
  'brand:mark': '<svg viewBox="0 0 16 16">…</svg>',
  'brand:wordmark': '<svg viewBox="0 0 120 24">…</svg>',
})
```

```vue
<Icon name="brand:logo" size="xl" />
```

Registry API: `register`, `registerAll`, `unregister`, `has`, `names`.

Tip: use `fill="currentColor"` (or omit fills) in your SVGs so the `color` prop and inherited text color apply.

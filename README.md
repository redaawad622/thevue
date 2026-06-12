# thevue

> A modular, tree-shakeable Vue 3 component framework — install the whole framework, or just the one component you need.

Every component is an independently publishable npm package. Each works standalone with only `@thevue/core` (design tokens + theming) as a peer dependency. `@thevue/vue` is a convenience bundle that re-exports everything.

## Installation

**Option A — install everything:**

```bash
npm install @thevue/vue
```

```ts
import { Thevue } from '@thevue/vue'
import '@thevue/vue/style'

createApp(App).use(Thevue).mount('#app')
```

**Option B — install only what you need:**

```bash
npm install @thevue/core @thevue/btn
```

```vue
<script setup lang="ts">
import { Btn } from '@thevue/btn'
import '@thevue/btn/style'
</script>

<template>
  <Btn color="primary">
    Click me
  </Btn>
</template>
```

## Packages

| Package | Layer | Description | Docs |
| --- | --- | --- | --- |
| `@thevue/core` | L0 | Design tokens, theme engine, Vue plugin — the only required package | [README](./packages/core/README.md) |
| `@thevue/icons` | L1 | Icon component on top of Iconify (200k+ icons) | [README](./packages/icons/README.md) |
| `@thevue/btn` | L2 | Button + ButtonGroup | [README](./packages/btn/README.md) |
| `@thevue/modal` | L2 | Modal + dialog container component | [README](./packages/modal/README.md) |
| `@thevue/table` | L2 | Data table on TanStack Table v8 | [README](./packages/table/README.md) |
| `@thevue/vue` | L3 | Full framework bundle (re-exports everything) | [README](./packages/vue/README.md) |

## Monorepo development

```bash
corepack enable pnpm
pnpm install
pnpm exec playwright install chromium   # one-time, for browser-mode tests

pnpm build       # build all packages (Turborepo)
pnpm test        # run all tests
pnpm lint        # lint everything
pnpm dev         # watch mode / playground
pnpm docs:dev    # VitePress docs site

pnpm create-package --name modal --display-name "Modal" --layer component
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the package layer rules, build output format, and versioning strategy, and [docs/SPEC.md](./docs/SPEC.md) for the original project spec.

## License

MIT

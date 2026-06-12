# Claude Code Plan Prompt — Modular Vue Framework

> Paste this entire document into Claude Code at project start.
> Replace `[NAME]` with your chosen framework name before using.

> **Note:** This is the original project-bootstrap prompt, kept for history. The
> visual system has since been formalized in
> [`DESIGN-LANGUAGE.md`](./DESIGN-LANGUAGE.md) — read it for the current
> principles, color, and shape identity; where the two differ, it wins.

---

## PROJECT IDENTITY

You are helping build **[thevue]** — a modular, tree-shakeable Vue 3 component framework.

**Core philosophy:**
- Every component is an independently publishable npm package (`@[thevue]/btn`, `@[thevue]/table`)
- Each package works standalone with zero knowledge of the full framework
- The full framework (`@[thevue]/vue`) is just a convenience bundle that re-exports everything
- Design tokens and theming live in `@[thevue]/core` — the only required peer dependency
- Every file, package, and decision must be documented in `.md` files as you build

**Target developer experience:**

Option A — Install everything:
```bash
npm install @[thevue]/vue
```

Option B — Install only what you need:
```bash
npm install @[thevue]/core @[thevue]/btn
npm install @[thevue]/core @[thevue]/table
```

---

## MONOREPO TECH STACK

| Concern | Tool | Reason |
|---|---|---|
| Workspace manager | pnpm workspaces | Fast, strict, disk-efficient |
| Build orchestration | Turborepo | Parallel builds, cache |
| Component bundler | unbuild (unjs) | Zero-config, ESM+CJS output |
| Dev server | Vite + @vitejs/plugin-vue | HMR, fast |
| TypeScript | TypeScript 5.x | Full type safety |
| Theming | CSS custom properties | No runtime, native cascade |
| Icons | @iconify/vue + iconify datasets | Multi-library, tree-shakeable |
| Docs site | VitePress | Markdown-first, auto sidebar |
| Versioning | Changesets | Per-package semver |
| Testing | Vitest + @vue/test-utils | Fast, collocated |
| Linting | ESLint + @antfu/eslint-config | Opinionated, flat config |

---

## DIRECTORY STRUCTURE

Build exactly this structure:

```
[name]/
├── packages/
│   ├── core/               # @[name]/core — tokens, theming, plugin
│   ├── icons/              # @[name]/icons — icon system
│   ├── btn/                # @[name]/btn — button component
│   ├── table/              # @[name]/table — data table component
│   └── vue/                # @[name]/vue — full framework bundle
├── apps/
│   ├── docs/               # VitePress documentation site
│   └── playground/         # Vite sandbox for dev/testing
├── scripts/
│   └── create-package.ts   # Scaffolds new packages
├── .changeset/
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── eslint.config.mjs
├── package.json
└── README.md               # ← ALWAYS KEEP UPDATED
```

Each package follows this internal structure:
```
packages/btn/
├── src/
│   ├── components/
│   │   └── Btn.vue
│   ├── composables/        # if any
│   ├── types.ts
│   └── index.ts            # public API exports
├── tests/
│   └── Btn.test.ts
├── package.json
├── build.config.ts         # unbuild config
├── tsconfig.json
├── README.md               # ← REQUIRED for every package
└── CHANGELOG.md            # ← REQUIRED, managed by changesets
```

---

## PHASE 1 — MONOREPO BOOTSTRAP

### Tasks
1. Init root `package.json` with workspace devDependencies
2. Create `pnpm-workspace.yaml` pointing to `packages/*` and `apps/*`
3. Create `turbo.json` with pipeline: `build → test → lint`
4. Create `tsconfig.base.json` with strict mode, path aliases
5. Create root `eslint.config.mjs`
6. Create `.gitignore`, `.npmrc`, `.nvmrc`

### Root package.json scripts
```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "eslint .",
    "docs:dev": "pnpm --filter docs dev",
    "docs:build": "pnpm --filter docs build",
    "release": "changeset publish",
    "version": "changeset version",
    "create-package": "tsx scripts/create-package.ts"
  }
}
```

### turbo.json pipeline
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {}
  }
}
```

### 📄 Generate: `README.md`
Top-level project README with: project name, tagline, install options (full vs individual), quick start code, link to docs, package table, license.

---

## PHASE 2 — CORE PACKAGE (`@[name]/core`)

This is the only required package. It provides: design tokens, theme engine, base utilities, Vue plugin.

### Token system (`src/tokens/`)
Generate CSS custom properties for:

```ts
// Design tokens — define these as TypeScript constants AND CSS variables
const tokens = {
  // Color palette (semantic)
  colors: {
    primary: { 50..950 },   // 11 shades
    neutral: { 50..950 },
    success: { 50..950 },
    warning: { 50..950 },
    danger:  { 50..950 },
  },
  // Semantic color roles (mapped to palette)
  semantic: {
    bg: { base, subtle, muted },
    text: { base, subtle, muted, inverted },
    border: { base, subtle, strong },
    interactive: { default, hover, active, disabled },
  },
  // Typography
  font: {
    family: { sans, mono },
    size: { xs, sm, md, lg, xl, '2xl', '3xl', '4xl' },
    weight: { normal, medium, semibold, bold },
    lineHeight: { tight, normal, relaxed },
  },
  // Spacing (4px base)
  space: { 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 },
  // Border radius
  radius: { none, sm, md, lg, xl, full },
  // Shadows
  shadow: { sm, md, lg, xl },
  // Z-index
  z: { dropdown, sticky, overlay, modal, toast, tooltip },
}
```

### Theme engine (`src/theme/`)
- `createTheme(overrides?)` — generates a theme object from token overrides
- `useTheme()` composable — returns reactive current theme
- `ThemeProvider.vue` — scoped CSS variable injection
- Built-in themes: `lightTheme`, `darkTheme`
- Auto dark mode: respects `prefers-color-scheme`, overridable via `data-theme` attribute

### Vue plugin (`src/plugin.ts`)
```ts
export const [NAME]Plugin: Plugin = {
  install(app, options?: FrameworkOptions) {
    // Register ThemeProvider
    // Apply global token CSS vars to :root
    // Register global config
  }
}
```

### Public exports (`src/index.ts`)
```ts
export { [NAME]Plugin } from './plugin'
export { createTheme, useTheme, lightTheme, darkTheme } from './theme'
export { ThemeProvider } from './components/ThemeProvider'
export * from './tokens'
export * from './types'
```

### 📄 Generate: `packages/core/README.md`
Cover: install, `createApp` usage, ThemeProvider usage, token reference table, dark mode setup, createTheme customization example.

### 📄 Generate: `packages/core/docs/TOKENS.md`
Full token reference: every CSS variable name, its default value, and what it controls.

---

## PHASE 3 — ICONS PACKAGE (`@[name]/icons`)

### Purpose
Thin wrapper around `@iconify/vue` that adds: default icon size from tokens, color inheritance, consistent prop API, and an optional custom icon registry.

### Components
- `<Icon name="mdi:home" size="md" color="inherit" />` — main component
- `useIconRegistry()` — composable for registering custom SVG icons

### Props API
```ts
interface IconProps {
  name: string           // iconify: "collection:icon-name"
  size?: 'xs'|'sm'|'md'|'lg'|'xl' | number  // default: 'md'
  color?: string         // default: 'currentColor'
  spin?: boolean
  flip?: 'horizontal'|'vertical'|'both'
}
```

### 📄 Generate: `packages/icons/README.md`
Cover: install, usage with Iconify sets, popular icon set IDs (mdi, heroicons, lucide, tabler, phosphor), custom SVG registration, size reference.

---

## PHASE 4 — CREATE-PACKAGE SCRIPT (`scripts/create-package.ts`)

This script must exist before building more packages. It scaffolds a new package with all required files.

```ts
// Usage: pnpm create-package --name modal --display-name "Modal"
```

What it generates:
- `packages/[name]/package.json` (with correct name, peerDeps on @[name]/core)
- `packages/[name]/src/index.ts`
- `packages/[name]/src/components/[Name].vue` (minimal placeholder)
- `packages/[name]/src/types.ts`
- `packages/[name]/tests/[Name].test.ts`
- `packages/[name]/build.config.ts`
- `packages/[name]/tsconfig.json`
- `packages/[name]/README.md` (template with install, basic usage)
- `packages/[name]/CHANGELOG.md` (empty with header)

### Package.json template for packages
```json
{
  "name": "@[name]/[pkg]",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./style": "./dist/style.css"
  },
  "peerDependencies": {
    "vue": ">=3.3.0",
    "@[name]/core": "workspace:*"
  },
  "sideEffects": ["**/*.css"]
}
```

---

## PHASE 5 — BTN PACKAGE (`@[name]/btn`)

First real component. Build this as the reference implementation all future packages follow.

### Variants and API
```ts
interface BtnProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'soft'
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  leftIcon?: string    // iconify name
  rightIcon?: string   // iconify name
  as?: string | Component   // polymorphic: renders as <a>, <router-link>, etc.
}
```

### What to build
- `Btn.vue` — main component using CSS custom properties for variant/color/size
- `BtnGroup.vue` — groups buttons, removes inner borders
- Scoped CSS using `@[name]/core` tokens only, no hardcoded values
- All styles via CSS variables so theming overrides work automatically
- Keyboard accessible, ARIA attributes correct
- Loading state shows spinner (uses `@[name]/icons` internally)
- Polymorphic `as` prop support

### 📄 Generate: `packages/btn/README.md`
Cover: install (with and without full framework), basic usage, all variants (with code blocks), all sizes, loading state, icon usage, BtnGroup, polymorphic usage with `<a>` and `<RouterLink>`, TypeScript types.

### 📄 Generate: `packages/btn/docs/DECISIONS.md`
Document every architectural decision: why CSS custom props over Tailwind, why polymorphic `as`, how color/variant matrix works, accessibility approach.

---

## PHASE 6 — TABLE PACKAGE (`@[name]/table`)

Most complex component. Build on top of **TanStack Table v8** (`@tanstack/vue-table`).

### Core features (Phase 6a — core table)
- Column definitions with type-safe accessors
- Client-side sorting (click header)
- Client-side pagination
- Row selection (checkbox column)
- Loading state (skeleton rows)
- Empty state slot
- Density variants: `compact`, `default`, `comfortable`

### Advanced features (Phase 6b — add-ons)
- Client-side column filtering
- Column visibility toggle
- Column resizing
- Sticky header
- Row expand (nested rows)
- Virtual scrolling for large datasets (via `@tanstack/virtual`)

### API design
```ts
// Declarative column definition
const columns = defineColumns<User>([
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', filterable: true },
  {
    key: 'actions',
    header: '',
    cell: ({ row }) => h(BtnGroup, [...])  // render function or slot
  }
])
```

```vue
<DataTable
  :data="users"
  :columns="columns"
  :loading="isLoading"
  paginate
  :page-size="20"
  selectable
  @selection-change="onSelect"
>
  <template #empty>No users found.</template>
</DataTable>
```

### Internal structure
```
packages/table/src/
├── components/
│   ├── DataTable.vue       # main component
│   ├── TableHeader.vue
│   ├── TableBody.vue
│   ├── TableRow.vue
│   ├── TableCell.vue
│   ├── TablePagination.vue
│   └── TableSkeleton.vue
├── composables/
│   ├── useTable.ts         # wraps TanStack Table
│   ├── usePagination.ts
│   └── useSelection.ts
├── types.ts
└── index.ts
```

### 📄 Generate: `packages/table/README.md`
Cover: install, column definition API, basic usage, sorting/filtering/pagination toggles, row selection, loading state, empty state slot, TypeScript generics.

### 📄 Generate: `packages/table/docs/COLUMN-API.md`
Full column definition reference with every option, type, and example.

---

## PHASE 7 — FULL FRAMEWORK BUNDLE (`@[name]/vue`)

This package does nothing but re-export. It exists purely for convenience.

### `packages/vue/src/index.ts`
```ts
// Re-export everything
export * from '@[name]/core'
export * from '@[name]/icons'
export * from '@[name]/btn'
export * from '@[name]/table'
// ... all packages
```

### `packages/vue/src/plugin.ts`
```ts
// Single plugin that installs everything
export const [NAME]: Plugin = {
  install(app, options) {
    app.use([NAME]CorePlugin, options)
    // All components auto-registered globally
    app.component('Btn', Btn)
    app.component('BtnGroup', BtnGroup)
    app.component('DataTable', DataTable)
    app.component('Icon', Icon)
    // ...
  }
}
```

### 📄 Generate: `packages/vue/README.md`
Full framework README: install, both usage modes (full vs granular), `createApp` setup, all available packages listed with links.

---

## PHASE 8 — PLAYGROUND APP (`apps/playground`)

A Vite + Vue 3 app for visual development. Not a docs site — just a sandbox.

- Uses `workspace:*` to import all local packages
- One page per component: `/btn`, `/table`, `/icons`, etc.
- Shows every variant of every component
- Renders in real browser for visual QA
- This is where you develop and test before writing tests

---

## PHASE 9 — DOCS SITE (`apps/docs`)

VitePress site. Content comes from the `.md` files already generated in each package.

### VitePress config
- Sidebar auto-generated from package directories
- Each package gets its own section
- Links to `packages/[name]/README.md` as the package's docs page
- API reference generated from TypeScript types via `typedoc`

### Docs structure
```
apps/docs/
├── .vitepress/
│   └── config.ts           # sidebar from packages
├── guide/
│   ├── getting-started.md
│   ├── installation.md
│   ├── theming.md
│   └── contributing.md
├── components/             # symlinks or copies from packages/*/README.md
│   ├── btn.md
│   ├── table.md
│   └── icons.md
└── index.md                # homepage
```

### 📄 Generate: `apps/docs/guide/getting-started.md`
### 📄 Generate: `apps/docs/guide/theming.md`
### 📄 Generate: `apps/docs/guide/contributing.md`

---

## DOCUMENTATION RULE (NON-NEGOTIABLE)

After completing each phase, you **must** generate or update:

| Event | Required .md action |
|---|---|
| New package created | `packages/[name]/README.md` + `CHANGELOG.md` |
| New component built | Update package README with usage example |
| New prop added | Update README props table |
| Architectural decision made | Add to `DECISIONS.md` in package docs |
| Phase completed | Update root `README.md` package table |
| API breaking change | Update CHANGELOG with migration guide |

Do not ask whether to create documentation. Always create it.

---

## NAMING AND CONVENTIONS

### CSS class naming
Use BEM-like scoped naming with framework prefix:
```css
.[name]-btn { }
.[name]-btn--primary { }
.[name]-btn--sm { }
.[name]-btn__icon { }
```

### CSS custom property naming
```css
--[name]-btn-bg: var(--[name]-color-primary-500);
--[name]-btn-radius: var(--[name]-radius-md);
```

### TypeScript
- All component props have a corresponding `[Name]Props` interface exported
- All emits have a corresponding `[Name]Emits` interface exported
- No `any` types allowed
- Use `defineProps<[Name]Props>()` syntax

### File naming
- Components: `PascalCase.vue`
- Composables: `useComposableName.ts`
- Types: `types.ts` (flat per package)
- Tests: `ComponentName.test.ts`

---

## BUILD ORDER

Execute phases in this exact order. Do not skip ahead.

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6a → Phase 6b → Phase 7 → Phase 8 → Phase 9
```

After Phase 4 (create-package script exists), all new packages use the script to scaffold.

At the end of every phase, run:
```bash
pnpm build
pnpm test
```

Fix all errors before proceeding to the next phase.

---

## WHAT NOT TO DO

- Do not use Tailwind CSS — all styling uses CSS custom properties from `@[name]/core`
- Do not hardcode color values anywhere — always reference tokens
- Do not build a component without its README
- Do not mix concerns between packages — `@[name]/btn` must not import from `@[name]/table`
- Do not use Vue 2 options API — composition API only
- Do not use `defineComponent` wrapper where `<script setup>` works

---

*End of Claude Code Plan Prompt*

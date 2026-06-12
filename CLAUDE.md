# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read first

[`AGENTS.md`](./AGENTS.md) is the canonical operating guide and supersedes this file where they overlap — read it before touching code. Deeper references: [`docs/SPEC.md`](./docs/SPEC.md) (product spec), [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) (rationale), [`docs/DESIGN-LANGUAGE.md`](./docs/DESIGN-LANGUAGE.md) (design language — principles, color/shape identity), [`docs/REMAINING-PHASES.md`](./docs/REMAINING-PHASES.md) (roadmap). The button package (`packages/btn/`) and its `docs/DECISIONS.md` are the reference implementation.

## What this is

A modular, tree-shakeable Vue 3 component framework. Each component is an independently publishable npm package (`@thevue/btn`, `@thevue/table`, …) that works standalone with only `@thevue/core` (design tokens + theming) as a peer dependency. `@thevue/vue` is a convenience bundle re-exporting everything. Consumers can install the whole framework or just one package.

## Layer rule (the core architectural constraint)

Packages depend only on **lower** layers, and **atomic components must never import each other**:

```
L0  @thevue/core    design tokens, theme engine, Vue plugin (only required pkg)
L1  @thevue/icons   Icon component (Iconify + custom registry)
L2  components       @thevue/btn, @thevue/table, …  (atomic — never import each other)
L3  blocks / @thevue/vue   blocks MAY use L2; vue re-exports everything
```

`create-package --layer component` forbids component deps; `--layer block` permits them via `--deps`. This isolation is what keeps every package independently installable.

## Commands (run from repo root)

> ⚠️ The shell may open at `D:\`, not the repo. `Set-Location D:\thevue` first or pnpm fails with `ERR_PNPM_NO_PKG_MANIFEST`. Node ≥ 22, pnpm via corepack (`corepack enable pnpm`). One-time before tests: `pnpm exec playwright install chromium`.

```powershell
pnpm install
pnpm build                         # Turborepo, build → test, dependsOn ^build
pnpm test                          # Vitest browser mode (headless Chromium)
pnpm lint                          # ESLint (@antfu flat config)
pnpm exec eslint . --fix           # autofix lint + formatting

pnpm --filter @thevue/table test   # scope to one package
pnpm --filter @thevue/table build

# scaffold a new package — do NOT hand-roll one
pnpm create-package --name modal --display-name "Modal" --layer component
pnpm create-package --name dashboard --display-name "Dashboard" --layer block --deps btn,table
```

There is no per-file test runner script; narrow with Vitest's filter, e.g. `pnpm --filter @thevue/table test -- table.test`.

## Non-negotiable workflow

1. **TDD** — failing test first, watch it fail, then implement.
2. **Docs in the same change** — a package/component change must create/update its `.md` docs; a component without a README is incomplete.
3. **Tokens only** — no Tailwind/utility framework, no hardcoded colors. Style with plain CSS driven by `--thevue-*` custom properties (full list: `packages/core/docs/TOKENS.md`).
4. **The Gate before every commit:** `pnpm build`, `pnpm test`, `pnpm exec eslint . --fix` then `pnpm lint` all pass → docs updated → root `README.md` package table updated if a package was added → commit + `git push origin main`.

## Conventions that aren't obvious from the code

- **`<script setup lang="ts">` + Composition API only.** Export `*Props` / `*Emits` interfaces from `types.ts`. No `any`.
- **Emits are declared camelCase** (`selectionChange`); templates still bind `@selection-change`; tests read `screen.emitted('selectionChange')`.
- **CSS is BEM-ish** (`thevue-btn`, `thevue-btn__icon`, `thevue-btn--solid`). Color/variant matrices use indirection variables (a color modifier sets `--thevue-btn-base/hover/...`; variants consume them) so N colors × M variants stays N+M blocks, not N×M.
- **Polymorphism via an `as` prop** with `<component :is>`; apply `type`/`disabled` only for native elements, otherwise convey disabled via `aria-disabled` + a capture-phase click guard (see `packages/btn/docs/DECISIONS.md`).

## Build & package shape

ESM-only output via Vite lib mode: `dist/index.mjs` + `dist/index.d.ts` + `dist/style.css` (no CJS, no `main`). Each `vite.config.ts` is one line — `createLibConfig({ packageUrl: import.meta.url })` from [`scripts/vite-lib.ts`](./scripts/vite-lib.ts); pass `overrides` for per-package needs. `package.json` `exports` lists the `types` condition **first**, then `import`; `./style` → `dist/style.css`; `sideEffects: ["**/*.css"]`. `tsconfig.json` must set `rootDir: "src"` and empty `paths: {}` (so `vite-plugin-dts` doesn't pull sibling sources → TS6059).

## Testing gotchas (these cost real debugging time)

- Use **`vitest-browser-vue`** `render()`. Do **not** use `@vue/test-utils` — it breaks under the rolldown optimizer (`init_shared_esm_bundler is not defined`).
- Use **async locator clicks**: `await screen.getByRole('button', { name: 'Go' }).click()`. A synchronous `element.click()` right after mount gets swallowed by Vue's event-timestamp guard (flaky).
- Pass event listeners via the `attrs:` render option, not `props:`.
- Add heavy deps (e.g. `@tanstack/vue-table`) to `optimizeDeps.include` via `vite.config.ts` `overrides` to stop mid-run optimizer reloads that break Vue module identity.

## Git / releases

Work goes straight to `main` after the Gate passes. Commit subject: `Phase N: <package> — <summary>` (or a clear imperative). Releases use Changesets with `linked` versioning across `@thevue/*` (dormant until the npm org `thevue` and `NPM_TOKEN` secret exist).

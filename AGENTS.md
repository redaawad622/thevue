# AGENTS.md

Operating guide for AI agents (and humans) working on **thevue**. Read this
before touching code. The product spec is [`docs/SPEC.md`](./docs/SPEC.md); the
remaining roadmap is [`docs/REMAINING-PHASES.md`](./docs/REMAINING-PHASES.md);
the architecture rationale is [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md);
the design language (principles, color/shape identity) is
[`docs/DESIGN-LANGUAGE.md`](./docs/DESIGN-LANGUAGE.md).

## What this project is

thevue is a **modular, tree-shakeable Vue 3 component framework**. Every
component is an independently publishable npm package (`@thevue/btn`,
`@thevue/table`, …). Each works standalone with only `@thevue/core` (design
tokens + theming) as a peer dependency. `@thevue/vue` is a convenience bundle
that re-exports everything. A consumer can install the whole framework **or**
just one package.

## Golden rules (non-negotiable)

1. **Docs always.** Every package/component change must create or update its
   `.md` docs **in the same change** — never deferred. A component without a
   README is incomplete.
2. **Tokens only.** No Tailwind, no utility framework, no hardcoded color values.
   All styling is plain CSS driven by `--thevue-*` custom properties from
   `@thevue/core`.
3. **TDD.** Write the failing test first, watch it fail, then implement. No
   production code without a failing test first.
4. **Layer rule.** Packages may depend only on **lower** layers. Atomic
   components must **never** import each other. (See Layers below.)
5. **Composition API + `<script setup lang="ts">` only.** Export `*Props` /
   `*Emits` interfaces. No `any`.
6. **Gate before commit.** `pnpm build` + `pnpm test` + `pnpm lint` must all pass
   before every commit (see The Gate).

## Layers (dependency direction)

```
L0  @thevue/core    design tokens, theme engine, Vue plugin (only required pkg)
L1  @thevue/icons   Icon component on Iconify + custom registry
L2  components       @thevue/btn, @thevue/table, …  (atomic — never import each other)
L3  blocks           future full-page packages (landing, dashboard, portfolio) — MAY use L2
L3  @thevue/vue      convenience bundle re-exporting everything
```

A package depends only on layers below it. Components are atomic and isolated;
**blocks** may depend on any component package. `create-package --layer block`
permits component deps via `--deps`; `--layer component` forbids them.

## Environment

- **OS:** Windows. Shell examples are PowerShell.
- **Node** ≥ 22, **pnpm** via corepack (pinned `pnpm@11.5.3` in root
  `package.json`). If pnpm is missing: `corepack enable pnpm`.
- ⚠️ **The shell working directory may be `D:\`, not the repo.** Always
  `Set-Location D:\thevue` (or `cd D:\thevue`) first, or pnpm scans the wrong
  workspace root and fails with `ERR_PNPM_NO_PKG_MANIFEST`.
- Browser-mode tests need Chromium once: `pnpm exec playwright install chromium`.

## Commands (run from repo root)

```powershell
pnpm install                       # install workspace deps
pnpm build                         # build all packages (Turborepo, ^build ordering)
pnpm test                          # run all tests (Vitest browser mode)
pnpm lint                          # ESLint (@antfu flat config)
pnpm exec eslint . --fix           # autofix lint + formatting
pnpm dev                           # watch / playground
pnpm docs:dev                      # VitePress docs site

# scoped to one package
pnpm --filter @thevue/table build
pnpm --filter @thevue/table test

# scaffold a new package (do NOT hand-roll one)
pnpm create-package --name modal --display-name "Modal" --layer component
pnpm create-package --name dashboard --display-name "Dashboard" --layer block --deps btn,table
```

## The Gate (every change, in order)

1. `pnpm build` — passes.
2. `pnpm test` — passes.
3. `pnpm exec eslint . --fix` then `pnpm lint` — clean.
4. Required `.md` docs created/updated.
5. Root `README.md` package table updated if a package was added.
6. `git commit` + `git push origin main`.

> Current green baseline: core 21, icons 7, btn 9, table 11 tests.

## Tech stack

pnpm workspaces · Turborepo (`build` → `test`, `dependsOn: ["^build"]`) ·
**Vite 8 (rolldown) library mode** + `vite-plugin-dts` · TypeScript 6 strict ·
Vue 3.5 · Vitest 4 **browser mode** (Playwright/Chromium) · `vitest-browser-vue`
· `@antfu/eslint-config` (flat) · Changesets (`linked: [["@thevue/*"]]`) ·
`@iconify/vue` · `@tanstack/vue-table` v8 · VitePress (docs).

**Amendments over the spec:** build is Vite lib mode (not unbuild); **ESM-only**
output (`dist/index.mjs` + `dist/index.d.ts` + `dist/style.css`, no CJS, no
`main`); exports map lists the `types` condition **first**.

## Per-package anatomy

```
packages/<name>/
├── src/
│   ├── components/        *.vue
│   ├── composables/       use*.ts
│   ├── types.ts           exported *Props / *Emits interfaces
│   └── index.ts           public API barrel
├── tests/                 *.test.ts (Vitest browser mode)
├── docs/                  DECISIONS.md / COLUMN-API.md / etc. (as needed)
├── README.md  CHANGELOG.md
├── package.json  vite.config.ts  tsconfig.json
```

- **`vite.config.ts`** is one line:
  `export default createLibConfig({ packageUrl: import.meta.url })`
  (factory in [`scripts/vite-lib.ts`](./scripts/vite-lib.ts)). Pass `overrides`
  for per-package needs (e.g. `optimizeDeps.include` for heavy deps).
- **`tsconfig.json`** must set `compilerOptions: { rootDir: "src", paths: {} }`
  and `include: ["src/**/*.ts", "src/**/*.vue"]`. The empty `paths` is required
  so `vite-plugin-dts` doesn't pull sibling package sources (TS6059).
- **`package.json`:** ESM-only `exports` (`types` first, then `import`),
  `./style` → `dist/style.css`, `sideEffects: ["**/*.css"]`,
  peerDeps `vue >=3.3` + `@thevue/core workspace:*`.

## Coding conventions

- **CSS:** BEM-ish classes — block `thevue-btn`, element `thevue-btn__icon`,
  modifier `thevue-btn--solid`. Color/variant matrices use indirection variables
  (a color modifier sets `--thevue-btn-base/hover/...`; variants consume them) so
  N colors × M variants is N+M blocks, not N×M.
- **Tokens:** reference `--thevue-color-*`, `--thevue-space-*`, `--thevue-text-*`,
  `--thevue-radius-*`, etc. Never literal hex/rgb. Full list in
  [`packages/core/docs/TOKENS.md`](./packages/core/docs/TOKENS.md).
- **Emits:** declare **camelCase** (`selectionChange`). Templates still bind
  `@selection-change`; tests read `screen.emitted('selectionChange')`.
- **Polymorphism:** components that can render as different elements use an `as`
  prop with `<component :is>`; apply `type`/`disabled` only for native elements
  and convey disabled state via `aria-disabled` + a capture-phase click guard
  otherwise (see `packages/btn/docs/DECISIONS.md`).

## Testing rules (important gotchas)

- Use **`vitest-browser-vue`** `render()`. Do **not** use `@vue/test-utils` — it
  breaks under the rolldown optimizer (`init_shared_esm_bundler is not defined`).
- For click assertions use **async locator clicks**:
  `await screen.getByRole('button', { name: 'Go' }).click()`. A synchronous
  `element.click()` right after mount can be swallowed by Vue's event-timestamp
  guard (flaky).
- Pass event listeners via the `attrs:` option, not `props:`.
- Add heavy deps (e.g. `@tanstack/vue-table`) to `optimizeDeps.include` via the
  `vite.config.ts` `overrides` to stop mid-run optimizer reloads that break Vue
  module identity.
- Browser mode is headless Chromium via `@vitest/browser-playwright`
  (`provider: playwright()` — a function, not the old string).

## Git / releases

- Branch is `main`; commits go straight to it after the gate passes.
- Commit subject: `Phase N: <package> — <summary>` (or a clear imperative for
  non-phase work). End the body with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Releases use Changesets (`linked` versioning across `@thevue/*`). The release
  workflow is dormant until the user creates the npm org `thevue` and adds an
  `NPM_TOKEN` secret. Author changesets when publishing.

## Where to start

- Picking up the roadmap → [`docs/REMAINING-PHASES.md`](./docs/REMAINING-PHASES.md)
  (next up: Phase 6b table add-ons).
- Reference implementation patterns → `packages/btn/` and its
  `docs/DECISIONS.md`.
- New component → `pnpm create-package …`, then TDD, then The Gate.

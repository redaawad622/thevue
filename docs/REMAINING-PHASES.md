# thevue — Remaining Phases (Handoff)

This document captures the work **not yet done** so any future session can resume
without re-deriving context. The authoritative full plan is
[`SPEC.md`](./SPEC.md); the approved execution plan lives at
`C:\Users\redaa\.claude\plans\i-want-a-plan-tidy-comet.md`.

## Status snapshot (as of 2026-06-11)

| Phase | Package / Work | State |
| --- | --- | --- |
| 1 | Monorepo bootstrap | ✅ done (commit `f4fd978`) |
| 2 | `@thevue/core` — tokens, theme, plugin | ✅ done (`231bf1e`) |
| 3 | `@thevue/icons` — Icon + registry | ✅ done (`6a6a94b`) |
| 4 | `scripts/create-package.ts` | ✅ done (`fa82ade`) |
| 5 | `@thevue/btn` — reference component | ✅ done (`fee3c3f`) |
| **6a** | **`@thevue/table` core** | ✅ **done — this commit** |
| 6b | table add-ons | ⬜ pending |
| 7 | `@thevue/vue` bundle | ⬜ pending |
| 8 | `apps/playground` | ⬜ pending |
| 9 | `apps/docs` (VitePress) | ⬜ pending |

**Test counts (all headless Chromium / browser mode):** core 21, icons 7,
btn 9, table 11.

## Per-phase gate (apply to every remaining phase)

From the repo root (`D:\thevue`), in order:

1. `pnpm build` — must pass (Turborepo, `^build` ordering builds deps first).
2. `pnpm test` — must pass.
3. `pnpm exec eslint . --fix` then `pnpm lint` — must be clean.
4. 📄 Create/update the required `.md` docs **in the same phase** (non-negotiable rule).
5. Update the root `README.md` package table if a package was added.
6. `git commit` + `git push origin main`. Commit message style:
   `Phase N: <package> — <summary>` with trailer
   `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

> ⚠️ The shell working directory is `D:\` (not the repo). Always
> `Set-Location D:\thevue` first, or pnpm scans the wrong workspace root.

## Conventions already established (reuse verbatim)

- **New package:** scaffold with
  `pnpm create-package --name x --display-name "X" [--layer component|block] [--deps btn,table]`.
  Components may not use `--deps`; blocks may depend on component packages.
- **Build:** every package's `vite.config.ts` is just
  `export default createLibConfig({ packageUrl: import.meta.url, overrides? })`
  (`scripts/vite-lib.ts`). ESM-only: `dist/index.mjs` + `dist/index.d.ts` + `dist/style.css`.
- **tsconfig per package:** `extends ../../tsconfig.base.json`,
  `compilerOptions: { rootDir: "src", paths: {} }`, `include: ["src/**/*.ts","src/**/*.vue"]`.
  (`paths: {}` is required so `vite-plugin-dts` doesn't pull sibling sources → TS6059.)
- **exports map:** `types` condition FIRST, then `import`; `./style` → `dist/style.css`;
  `sideEffects: ["**/*.css"]`.
- **Styling:** plain CSS via `--thevue-*` tokens only. No Tailwind, no hardcoded colors.
  BEM-ish classes (`thevue-x__el`, `thevue-x--modifier`).
- **Components:** `<script setup lang="ts">`, exported `*Props`/`*Emits` interfaces,
  no `any`. Emits declared **camelCase** (e.g. `selectionChange`) — templates still use
  `@selection-change`; tests read `screen.emitted('selectionChange')`.
- **Tests:** `vitest-browser-vue` `render()` (NOT @vue/test-utils — broken under the
  rolldown optimizer). For click assertions use **async locator clicks**
  (`await screen.getByRole(...).click()`), not synchronous `element.click()` (Vue
  event-timestamp guard flake). Pass listeners via `attrs:`, not `props:`.
  Add any heavy dep to `optimizeDeps.include` via `overrides` to stop mid-run reloads
  (table does this for `@tanstack/vue-table`).
- **TDD:** write the failing test first, watch it fail, then implement.

---

## Phase 6b — `@thevue/table` add-ons

Extend the existing `@thevue/table` package (do **not** scaffold a new one).
Build on the current core: `defineColumns`, `DataTable.vue`, `TablePagination.vue`,
`useThevueTable` (in `src/composables/useTable.ts`), `buildColumnDefs` + column
`meta` (`{ cell, width, align }`).

**Features to add (TDD each):**

1. **Column filtering** — per-column text filter. Add `filterable?: boolean` to
   `ColumnOptions`; wire `getFilteredRowModel()` + `columnFilters` state in
   `useThevueTable`; render filter inputs (a `#toolbar` slot or per-header inputs).
2. **Column visibility toggle** — expose `columnVisibility` state + a control
   (dropdown/checkboxes) to hide/show columns. Add `getVisibleLeafColumns` usage is
   already present; add a public API to toggle.
3. **Column resizing** — enable TanStack `columnResizing` (`enableColumnResizing`,
   `columnResizeMode: 'onChange'`); render drag handles in `th`; apply
   `header.getSize()` to widths.
4. **Sticky header** — `stickyHeader?: boolean` prop → `position: sticky; top: 0`
   on `thead th` with a token background + `max-height`/scroll container.
5. **Row expansion** — `getExpandedRowModel()`, `expanded` state, an expander
   column/button, and an `#expanded` slot receiving the row.
6. **Virtual scrolling** — add `@tanstack/vue-virtual` as a dependency
   (`pnpm --filter @thevue/table add @tanstack/vue-virtual`); add `virtual?: boolean`
   (or `virtualize`) that swaps the tbody for a virtualized window. Add
   `@tanstack/vue-virtual` to `optimizeDeps.include` in the table `vite.config.ts`
   overrides.

**Docs (📄 required):**
- Update `packages/table/README.md` with sections for each add-on.
- Update `packages/table/docs/COLUMN-API.md` with the new column options
  (`filterable`, resizing notes, etc.).

**Gate + commit:** `Phase 6b: @thevue/table — filtering, visibility, resizing, sticky, expand, virtual`.

---

## Phase 7 — `@thevue/vue` (convenience bundle)

Scaffold/confirm the `packages/vue` package (a row already exists in the root
README; the package dir may need creating — if so, do it by hand following the
template, NOT via create-package, since this is the L3 aggregate bundle).

**`package.json`:** depends on all component packages with `workspace:*`
(`@thevue/core`, `@thevue/icons`, `@thevue/btn`, `@thevue/table`). ESM-only exports
+ `./style` aggregating every package's CSS.

**`src/index.ts`:** pure re-export of every package's public API
(`export * from '@thevue/btn'`, etc.) plus the theming exports from core.

**`src/plugin.ts`:** a `Thevue` Vue plugin that:
- calls/install s the core `ThevuePlugin` (injects token `<style>`),
- `app.component('Btn', Btn)`, `BtnGroup`, `Icon`, `DataTable`, `TablePagination`, …
  (global registration of every component).

**`src/style.css`** (or the `./style` export): `@import` each package's
`dist/style.css` so `import '@thevue/vue/style'` pulls everything.

**Tests:** a small test that the plugin installs and registers components globally
(mount an app using `<Btn>` without local import).

**Standalone-install proof (verification, after build):** `npm pack` `@thevue/core`
+ `@thevue/btn`, install the tarballs into a scratch Vite app **outside** the
monorepo, confirm `<Btn>` renders + themes without the rest of the framework.

**Docs (📄):** `packages/vue/README.md` — both usage modes (whole framework vs single
package), full package list with links, the `Thevue` plugin API.

**Gate + commit:** `Phase 7: @thevue/vue — framework bundle + Thevue plugin`.

---

## Phase 8 — `apps/playground`

A Vite + Vue 3 sandbox app (dev-only, **not published** — mark `private: true`,
no exports map). Lives in `apps/playground`; `pnpm-workspace.yaml` already globs
`apps/*`.

- `workspace:*` deps on the packages you want to demo.
- One route/page per package: `/btn`, `/table`, `/icons`, `/theme` — each rendering
  every variant/state (all btn variants×colors×sizes; a table with sorting,
  pagination, selection, loading, empty, density; icon sizes/spin/flip; theme toggle).
- Wire `pnpm dev` at the root to run the playground (turbo `dev` task, persistent).
- Use the `Thevue` plugin from `@thevue/vue` (or import per-package) + a dark-mode
  toggle exercising `@thevue/core` theming.

**Docs (📄):** short `apps/playground/README.md` (how to run, what each route shows).

**Gate:** `pnpm build` + `pnpm test` still pass; visually confirm `pnpm dev` renders
each route. **Commit:** `Phase 8: playground sandbox app`.

---

## Phase 9 — `apps/docs` (VitePress)

VitePress site in `apps/docs` (`private: true`). Wire root scripts `docs:dev`,
`docs:build` (they exist in root `package.json`).

- **Sidebar** generated from the `packages/*` directories.
- **Component pages** sourced by **copying** each `packages/*/README.md` into the
  docs content at build time (a small prebuild copy script — more reliable than
  symlinks on Windows). Do NOT symlink.
- **Guide pages (📄):** `guide/getting-started.md`, `guide/installation.md`
  (both install modes), `guide/theming.md` (tokens + `createTheme`/`ThemeProvider`,
  link `packages/core/docs/TOKENS.md`), `guide/contributing.md` (layer rules,
  create-package, gate). Home page with tagline + install options.
- Optionally embed live component demos via VitePress + the playground components.

**Verification:** `pnpm docs:build` succeeds; `pnpm docs:dev` renders sidebar +
component pages.

**Gate + commit:** `Phase 9: VitePress documentation site`.

---

## Manual follow-ups for the user (not blocking; do at the end)

1. Create the npm org **`thevue`** (fallback `@thevuejs` if taken) and add an
   `NPM_TOKEN` repo secret to activate `.github/workflows/release.yml`.
2. Confirm the GitHub Actions **CI** run is green after the first push.
3. Merge the Changesets "Version Packages" PR when ready for the first `0.1.0`
   publish. (No changesets have been authored yet — add them when publishing.)

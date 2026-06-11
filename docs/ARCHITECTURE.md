# thevue — Architecture

This document records the architecture decisions that **amend or extend** [SPEC.md](./SPEC.md). Where the two conflict, this document wins.

## Build system: Vite library mode (not unbuild)

Every package is built with **Vite library mode** + `@vitejs/plugin-vue` + `vite-plugin-dts` (which uses `vue-tsc` to emit correct `.d.ts` for `.vue` SFCs). The shared preset lives in [`scripts/vite-lib.ts`](../scripts/vite-lib.ts); each package's `vite.config.ts` is a thin call to `createLibConfig({ packageUrl: import.meta.url })`.

**Why not unbuild (as the original spec said):** unbuild has poor support for compiling `.vue` single-file components. Vite lib mode is the battle-tested path for Vue component libraries, and we already use Vite for the playground and docs.

## Output format: ESM-only

Each package ships exactly:

```
dist/
├── index.mjs       # ESM bundle
├── index.d.ts      # types (plus per-file .d.ts tree)
└── style.css       # all component styles, single file
```

No CJS, no `main` field. The `exports` map puts the `types` condition **first** (required by TypeScript):

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    },
    "./style": "./dist/style.css"
  }
}
```

**Why:** Vue 3 tooling is ESM/Vite-first. Dual ESM+CJS doubles build complexity and invites the dual-package hazard for near-zero benefit in 2026.

## Package layers

```
L0  @thevue/core      tokens + theming (the only required package)
L1  @thevue/icons     icon system
L2  components        @thevue/btn, @thevue/table, …  (atomic components)
L3  blocks            @thevue/landing, @thevue/dashboard, …  (full sections/pages)
     and @thevue/vue  (the convenience bundle re-exporting everything)
```

**The layer rule:** a package may depend only on packages in **lower** layers.

- Atomic components (L2) never import each other — `@thevue/btn` must not import `@thevue/table`.
- **Blocks (L3) may depend on any component packages.** This is how full landing pages, portfolios, or dashboards ship as installable packages built from thevue components.
- `scripts/create-package.ts` takes `--layer component|block` and sets the allowed dependencies in the generated template accordingly.

## Versioning: Changesets with linked packages

All `@thevue/*` packages are **linked** in `.changeset/config.json` — when any of them gets a changeset, they version-bump together. This prevents version skew (e.g. `@thevue/btn@1.2` against an incompatible `@thevue/core@2.0`). Access is `public` (scoped packages default to restricted otherwise).

## Testing: Vitest with browser mode

- **Pure TypeScript** (tokens, theme creation, utilities): plain Vitest, node environment.
- **Components**: Vitest **browser mode** (real Chromium via Playwright) + `@vue/test-utils` — catches real rendering/interaction issues jsdom misses.
- One-time local setup: `pnpm exec playwright install chromium` (CI does this automatically).

## CI/CD

- [`ci.yml`](../.github/workflows/ci.yml) — build, test, lint on every push/PR.
- [`release.yml`](../.github/workflows/release.yml) — Changesets action: opens a "Version Packages" PR, publishes to npm when it merges. Dormant until the `thevue` npm org exists and an `NPM_TOKEN` secret is added to the repo.

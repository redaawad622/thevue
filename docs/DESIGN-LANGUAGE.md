# thevue — Design Language

This document defines the **design language** behind thevue: the principles, the
color and shape system, and the identity that every `@thevue/*` package shares. It
sits alongside [`SPEC.md`](./SPEC.md) (product spec) and
[`ARCHITECTURE.md`](./ARCHITECTURE.md) (engineering rationale); where this document
and SPEC.md disagree on *visual* matters, this one wins.

The full machine-readable token reference lives in
[`packages/core/docs/TOKENS.md`](../packages/core/docs/TOKENS.md).

## Principles

1. **Neutral by default, brandable by design.** Out of the box thevue is a calm,
   professional, low-chrome system. Its identity lives in a single accent and a
   consistent shape language — everything else is restrained so a consumer's brand
   can lead. There are no hardcoded colors in components: every surface, text,
   border, and interactive state resolves through a `--thevue-*` token.
2. **Token-first.** Components never embed raw values. The design language is a set
   of CSS custom properties; components are just structured consumers of them. This
   is what makes a single `createTheme({ … })` call re-skin the whole framework.
3. **Tree-shakeable & composable.** The language is delivered by `@thevue/core`
   (L0) — the only required package — so any component can adopt the full system
   while being installed standalone. The [layer rule](./ARCHITECTURE.md#package-layers)
   keeps the language consistent without coupling packages to each other.
4. **Accessible first.** Color pairings target WCAG **AA** (4.5:1 for text, 3:1 for
   large text / UI) in both light and dark themes. State is never conveyed by color
   alone.

## Lineage: why *not* Material Design

thevue deliberately follows the **Radix UI / shadcn methodology** — a *semantic
token system* you brand yourself — rather than adopting an opinionated, recognizable
visual language like Material Design.

- Material Design is a strong, distinctive identity. Adopting it would erase the
  bring-your-own-brand promise that is thevue's reason to exist.
- In the Vue ecosystem, Material is already owned by **Vuetify**. Cloning it means
  competing on someone else's turf with less maturity, not differentiating.
- A neutral, semantic foundation lets thevue be *the brandable Vue framework*:
  install it, set one accent, and it looks like your product — not like Google's.

Consumers who specifically want a Material (or any other) look can build it as an
opt-in theme preset on top of this system — see *Rebranding* below.

## Color system

Color is organized in three tiers, lowest to highest:

| Tier | Tokens | Purpose |
| --- | --- | --- |
| **Ramps** | `--thevue-color-{palette}-{50…950}` | Five raw 11-step ramps: `primary`, `neutral`, `success`, `warning`, `danger`. The building blocks. |
| **Semantic** | `--thevue-{bg,text,border,interactive}-{role}` | Intent-named roles (`bg-base`, `text-subtle`, `border-strong`, `interactive-hover`) that reference ramp shades. Components consume **these**, not raw ramps, so dark mode and re-theming are automatic. |
| **Scales** | `font`, `space`, `radius`, `shadow`, `z` | Non-color design dimensions. |

**Dark mode** is a parallel set of semantic mappings over the *same* ramps: light
values on `:root`, dark overrides on `[data-theme="dark"]`, plus automatic
`prefers-color-scheme` honoring unless the user opted out with `data-theme="light"`.
Because only the semantic tier flips, a single ramp serves both themes.

## Signature identity

Two choices give thevue a recognizable look without sacrificing neutrality:

### Accent — Violet / Iris

The `primary` ramp is a **violet/iris** scale anchored at `--thevue-color-primary-600
= #7c3aed` (the main interactive color in light mode). It is distinctive and premium
where the usual framework blue is anonymous, while sitting close enough to a
conventional indigo that it never feels loud. White text on `primary-600` clears
WCAG AA (~5.7:1) for normal text.

### Shape — Crisp & modern

- **Radius:** a moderate scale (`sm 0.25 · md 0.5 · lg 0.75 · xl 1rem`) — softened
  corners that read as contemporary without being playful or pill-like.
- **Elevation:** soft, **layered** shadows (two stacked layers) carrying a faint
  cool tint (`rgb(15 23 42 …)` — slate, not pure black) so elevation feels of a
  piece with the neutral palette rather than a gray drop-shadow bolted on.
- **Density:** the 4px spacing scale stays comfortable — readable, not cramped.

## Accessibility targets

- Body text on any `bg-*` surface: **≥ 4.5:1**.
- `text-on-accent` (e.g. white on `interactive-default`/`primary-600`): **≥ 4.5:1**.
- Large text, icons, borders, focus rings: **≥ 3:1**.
- Verify both `:root` (light) and `[data-theme="dark"]` whenever a color token moves.

## Rebranding

The language is yours to re-skin. Override any tokens with
[`createTheme`](../packages/core/src/theme/createTheme.ts) — overrides are
deep-merged over a base theme, so you change only what you name:

```ts
import { createTheme } from '@thevue/core'

// Re-brand the accent; everything that references the primary ramp follows.
const brand = createTheme({
  name: 'acme',
  tokens: {
    colors: {
      primary: { 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
    },
  },
})
```

Apply it via the `Thevue` plugin (`theme` / `darkTheme` options) or a scoped
`ThemeProvider`. Because components only ever read semantic tokens, a re-brand needs
**no component changes** — which is the whole point of the system. Opt-in *presets*
(e.g. a Material- or minimal-flavored token set) are the same mechanism applied
wholesale, and may ship later as named themes.

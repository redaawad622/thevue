# @thevue/btn — Design Decisions

`Btn` is the reference implementation for all thevue component packages. The patterns recorded here are the conventions every future component follows.

## CSS custom properties instead of Tailwind (or any utility framework)

Styling is plain CSS driven entirely by `--thevue-*` tokens from `@thevue/core`:

- **Zero runtime and zero build coupling** — consumers don't need Tailwind, PostCSS plugins, or a particular bundler config. `import '@thevue/btn/style'` is the whole story.
- **Theming for free** — `createTheme` / `ThemeProvider` change the custom properties; every component re-colors automatically, including scoped subtrees, with no per-component theme API.
- **No specificity wars** — BEM-ish classes (`thevue-btn`, `thevue-btn--solid`, `thevue-btn__icon`) are flat, predictable, and easy for consumers to override.

## The color/variant matrix via indirection variables

25 combinations (5 variants × 5 colors) would naively need 25 CSS blocks. Instead, each **color modifier** only sets five hook variables (`--thevue-btn-base/hover/active/soft/soft-hover`), and each **variant** consumes them:

```css
.thevue-btn--danger { --thevue-btn-base: var(--thevue-color-danger-600); /* … */ }
.thevue-btn--outline { color: var(--thevue-btn-base); border-color: var(--thevue-btn-base); }
```

5 + 5 blocks instead of 25, and a new color or variant is one block, not a row/column of the matrix. The hooks are also a consumer-facing API: override `--thevue-btn-base` on any wrapper to retint buttons locally.

## Polymorphic `as` prop

Buttons frequently need to be links (`<a>`, `RouterLink`, `NuxtLink`) while looking identical. A `component :is` root with attribute fallthrough gives that without wrapping or duplicating styles. Rules:

- `type` and `disabled` attributes are only applied when rendering a real `<button>` (invalid elsewhere).
- For non-button roots, disabled/loading is conveyed with `aria-disabled` and enforced by a capture-phase click guard (`preventDefault` + `stopImmediatePropagation`).

## Accessibility approach

- Native `<button>` by default — focusability, keyboard activation (Enter/Space), and form semantics come from the platform, not re-implemented JS.
- `loading` sets `aria-busy="true"` and disables the control natively (spinner replaces the left icon; the label remains visible for context).
- Focus ring via `:focus-visible` (keyboard-only) using the active color for contrast against any background.
- `BtnGroup` renders `role="group"` with an optional `aria-label`.

## Loading spinner via @thevue/icons registry

The spinner is an inline SVG registered once as `thevue:spinner` in the icons registry (idempotent, module-scope). This exercises the icons package as designed, keeps the spinner offline (no Iconify network fetch), and lets consumers replace it by re-registering the same name.

## No custom emits

`Btn` declares no `emits` — native events (`click`, `focus`, …) fall through to the root element via Vue attribute inheritance. This keeps the component transparent: anything valid on the rendered element works. A `BtnEmits` interface will be added only if a semantic, non-native event ever becomes necessary.

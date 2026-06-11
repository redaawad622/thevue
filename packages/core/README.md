# @thevue/core

> Design tokens, theme engine and Vue plugin — the foundation every thevue package builds on, and the only required dependency.

## Install

```bash
npm install @thevue/core
```

Requires Vue ≥ 3.3.

## Quick start (app-wide)

Register the plugin once — it provides the global theme context and injects every design token as a CSS custom property:

```ts
import { ThevuePlugin } from '@thevue/core'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(ThevuePlugin).mount('#app')
```

With options:

```ts
import { createTheme, darkTheme, ThevuePlugin } from '@thevue/core'

const brand = createTheme({
  name: 'brand',
  tokens: {
    colors: { primary: { 500: '#e11d48', 600: '#be123c' } },
    radius: { md: '0.5rem' },
  },
})

app.use(ThevuePlugin, {
  theme: brand, // initial theme (default: lightTheme)
  darkTheme, // theme used when dark mode is on (default: darkTheme)
  injectCss: true, // set false if you import '@thevue/core/style' yourself
})
```

## CSS-only usage

If you prefer a static stylesheet over runtime injection:

```ts
import '@thevue/core/style'
```

This ships light values on `:root`, dark overrides on `[data-theme="dark"]`, and automatic dark mode via `prefers-color-scheme` (opt out per page with `<html data-theme="light">`).

## Dark mode

Dark mode follows the OS preference out of the box. To control it manually:

```vue
<script setup lang="ts">
import { useTheme } from '@thevue/core'

const { isDark, setDark } = useTheme()
</script>

<template>
  <button @click="setDark(!isDark)">
    Toggle dark mode
  </button>
</template>
```

`setDark` swaps the active theme and reflects the choice on `<html data-theme="dark|light">`, which also drives the static stylesheet.

## Scoped theming with ThemeProvider

Apply a different theme to one subtree only — variables are injected as inline style, so they cascade to descendants without touching the rest of the page:

```vue
<script setup lang="ts">
import { createTheme, ThemeProvider } from '@thevue/core'

const promo = createTheme({ tokens: { colors: { primary: { 600: '#9333ea' } } } })
</script>

<template>
  <ThemeProvider :theme="promo">
    <PromoBanner /> <!-- sees the purple primary -->
  </ThemeProvider>
</template>
```

`useTheme()` inside the subtree returns the scoped context.

## createTheme

`createTheme(overrides)` deep-merges your overrides over a built-in theme and returns a new `Theme` object:

```ts
const theme = createTheme({
  name: 'midnight',
  base: 'dark', // extend darkTheme instead of lightTheme
  tokens: {
    semantic: { bg: { base: '#06061a' } },
    font: { family: { sans: 'Inter, sans-serif' } },
  },
})
```

## API

| Export | Kind | Description |
| --- | --- | --- |
| `ThevuePlugin` | plugin | App-wide theme context + CSS variable injection |
| `createTheme(overrides?)` | function | Build a custom theme from token overrides |
| `lightTheme` / `darkTheme` | const | Built-in themes |
| `useTheme()` | composable | `{ theme, isDark, setTheme, setDark }` |
| `ThemeProvider` | component | Scoped theme for a subtree (`theme`, `tag` props) |
| `themeToCssVars(theme)` | function | Flatten a theme to a `{ '--thevue-…': value }` map |
| `themeToCss(theme, selector?)` | function | Render a theme as a CSS rule string |
| `generateThemesCss(light?, dark?)` | function | Full stylesheet for a light/dark pair |
| `tokens`, `palettes`, `font`, `space`, `radius`, `shadow`, `z` | const | Raw token values |

All types (`Theme`, `ThemeTokens`, `ThemeOverrides`, `Palette`, …) are exported too.

## Token reference

Every CSS variable, its default and dark value: [docs/TOKENS.md](./docs/TOKENS.md).

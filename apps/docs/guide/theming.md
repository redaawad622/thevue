# Theming & Tokens

`thevue` is built from the ground up to be styled exclusively via **CSS Custom Properties** (CSS variables). It does not use any CSS utility frameworks like Tailwind CSS, which means stylesheet loading remains incredibly fast and styles are fully dynamic at runtime.

---

## Token Reference

Every design variable—colors, sizes, typography, spacing, border radii, shadows, and z-index—is declared under the `--thevue-*` namespace.

For a full reference table of all shipped custom properties, see the **[Tokens Reference](../components/tokens.md)**.

---

## Light vs. Dark Theme

The framework includes first-class light and dark modes. The core plugin injects light values on `:root` and dark-theme overrides on elements containing the `data-theme="dark"` attribute:

```css
/* Light mode (default) */
:root {
  --thevue-bg-base: #ffffff;
  --thevue-text-base: #0f172a;
}

/* Dark mode override */
[data-theme="dark"] {
  --thevue-bg-base: #020617;
  --thevue-text-base: #f8fafc;
}
```

---

## Controlling Themes via useTheme

`@thevue/core` (and the `@thevue/vue` aggregate bundle) exports a `useTheme()` composable to query and toggle themes programmatically.

```vue
<script setup lang="ts">
import { Btn, useTheme } from '@thevue/vue'

const { isDark, setDark } = useTheme()

function toggleTheme() {
  setDark(!isDark.value)
}
</script>

<template>
  <div class="app-container">
    <Btn variant="outline" color="neutral" @click="toggleTheme">
      {{ isDark ? '🌞 Light Mode' : '🌙 Dark Mode' }}
    </Btn>
  </div>
</template>
```

When `setDark(true)` is called, the hook automatically sets `document.documentElement.setAttribute('data-theme', 'dark')` and saves the preference to `localStorage`.

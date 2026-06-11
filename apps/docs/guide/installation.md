# Installation

`thevue` offers two main installation strategies to suit different project needs. You can choose to install the entire framework via the aggregate convenience bundle, or pull in individual packages à la carte.

---

## Option 1: Complete Bundle (Recommended)

If you plan to use multiple components and want a fast setup, install the aggregate bundle.

### 1. Install the package
Install the aggregate bundle package along with its peer dependencies:

```bash
npm install @thevue/vue vue
# or
pnpm add @thevue/vue vue
```

### 2. Register the plugin & stylesheet
Initialize the framework plugin globally inside your entry file (typically `main.ts` or `main.js`):

```typescript
import Thevue from '@thevue/vue'
import { createApp } from 'vue'
import App from './App.vue'
import '@thevue/vue/style' // Pulls in core tokens + all component styles

const app = createApp(App)
app.use(Thevue)
app.mount('#app')
```

Now, all components like `<Btn>` and `<DataTable>` are globally available in your Vue templates!

---

## Option 2: Individual Components (À La Carte)

For maximum tree-shaking efficiency and minimal bundle footprint, you can install only the specific component packages you need.

### 1. Install the Core + Component
Every standalone package requires `@thevue/core` for design tokens and theme configuration:

```bash
npm install @thevue/core @thevue/btn
# or
pnpm add @thevue/core @thevue/btn
```

### 2. Import Stylesheets
Import the core tokens stylesheet and the specific component's stylesheet in your app:

```typescript
import '@thevue/core/style'
import '@thevue/btn/style'
```

### 3. Consume in components
Import the components directly inside your Vue SFC scripts:

```vue
<script setup lang="ts">
import { Btn } from '@thevue/btn'
</script>

<template>
  <Btn color="primary">
    Click Me
  </Btn>
</template>
```

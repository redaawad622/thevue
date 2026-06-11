# @thevue/vue

> Convenience aggregate bundle for the thevue framework — install everything in one command and globally register all components with a single plugin.

## Install

```bash
npm install @thevue/vue
```

## Setup

To register all components globally and set up the default theme:

```ts
import Thevue from '@thevue/vue'
import { createApp } from 'vue'
import App from './App.vue'

// Import the consolidated stylesheet
import '@thevue/vue/style'

const app = createApp(App)

// Installs the theming context and registers components globally
app.use(Thevue)

app.mount('#app')
```

## Granular imports (Alternative)

Even when installing the full bundle, you can still import individual components and composables directly to keep your file imports clean and explicit:

```vue
<script setup lang="ts">
import { Btn, DataTable, useTheme } from '@thevue/vue'
</script>

<template>
  <Btn>Click me</Btn>
</template>
```

## Global components registered

Installing the plugin registers the following components globally:
- `Icon`
- `Btn`
- `BtnGroup`
- `DataTable`
- `TablePagination`

For complete component API details, refer to the individual package READMEs.

<script setup lang="ts">
import type { ThemeProviderProps } from '../types'
import { computed, provide, watch } from 'vue'
import { themeToCssVars } from '../theme/css'
import { lightTheme } from '../theme/themes'
import { createThemeContext, THEME_INJECTION_KEY } from '../theme/useTheme'

const props = defineProps<ThemeProviderProps>()

const context = createThemeContext(props.theme ?? lightTheme)

watch(() => props.theme, (theme) => {
  if (theme)
    context.setTheme(theme)
})

provide(THEME_INJECTION_KEY, context)

const style = computed(() => themeToCssVars(context.theme.value))
</script>

<template>
  <component :is="tag ?? 'div'" class="thevue-theme-provider" :style="style">
    <slot />
  </component>
</template>

<style>
.thevue-theme-provider {
  color: var(--thevue-text-base);
}
</style>

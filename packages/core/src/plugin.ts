import type { App } from 'vue'
import type { ThevueOptions } from './types'
import { generateThemesCss } from './theme/css'
import { darkTheme, lightTheme } from './theme/themes'
import { createThemeContext, THEME_INJECTION_KEY } from './theme/useTheme'

const STYLE_TAG_ID = 'thevue-tokens'

/**
 * App-level plugin: provides the global theme context and injects the token
 * CSS variables (light on :root, dark via data-theme / prefers-color-scheme).
 */
export const ThevuePlugin = {
  install(app: App, options: ThevueOptions = {}): void {
    const initial = options.theme ?? lightTheme
    const dark = options.darkTheme ?? (initial.dark ? initial : darkTheme)
    const light = initial.dark ? lightTheme : initial

    const context = createThemeContext(initial, { light, dark, updateDocument: true })
    app.provide(THEME_INJECTION_KEY, context)

    if (options.injectCss !== false && typeof document !== 'undefined' && !document.getElementById(STYLE_TAG_ID)) {
      const styleTag = document.createElement('style')
      styleTag.id = STYLE_TAG_ID
      styleTag.textContent = generateThemesCss(light, dark)
      document.head.appendChild(styleTag)
    }
  },
}

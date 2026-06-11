import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'
import type { Theme } from '../types'
import { computed, inject, shallowRef } from 'vue'
import { darkTheme, lightTheme } from './themes'

export interface ThemeContext {
  /** The currently active theme */
  theme: ComputedRef<Theme>
  /** Whether the active theme is a dark theme */
  isDark: ComputedRef<boolean>
  /** Replace the active theme */
  setTheme: (theme: Theme) => void
  /** Switch between the configured light and dark themes */
  setDark: (dark: boolean) => void
}

export const THEME_INJECTION_KEY: InjectionKey<ThemeContext> = Symbol('thevue:theme')

export interface ThemeContextOptions {
  /** Theme used when `setDark(false)` is called @default lightTheme */
  light?: Theme
  /** Theme used when `setDark(true)` is called @default darkTheme */
  dark?: Theme
  /**
   * Reflect dark-mode changes on `<html data-theme>`. Enable only for
   * app-level contexts (the plugin), not scoped providers.
   * @default false
   */
  updateDocument?: boolean
}

export function createThemeContext(initial: Theme = lightTheme, options: ThemeContextOptions = {}): ThemeContext {
  const light = options.light ?? lightTheme
  const dark = options.dark ?? darkTheme
  const current: ShallowRef<Theme> = shallowRef(initial)

  function reflectOnDocument(theme: Theme): void {
    if (options.updateDocument && typeof document !== 'undefined')
      document.documentElement.setAttribute('data-theme', theme.dark ? 'dark' : 'light')
  }

  function setTheme(theme: Theme): void {
    current.value = theme
    reflectOnDocument(theme)
  }

  function setDark(value: boolean): void {
    setTheme(value ? dark : light)
  }

  return {
    theme: computed(() => current.value),
    isDark: computed(() => current.value.dark),
    setTheme,
    setDark,
  }
}

let fallbackContext: ThemeContext | undefined

/**
 * Returns the nearest theme context — from a ThemeProvider ancestor or the
 * ThevuePlugin — falling back to a global light-theme context.
 */
export function useTheme(): ThemeContext {
  const injected = inject(THEME_INJECTION_KEY, null)
  if (injected)
    return injected
  fallbackContext ??= createThemeContext()
  return fallbackContext
}

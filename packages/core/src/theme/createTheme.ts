import type { Theme, ThemeOverrides, ThemeTokens } from '../types'
import { deepMerge } from '../utils/merge'
import { darkTheme, lightTheme } from './themes'

/**
 * Creates a new theme by deep-merging token overrides over one of the
 * built-in themes. Neither built-in theme is mutated.
 */
export function createTheme(overrides: ThemeOverrides = {}): Theme {
  const base = overrides.base === 'dark' ? darkTheme : lightTheme
  return {
    name: overrides.name ?? base.name,
    dark: overrides.dark ?? base.dark,
    tokens: deepMerge(base.tokens as unknown as Record<string, unknown>, overrides.tokens as Record<string, unknown> | undefined) as unknown as ThemeTokens,
  }
}

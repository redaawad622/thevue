export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'

export type PaletteName = 'primary' | 'neutral' | 'success' | 'warning' | 'danger'

export type Palette = Record<ColorShade, string>

export interface SemanticTokens {
  bg: { base: string, subtle: string, muted: string }
  text: { base: string, subtle: string, muted: string, inverted: string }
  border: { base: string, subtle: string, strong: string }
  interactive: { default: string, hover: string, active: string, disabled: string }
}

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export interface FontTokens {
  family: { sans: string, mono: string }
  size: Record<FontSize, string>
  weight: { normal: number, medium: number, semibold: number, bold: number }
  lineHeight: { tight: number, normal: number, relaxed: number }
}

export type SpaceKey = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24

export type RadiusKey = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type ShadowKey = 'sm' | 'md' | 'lg' | 'xl'

export type ZIndexKey = 'dropdown' | 'sticky' | 'overlay' | 'modal' | 'toast' | 'tooltip'

export interface ThemeTokens {
  colors: Record<PaletteName, Palette>
  semantic: SemanticTokens
  font: FontTokens
  space: Record<SpaceKey, string>
  radius: Record<RadiusKey, string>
  shadow: Record<ShadowKey, string>
  z: Record<ZIndexKey, number>
}

export interface Theme {
  name: string
  dark: boolean
  tokens: ThemeTokens
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface ThemeOverrides {
  /** Display name of the resulting theme */
  name?: string
  /** Which built-in theme to extend @default 'light' */
  base?: 'light' | 'dark'
  /** Whether the resulting theme is a dark theme (inherited from `base` if omitted) */
  dark?: boolean
  /** Token overrides, deep-merged over the base theme's tokens */
  tokens?: DeepPartial<ThemeTokens>
}

export interface ThemeProviderProps {
  /** Theme applied to this subtree @default lightTheme */
  theme?: Theme
  /** Element rendered as the provider root @default 'div' */
  tag?: string
}

export interface ThevueOptions {
  /** Initial theme @default lightTheme */
  theme?: Theme
  /** Theme used when dark mode is enabled @default darkTheme */
  darkTheme?: Theme
  /** Inject a <style> tag with the token CSS variables @default true */
  injectCss?: boolean
}

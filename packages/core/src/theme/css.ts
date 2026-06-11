import type { Theme } from '../types'
import { darkTheme, lightTheme } from './themes'

/** Flattens a theme into a map of CSS custom property name → value. */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {}
  const { colors, semantic, font, space, radius, shadow, z } = theme.tokens

  for (const [palette, shades] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(shades))
      vars[`--thevue-color-${palette}-${shade}`] = value
  }

  for (const [group, roles] of Object.entries(semantic)) {
    for (const [role, value] of Object.entries(roles))
      vars[`--thevue-${group}-${role}`] = value as string
  }

  vars['--thevue-font-sans'] = font.family.sans
  vars['--thevue-font-mono'] = font.family.mono
  for (const [key, value] of Object.entries(font.size))
    vars[`--thevue-font-size-${key}`] = value
  for (const [key, value] of Object.entries(font.weight))
    vars[`--thevue-font-weight-${key}`] = String(value)
  for (const [key, value] of Object.entries(font.lineHeight))
    vars[`--thevue-leading-${key}`] = String(value)

  for (const [key, value] of Object.entries(space))
    vars[`--thevue-space-${key}`] = value
  for (const [key, value] of Object.entries(radius))
    vars[`--thevue-radius-${key}`] = value
  for (const [key, value] of Object.entries(shadow))
    vars[`--thevue-shadow-${key}`] = value
  for (const [key, value] of Object.entries(z))
    vars[`--thevue-z-${key}`] = String(value)

  return vars
}

/** Renders a theme as a CSS rule for the given selector. */
export function themeToCss(theme: Theme, selector = ':root'): string {
  const body = Object.entries(themeToCssVars(theme))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')
  return `${selector} {\n${body}\n}\n`
}

/**
 * Generates the full stylesheet for a light/dark theme pair:
 * light variables on `:root`, dark overrides on `[data-theme="dark"]`,
 * and automatic dark mode via `prefers-color-scheme` unless the user
 * explicitly opted out with `data-theme="light"`.
 */
export function generateThemesCss(light: Theme = lightTheme, dark: Theme = darkTheme): string {
  return [
    themeToCss(light, ':root'),
    themeToCss(dark, '[data-theme="dark"]'),
    `@media (prefers-color-scheme: dark) {\n${themeToCss(dark, ':root:not([data-theme="light"])')}}\n`,
  ].join('\n')
}

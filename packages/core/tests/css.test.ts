import { describe, expect, it } from 'vitest'
import { generateThemesCss, lightTheme, themeToCss, themeToCssVars } from '../src/index'

describe('themeToCssVars', () => {
  const vars = themeToCssVars(lightTheme)

  it('flattens palette colors with the --thevue-color prefix', () => {
    expect(vars['--thevue-color-primary-500']).toBe(lightTheme.tokens.colors.primary[500])
    expect(vars['--thevue-color-danger-950']).toBe(lightTheme.tokens.colors.danger[950])
  })

  it('flattens semantic roles, typography, spacing and misc scales', () => {
    expect(vars['--thevue-bg-base']).toBe(lightTheme.tokens.semantic.bg.base)
    expect(vars['--thevue-interactive-hover']).toBe(lightTheme.tokens.semantic.interactive.hover)
    expect(vars['--thevue-font-sans']).toBe(lightTheme.tokens.font.family.sans)
    expect(vars['--thevue-font-size-md']).toBe(lightTheme.tokens.font.size.md)
    expect(vars['--thevue-font-weight-bold']).toBe(String(lightTheme.tokens.font.weight.bold))
    expect(vars['--thevue-leading-normal']).toBe(String(lightTheme.tokens.font.lineHeight.normal))
    expect(vars['--thevue-space-4']).toBe(lightTheme.tokens.space[4])
    expect(vars['--thevue-radius-md']).toBe(lightTheme.tokens.radius.md)
    expect(vars['--thevue-shadow-lg']).toBe(lightTheme.tokens.shadow.lg)
    expect(vars['--thevue-z-modal']).toBe(String(lightTheme.tokens.z.modal))
  })
})

describe('themeToCss', () => {
  it('wraps the variables in the given selector', () => {
    const css = themeToCss(lightTheme, ':root')
    expect(css).toContain(':root {')
    expect(css).toContain('--thevue-color-primary-500:')
  })
})

describe('generateThemesCss', () => {
  const css = generateThemesCss()

  it('emits light vars on :root and dark overrides on [data-theme]', () => {
    expect(css).toContain(':root {')
    expect(css).toContain('[data-theme="dark"]')
  })

  it('respects prefers-color-scheme unless explicitly overridden', () => {
    expect(css).toContain('@media (prefers-color-scheme: dark)')
    expect(css).toContain(':root:not([data-theme="light"])')
  })
})

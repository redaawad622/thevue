import { describe, expect, it } from 'vitest'
import { createTheme, darkTheme, lightTheme } from '../src/index'

describe('brand identity tokens', () => {
  it('primary accent is the thevue violet/iris', () => {
    expect(lightTheme.tokens.colors.primary[600]).toBe('#7c3aed')
    expect(lightTheme.tokens.colors.primary[500]).toBe('#8b5cf6')
  })

  it('uses the crisp-modern radius scale', () => {
    expect(lightTheme.tokens.radius.md).toBe('0.5rem')
    expect(lightTheme.tokens.radius.lg).toBe('0.75rem')
  })
})

describe('built-in themes', () => {
  it('light theme is not dark, dark theme is', () => {
    expect(lightTheme.dark).toBe(false)
    expect(darkTheme.dark).toBe(true)
  })

  it('themes share palettes but differ in semantic colors', () => {
    expect(lightTheme.tokens.colors.primary).toEqual(darkTheme.tokens.colors.primary)
    expect(lightTheme.tokens.semantic.bg.base).not.toBe(darkTheme.tokens.semantic.bg.base)
  })
})

describe('createTheme', () => {
  it('defaults to the light theme', () => {
    const theme = createTheme()
    expect(theme.tokens).toEqual(lightTheme.tokens)
  })

  it('deep-merges token overrides without mutating the base', () => {
    const theme = createTheme({
      name: 'brand',
      tokens: {
        colors: { primary: { 500: '#ff0000' } },
      },
    })
    expect(theme.name).toBe('brand')
    expect(theme.tokens.colors.primary[500]).toBe('#ff0000')
    // untouched values inherited from light theme
    expect(theme.tokens.colors.primary[600]).toBe(lightTheme.tokens.colors.primary[600])
    // base remains unchanged
    expect(lightTheme.tokens.colors.primary[500]).not.toBe('#ff0000')
  })

  it('can extend the dark theme', () => {
    const theme = createTheme({ base: 'dark', tokens: { semantic: { bg: { base: '#000000' } } } })
    expect(theme.dark).toBe(true)
    expect(theme.tokens.semantic.bg.base).toBe('#000000')
    expect(theme.tokens.semantic.text.base).toBe(darkTheme.tokens.semantic.text.base)
  })
})

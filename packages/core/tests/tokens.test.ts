import { describe, expect, it } from 'vitest'
import { palettes, tokens } from '../src/index'

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const
const PALETTE_NAMES = ['primary', 'neutral', 'success', 'warning', 'danger'] as const

describe('color palettes', () => {
  it('defines all five palettes', () => {
    for (const name of PALETTE_NAMES)
      expect(palettes[name]).toBeDefined()
  })

  it('every palette has all 11 shades as valid hex colors', () => {
    for (const name of PALETTE_NAMES) {
      for (const shade of SHADES)
        expect(palettes[name][shade]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})

describe('token scales', () => {
  it('exposes the 4px-based spacing scale', () => {
    expect(tokens.space[1]).toBe('0.25rem')
    expect(tokens.space[4]).toBe('1rem')
    expect(tokens.space[24]).toBe('6rem')
  })

  it('exposes font sizes from xs to 4xl', () => {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const)
      expect(tokens.font.size[size]).toMatch(/rem$/)
  })

  it('exposes radius, shadow and z-index scales', () => {
    expect(tokens.radius.full).toBe('9999px')
    expect(tokens.shadow.md).toContain('rgb')
    expect(tokens.z.modal).toBeGreaterThan(tokens.z.overlay)
    expect(tokens.z.tooltip).toBeGreaterThan(tokens.z.toast)
  })
})

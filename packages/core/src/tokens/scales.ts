import type { FontTokens, RadiusKey, ShadowKey, SpaceKey, ZIndexKey } from '../types'

export const font: FontTokens = {
  family: {
    sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  size: {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'md': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}

/** 4px-based spacing scale */
export const space: Record<SpaceKey, string> = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
}

export const radius: Record<RadiusKey, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
}

/** Soft, layered elevation with a faint cool (slate) tint — the crisp-modern signature. */
export const shadow: Record<ShadowKey, string> = {
  sm: '0 1px 2px 0 rgb(15 23 42 / 0.06)',
  md: '0 4px 8px -2px rgb(15 23 42 / 0.10), 0 2px 4px -2px rgb(15 23 42 / 0.06)',
  lg: '0 12px 20px -4px rgb(15 23 42 / 0.12), 0 4px 8px -4px rgb(15 23 42 / 0.08)',
  xl: '0 24px 32px -8px rgb(15 23 42 / 0.14), 0 8px 12px -6px rgb(15 23 42 / 0.10)',
}

export const z: Record<ZIndexKey, number> = {
  dropdown: 1000,
  sticky: 1020,
  overlay: 1030,
  modal: 1040,
  toast: 1050,
  tooltip: 1060,
}

import type { SemanticTokens, Theme } from '../types'
import { palettes } from '../tokens/palettes'
import { font, radius, shadow, space, z } from '../tokens/scales'

const lightSemantic: SemanticTokens = {
  bg: {
    base: '#ffffff',
    subtle: palettes.neutral[50],
    muted: palettes.neutral[100],
  },
  text: {
    base: palettes.neutral[900],
    subtle: palettes.neutral[600],
    muted: palettes.neutral[400],
    inverted: '#ffffff',
  },
  border: {
    base: palettes.neutral[200],
    subtle: palettes.neutral[100],
    strong: palettes.neutral[300],
  },
  interactive: {
    default: palettes.primary[600],
    hover: palettes.primary[700],
    active: palettes.primary[800],
    disabled: palettes.neutral[300],
  },
}

const darkSemantic: SemanticTokens = {
  bg: {
    base: palettes.neutral[950],
    subtle: palettes.neutral[900],
    muted: palettes.neutral[800],
  },
  text: {
    base: palettes.neutral[50],
    subtle: palettes.neutral[400],
    muted: palettes.neutral[500],
    inverted: palettes.neutral[950],
  },
  border: {
    base: palettes.neutral[800],
    subtle: palettes.neutral[900],
    strong: palettes.neutral[700],
  },
  interactive: {
    default: palettes.primary[500],
    hover: palettes.primary[400],
    active: palettes.primary[300],
    disabled: palettes.neutral[700],
  },
}

export const lightTheme: Theme = {
  name: 'light',
  dark: false,
  tokens: { colors: palettes, semantic: lightSemantic, font, space, radius, shadow, z },
}

export const darkTheme: Theme = {
  name: 'dark',
  dark: true,
  tokens: { colors: palettes, semantic: darkSemantic, font, space, radius, shadow, z },
}

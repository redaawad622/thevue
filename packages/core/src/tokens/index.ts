import type { ThemeTokens } from '../types'
import { lightTheme } from '../theme/themes'
import { palettes } from './palettes'
import { font, radius, shadow, space, z } from './scales'

export { palettes }
export { font, radius, shadow, space, z }

/** The default (light) token set. */
export const tokens: ThemeTokens = lightTheme.tokens

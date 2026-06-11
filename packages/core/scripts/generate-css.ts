/**
 * Generates src/styles/tokens.css from the TypeScript token definitions.
 * Runs automatically before every build (see the package "build" script).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateThemesCss } from '../src/theme/css'

const outFile = resolve(dirname(fileURLToPath(import.meta.url)), '../src/styles/tokens.css')

const header = `/**
 * GENERATED FILE — DO NOT EDIT.
 * Source of truth: packages/core/src/tokens + src/theme/themes.ts
 * Regenerate with: pnpm --filter @thevue/core build
 */

`

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, header + generateThemesCss(), 'utf8')

console.log(`generated ${outFile}`)

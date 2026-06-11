/**
 * Scaffolds a new @thevue package with the standard structure.
 *
 * Usage:
 *   pnpm create-package --name modal --display-name "Modal"
 *   pnpm create-package --name dashboard --display-name "Dashboard" --layer block --deps btn,table
 *
 * Layers (see docs/ARCHITECTURE.md):
 *   component (default) — atomic component; may depend only on core/icons
 *   block               — full section/page (landing, dashboard, …); may also
 *                         depend on component packages via --deps
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    'name': { type: 'string' },
    'display-name': { type: 'string' },
    'layer': { type: 'string', default: 'component' },
    'deps': { type: 'string', default: '' },
  },
})

const name = values.name
const displayName = values['display-name']
const layer = values.layer as 'component' | 'block'
const extraDeps = values.deps ? values.deps.split(',').map(d => d.trim()).filter(Boolean) : []

function fail(message: string): never {
  console.error(`✖ ${message}`)
  process.exit(1)
}

if (!name || !/^[a-z][a-z0-9-]*$/.test(name))
  fail('--name is required and must be kebab-case (e.g. --name date-picker)')
if (!displayName)
  fail('--display-name is required (e.g. --display-name "DatePicker")')
if (layer !== 'component' && layer !== 'block')
  fail('--layer must be "component" or "block"')
if (layer === 'component' && extraDeps.length > 0)
  fail('--deps is only allowed for --layer block (atomic components must not depend on each other)')

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const packageDir = resolve(repoRoot, 'packages', name)

if (existsSync(packageDir))
  fail(`packages/${name} already exists`)

const peerDependencies: Record<string, string> = {
  '@thevue/core': 'workspace:*',
  'vue': '>=3.3.0',
}
for (const dep of extraDeps)
  peerDependencies[`@thevue/${dep}`] = 'workspace:*'

const packageJson = {
  name: `@thevue/${name}`,
  type: 'module',
  version: '0.0.1',
  description: `${displayName} ${layer} for the thevue framework`,
  license: 'MIT',
  homepage: `https://github.com/redaawad622/thevue/tree/main/packages/${name}#readme`,
  repository: {
    type: 'git',
    url: 'git+https://github.com/redaawad622/thevue.git',
    directory: `packages/${name}`,
  },
  keywords: ['vue', 'thevue', name],
  sideEffects: ['**/*.css'],
  exports: {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.mjs',
    },
    './style': './dist/style.css',
  },
  module: './dist/index.mjs',
  types: './dist/index.d.ts',
  files: ['dist'],
  scripts: {
    build: 'vite build',
    dev: 'vite build --watch',
    test: 'vitest run',
  },
  peerDependencies,
}

const tsconfig = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "paths": {}
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
`

const viteConfig = `import { createLibConfig } from '../../scripts/vite-lib'

export default createLibConfig({ packageUrl: import.meta.url })
`

const componentVue = `<script setup lang="ts">
import type { ${displayName}Props } from '../types'

withDefaults(defineProps<${displayName}Props>(), {})
</script>

<template>
  <div class="thevue-${name}">
    <slot />
  </div>
</template>

<style>
.thevue-${name} {
  color: var(--thevue-text-base);
}
</style>
`

const typesTs = `export interface ${displayName}Props {
}
`

const indexTs = `export { default as ${displayName} } from './components/${displayName}.vue'
export type * from './types'
`

const testTs = `import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { ${displayName} } from '../src/index'

describe('${displayName.charAt(0).toLowerCase() + displayName.slice(1)}', () => {
  it('renders its slot content', () => {
    const screen = render(${displayName}, {
      slots: { default: () => 'hello' },
    })
    expect(screen.container.querySelector('.thevue-${name}')).not.toBeNull()
    expect(screen.container.textContent).toContain('hello')
  })
})
`

const readme = `# @thevue/${name}

> ${displayName} ${layer} for the thevue framework.

## Install

\`\`\`bash
npm install @thevue/core @thevue/${name}
\`\`\`

\`\`\`ts
import '@thevue/${name}/style'
\`\`\`

## Usage

\`\`\`vue
<script setup lang="ts">
import { ${displayName} } from '@thevue/${name}'
</script>

<template>
  <${displayName}>content</${displayName}>
</template>
\`\`\`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
`

const changelog = `# @thevue/${name}

<!-- Managed by changesets. Do not edit manually. -->
`

mkdirSync(resolve(packageDir, 'src/components'), { recursive: true })
mkdirSync(resolve(packageDir, 'tests'), { recursive: true })

writeFileSync(resolve(packageDir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
writeFileSync(resolve(packageDir, 'tsconfig.json'), tsconfig)
writeFileSync(resolve(packageDir, 'vite.config.ts'), viteConfig)
writeFileSync(resolve(packageDir, `src/components/${displayName}.vue`), componentVue)
writeFileSync(resolve(packageDir, 'src/types.ts'), typesTs)
writeFileSync(resolve(packageDir, 'src/index.ts'), indexTs)
writeFileSync(resolve(packageDir, `tests/${name}.test.ts`), testTs)
writeFileSync(resolve(packageDir, 'README.md'), readme)
writeFileSync(resolve(packageDir, 'CHANGELOG.md'), changelog)

console.log(`✔ created packages/${name} (@thevue/${name}, layer: ${layer})`)
console.log('Next steps:')
console.log('  1. pnpm install                      # link the new workspace package')
console.log(`  2. pnpm --filter @thevue/${name} build`)
console.log(`  3. pnpm --filter @thevue/${name} test`)
console.log('  4. add the package to the root README table and @thevue/vue re-exports')

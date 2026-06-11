import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../..')
const destDir = path.resolve(rootDir, 'apps/docs/components')

const filesToCopy = [
  {
    src: 'packages/core/README.md',
    dest: 'core.md',
    rewrites: [
      { pattern: /\.\/docs\/TOKENS\.md/g, replacement: './tokens.md' },
    ],
  },
  {
    src: 'packages/core/docs/TOKENS.md',
    dest: 'tokens.md',
  },
  {
    src: 'packages/icons/README.md',
    dest: 'icons.md',
  },
  {
    src: 'packages/btn/README.md',
    dest: 'btn.md',
  },
  {
    src: 'packages/table/README.md',
    dest: 'table.md',
    rewrites: [
      { pattern: /\.\/docs\/COLUMN-API\.md/g, replacement: './column-api.md' },
    ],
  },
  {
    src: 'packages/table/docs/COLUMN-API.md',
    dest: 'column-api.md',
  },
  {
    src: 'packages/vue/README.md',
    dest: 'vue.md',
  },
]

function copyFiles() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  for (const { src, dest, rewrites } of filesToCopy) {
    const srcPath = path.join(rootDir, src)
    const destPath = path.join(destDir, dest)

    if (!fs.existsSync(srcPath)) {
      console.warn(`Source file not found: ${srcPath}`)
      continue
    }

    let content = fs.readFileSync(srcPath, 'utf8')

    if (rewrites) {
      for (const { pattern, replacement } of rewrites) {
        content = content.replace(pattern, replacement)
      }
    }

    // Ensure title frontmatter or structure is present if needed,
    // otherwise just write the markdown directly.
    fs.writeFileSync(destPath, content, 'utf8')
    console.log(`Copied: ${src} -> apps/docs/components/${dest}`)
  }
}

copyFiles()

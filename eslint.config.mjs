import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.turbo/**',
    '**/coverage/**',
    'apps/docs/.vitepress/cache/**',
    // verbatim copy of the original project spec — contains illustrative pseudocode
    'docs/SPEC.md',
  ],
})

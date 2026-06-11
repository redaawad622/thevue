import type { ViteUserConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import dts from 'vite-plugin-dts'
import { defineConfig, mergeConfig } from 'vitest/config'

export interface LibConfigOptions {
  /** Pass `import.meta.url` from the package's vite.config.ts */
  packageUrl: string
  /** Extra config merged on top of the preset */
  overrides?: ViteUserConfig
  /** Additional external module patterns beyond the defaults */
  external?: (string | RegExp)[]
}

/**
 * Shared Vite library-mode preset for all @thevue packages.
 * ESM-only output (dist/index.mjs + dist/index.d.ts + dist/style.css)
 * and Vitest browser-mode tests in headless Chromium.
 */
export function createLibConfig(options: LibConfigOptions): ViteUserConfig {
  const base = defineConfig({
    plugins: [
      vue(),
      dts({
        tsconfigPath: './tsconfig.json',
        cleanVueFileName: true,
      }),
    ],
    build: {
      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', options.packageUrl)),
        formats: ['es'],
        fileName: () => 'index.mjs',
        cssFileName: 'style',
      },
      cssCodeSplit: false,
      sourcemap: true,
      rollupOptions: {
        external: [
          /^vue$/,
          /^@vue\//,
          /^@thevue\//,
          /^@iconify\//,
          /^@tanstack\//,
          ...(options.external ?? []),
        ],
      },
    },
    test: {
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
        screenshotFailures: false,
      },
    },
  })

  return options.overrides ? mergeConfig(base, options.overrides) : base
}

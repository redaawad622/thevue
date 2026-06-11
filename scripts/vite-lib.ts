import type { UserConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

export interface LibConfigOptions {
  /** Pass `import.meta.url` from the package's vite.config.ts */
  packageUrl: string
  /** Extra config merged on top of the preset (e.g. `test`) */
  overrides?: UserConfig
  /** Additional external module patterns beyond the defaults */
  external?: (string | RegExp)[]
}

/**
 * Shared Vite library-mode preset for all @thevue packages.
 * ESM-only output: dist/index.mjs + dist/index.d.ts + dist/style.css
 */
export function createLibConfig(options: LibConfigOptions): UserConfig {
  const base = defineConfig({
    plugins: [
      vue(),
      dts({
        entryRoot: 'src',
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
  })

  return options.overrides ? mergeConfig(base, options.overrides) : base
}

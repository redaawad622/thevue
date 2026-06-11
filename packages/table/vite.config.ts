import { createLibConfig } from '../../scripts/vite-lib'

export default createLibConfig({
  packageUrl: import.meta.url,
  overrides: {
    // pre-bundle the table engine so the browser optimizer doesn't reload mid-run
    optimizeDeps: { include: ['@tanstack/vue-table'] },
  },
})

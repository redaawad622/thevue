import type { Plugin } from 'vue'
import { Btn, BtnGroup } from '@thevue/btn'
import { ThevuePlugin } from '@thevue/core'
import { Icon } from '@thevue/icons'
import { DataTable, TablePagination } from '@thevue/table'

export const Thevue: Plugin = {
  install(app, options) {
    app.use(ThevuePlugin, options)

    app.component('Icon', Icon)
    app.component('Btn', Btn)
    app.component('BtnGroup', BtnGroup)
    app.component('DataTable', DataTable)
    app.component('TablePagination', TablePagination)
  },
}

export default Thevue

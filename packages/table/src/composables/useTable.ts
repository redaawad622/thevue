import type { ColumnOptions } from '../types'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { computed, ref, toValue, watch } from 'vue'
import { buildColumnDefs } from '../columns'

export interface UseThevueTableOptions<T> {
  data: () => T[]
  columns: () => ColumnOptions<T>[]
  selectable?: () => boolean
  paginate?: () => boolean
  pageSize?: () => number
  /** Called with the currently selected row objects whenever selection changes. */
  onSelectionChange?: (rows: T[]) => void
}

/**
 * Wraps TanStack's `useVueTable` with thevue's column mapping and reactive
 * sorting / pagination / row-selection state.
 */
export function useThevueTable<T>(options: UseThevueTableOptions<T>) {
  const sorting = ref<{ id: string, desc: boolean }[]>([])
  const rowSelection = ref<Record<string, boolean>>({})
  const pagination = ref({ pageIndex: 0, pageSize: toValue(options.pageSize?.()) ?? 10 })

  const columnDefs = computed(() =>
    buildColumnDefs(options.columns(), { selectable: options.selectable?.() }),
  )

  const table = useVueTable({
    get data() {
      return options.data()
    },
    get columns() {
      return columnDefs.value
    },
    state: {
      get sorting() {
        return sorting.value
      },
      get rowSelection() {
        return rowSelection.value
      },
      get pagination() {
        return pagination.value
      },
    },
    enableRowSelection: () => options.selectable?.() ?? false,
    onSortingChange: (updater) => {
      sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
    onPaginationChange: (updater) => {
      pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: options.paginate?.() ? getPaginationRowModel() : undefined,
  })

  // keep pageSize in sync if the prop changes
  watch(
    () => options.pageSize?.(),
    (size) => {
      if (size != null && size !== pagination.value.pageSize) {
        pagination.value = { ...pagination.value, pageSize: size }
      }
    },
  )

  // notify consumers of selection changes with the actual row objects
  watch(
    rowSelection,
    () => {
      const rows = table.getSelectedRowModel().rows.map(r => r.original)
      options.onSelectionChange?.(rows)
    },
    { deep: true },
  )

  return { table, sorting, rowSelection, pagination }
}

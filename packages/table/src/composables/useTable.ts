import type { ExpandedState } from '@tanstack/vue-table'
import type { ColumnOptions } from '../types'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
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
  resizable?: () => boolean
  expandable?: () => boolean
  /** Called with the currently selected row objects whenever selection changes. */
  onSelectionChange?: (rows: T[]) => void
}

/**
 * Wraps TanStack's `useVueTable` with thevue's column mapping and reactive
 * sorting / pagination / row-selection state.
 */
export function useThevueTable<T>(options: UseThevueTableOptions<T>) {
  const sorting = ref<{ id: string, desc: boolean }[]>([])
  const columnFilters = ref<{ id: string, value: unknown }[]>([])
  const columnVisibility = ref<Record<string, boolean>>({})
  const rowSelection = ref<Record<string, boolean>>({})
  const expanded = ref<ExpandedState>({})
  const pagination = ref({ pageIndex: 0, pageSize: toValue(options.pageSize?.()) ?? 10 })

  const columnDefs = computed(() =>
    buildColumnDefs(options.columns(), {
      selectable: options.selectable?.(),
      expandable: options.expandable?.(),
    }),
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
      get columnFilters() {
        return columnFilters.value
      },
      get columnVisibility() {
        return columnVisibility.value
      },
      get rowSelection() {
        return rowSelection.value
      },
      get expanded() {
        return expanded.value
      },
      get pagination() {
        return pagination.value
      },
    },
    enableRowSelection: () => options.selectable?.() ?? false,
    enableColumnResizing: options.resizable?.() ?? false,
    columnResizeMode: 'onChange',
    onSortingChange: (updater) => {
      sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    },
    onColumnFiltersChange: (updater) => {
      columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
    onExpandedChange: (updater) => {
      expanded.value = typeof updater === 'function' ? updater(expanded.value) : updater
    },
    onPaginationChange: (updater) => {
      pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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

  return { table, sorting, columnFilters, columnVisibility, rowSelection, expanded, pagination }
}

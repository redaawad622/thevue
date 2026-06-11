import type { ColumnDef } from '@tanstack/vue-table'
import type { ColumnOptions } from './types'

/**
 * Identity helper that preserves the row type `T` for full inference in
 * `accessor`/`cell` callbacks. Pass its result to `DataTable`'s `columns` prop.
 *
 * ```ts
 * const columns = defineColumns<User>([
 *   { key: 'name', header: 'Name', sortable: true },
 *   { key: 'age', header: 'Age', cell: ({ value }) => `${value} yrs` },
 * ])
 * ```
 */
export function defineColumns<T>(columns: ColumnOptions<T>[]): ColumnOptions<T>[] {
  return columns
}

/** Internal id used for the leading selection (checkbox) column. */
export const SELECTION_COLUMN_ID = '__thevue_select__'
/** Internal id used for the leading expander column. */
export const EXPANDER_COLUMN_ID = '__thevue_expand__'

/**
 * Map thevue `ColumnOptions` onto TanStack `ColumnDef`s, prepending a
 * selection column when `selectable` is requested and/or an expander column
 * when `expandable` is requested.
 */
export function buildColumnDefs<T>(
  columns: ColumnOptions<T>[],
  options: { selectable?: boolean, expandable?: boolean } = {},
): ColumnDef<T>[] {
  const defs: ColumnDef<T>[] = columns.map(col => ({
    id: col.key,
    header: col.header ?? col.key,
    accessorFn: col.accessor ?? ((row: T) => (row as Record<string, unknown>)[col.key]),
    enableSorting: col.sortable ?? false,
    enableColumnFilter: col.filterable ?? false,
    meta: {
      cell: col.cell,
      width: col.width,
      align: col.align ?? 'left',
      filterable: col.filterable ?? false,
    },
  }))

  if (options.expandable) {
    defs.unshift({
      id: EXPANDER_COLUMN_ID,
      header: '',
      enableSorting: false,
      enableResizing: false,
      meta: { width: '2.5rem', align: 'center' },
    })
  }

  if (options.selectable) {
    defs.unshift({
      id: SELECTION_COLUMN_ID,
      header: '',
      enableSorting: false,
      enableResizing: false,
      meta: { width: '2.5rem', align: 'center' },
    })
  }

  return defs
}

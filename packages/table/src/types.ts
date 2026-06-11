import type { VNodeChild } from 'vue'

/** Context handed to a custom cell renderer. */
export interface CellContext<T> {
  /** The full row data object. */
  row: T
  /** The raw value for this column (via `accessor` or `row[key]`). */
  value: unknown
  /** Zero-based index of the row within the current page. */
  index: number
}

/** Declarative definition of a single table column. */
export interface ColumnOptions<T> {
  /** Unique column id; also the default data key when `accessor` is omitted. */
  key: string
  /** Header label. Defaults to `key` when omitted. */
  header?: string
  /** Allow click-to-sort on this column. */
  sortable?: boolean
  /** Derive the cell value from the row (defaults to `row[key]`). */
  accessor?: (row: T) => unknown
  /** Render arbitrary content for the cell instead of the raw value. */
  cell?: (ctx: CellContext<T>) => VNodeChild
  /** Fixed column width (any CSS length, e.g. `'120px'`). */
  width?: string
  /** Text alignment within the column. */
  align?: 'left' | 'center' | 'right'
}

/** Visual row density. */
export type TableDensity = 'default' | 'comfortable' | 'compact'

export interface DataTableProps<T = Record<string, unknown>> {
  /** Row data. */
  data: T[]
  /** Column definitions (use `defineColumns` for inference). */
  columns: ColumnOptions<T>[]
  /** Show skeleton placeholder rows instead of data. */
  loading?: boolean
  /** Number of skeleton rows to show while `loading`. */
  skeletonRows?: number
  /** Enable client-side pagination. */
  paginate?: boolean
  /** Rows per page when `paginate` is enabled. */
  pageSize?: number
  /** Render a leading checkbox column for row selection. */
  selectable?: boolean
  /** Row density modifier. */
  density?: TableDensity
}

export interface DataTableEmits<T = Record<string, unknown>> {
  /** Emitted whenever the set of selected rows changes (template: `@selection-change`). */
  selectionChange: [rows: T[]]
}

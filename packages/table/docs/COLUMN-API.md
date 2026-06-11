# @thevue/table — Column API

Columns are plain objects passed through `defineColumns<T>()`, which is an
identity function whose only job is to bind your row type `T` so `accessor` and
`cell` callbacks are fully inferred.

```ts
import { defineColumns } from '@thevue/table'

const columns = defineColumns<User>([
  { key: 'name', header: 'Name', sortable: true },
])
```

## `ColumnOptions<T>`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string` | — | **Required.** Unique column id. Also the data key used to read the cell value when `accessor` is omitted. |
| `header` | `string` | `key` | Header label text. |
| `sortable` | `boolean` | `false` | When `true`, the header becomes a button that cycles none → asc → desc. |
| `filterable` | `boolean` | `false` | When `true`, a text filter input is rendered in the header for this column. |
| `accessor` | `(row: T) => unknown` | `row[key]` | Derive the cell value from the row. |
| `cell` | `(ctx: CellContext<T>) => VNodeChild` | — | Render custom cell content instead of the raw value. |
| `width` | `string` | — | Fixed column width (any CSS length, e.g. `'120px'`). |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment for header and cells. |

## `CellContext<T>`

The object passed to a `cell` renderer:

| Field | Type | Description |
| --- | --- | --- |
| `row` | `T` | The full row data object. |
| `value` | `unknown` | The resolved value (via `accessor` or `row[key]`). |
| `index` | `number` | Zero-based index of the row within the current page. |

## Examples

All examples are entries you pass to `defineColumns<T>([...])`.

### Plain value column

```ts
const columns = defineColumns<User>([
  { key: 'email', header: 'Email address' },
])
```

### Computed value

```ts
const columns = defineColumns<User>([
  { key: 'fullName', header: 'Name', accessor: row => `${row.first} ${row.last}` },
])
```

### Custom cell with a VNode

```ts
import { h } from 'vue'

const columns = defineColumns<User>([
  {
    key: 'status',
    header: 'Status',
    cell: ({ value }) => h('span', { class: `badge badge--${value}` }, String(value)),
  },
])
```

### Formatting the value

```ts
const columns = defineColumns<User>([
  {
    key: 'price',
    header: 'Price',
    align: 'right',
    cell: ({ value }) => `$${Number(value).toFixed(2)}`,
  },
])
```

### Sortable, fixed-width, right-aligned

```ts
const columns = defineColumns<User>([
  { key: 'age', header: 'Age', sortable: true, width: '80px', align: 'right' },
])
```

## Selection column

When the `DataTable` `selectable` prop is set, a leading checkbox column is
prepended automatically (id exported as `SELECTION_COLUMN_ID`). You do **not**
declare it in `columns`; it carries a select-all checkbox in the header and a
per-row checkbox in the body, with accessible labels (`Select all rows`,
`Select row N`).

## Expander column

When the `DataTable` `expandable` prop is set, a leading expander button column is
prepended automatically (id exported as `EXPANDER_COLUMN_ID`). You do **not**
declare it in `columns`; it contains a collapse/expand toggle button for each row.

## Column resizing

Columns are resizable if the `resizable` prop on `DataTable` is `true`. The selection and expander columns are not resizable. Column size defaults to `150px` if not specified by `width` or by default.

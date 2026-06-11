# @thevue/table

> Headless-powered data table for the thevue framework — typed columns, client sorting, pagination, row selection, skeleton loading, an empty slot, and density variants. Built on [TanStack Table v8](https://tanstack.com/table/v8).

## Install

**Standalone (just the table):**

```bash
npm install @thevue/core @thevue/table
```

```ts
import '@thevue/core/style' // design tokens
import '@thevue/table/style' // table styles
```

**As part of the full framework:**

```bash
npm install @thevue/vue
```

`DataTable` is then re-exported from `@thevue/vue` and registered globally by the `Thevue` plugin.

## Basic usage

```vue
<script setup lang="ts">
import { DataTable, defineColumns } from '@thevue/table'

interface User {
  id: number
  name: string
  age: number
}

const data: User[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]

const columns = defineColumns<User>([
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## Columns

`defineColumns<T>()` is an identity helper that preserves your row type so
`accessor` and `cell` callbacks are fully typed.

```ts
const columns = defineColumns<User>([
  // simple value column
  { key: 'name', header: 'Name', sortable: true },

  // derive the value from the row
  { key: 'fullName', header: 'Name', accessor: row => `${row.first} ${row.last}` },

  // render custom cell content (returns a VNode / JSX-like)
  {
    key: 'status',
    header: 'Status',
    cell: ({ row }) => h('span', { class: `badge badge--${row.status}` }, row.status),
  },

  // width + alignment
  { key: 'age', header: 'Age', align: 'right', width: '80px' },
])
```

Every column option is documented in [docs/COLUMN-API.md](./docs/COLUMN-API.md).

## Sorting

Set `sortable: true` on a column. Its header becomes a button that cycles
**none → ascending → descending** on click; an indicator (`↕ / ▲ / ▼`) shows the
current state. Sorting is client-side.

## Pagination

```vue
<DataTable :data="data" :columns="columns" paginate :page-size="10" />
```

Renders previous/next controls and a `X / Y` page indicator beneath the table.

## Row selection

```vue
<script setup lang="ts">
function onSelection(rows: User[]) {
  console.log('selected', rows)
}
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    selectable
    @selection-change="onSelection"
  />
</template>
```

Adds a leading checkbox column (with a select-all checkbox in the header) and
emits `selection-change` with the array of selected **row objects** whenever the
selection changes.

## Loading & empty states

```vue
<!-- skeleton placeholder rows -->
<DataTable :data="[]" :columns="columns" :loading="true" :skeleton-rows="5" />

<!-- custom empty state -->
<DataTable :data="[]" :columns="columns">
  <template #empty>
    No results found.
  </template>
</DataTable>
```

## Density

```vue
<DataTable :data="data" :columns="columns" density="compact" />
```

`density` accepts `'default' | 'comfortable' | 'compact'` and only changes cell
padding.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | — | Row data (required) |
| `columns` | `ColumnOptions<T>[]` | — | Column definitions (required) |
| `loading` | `boolean` | `false` | Show skeleton rows instead of data |
| `skeletonRows` | `number` | `5` | Number of skeleton rows when loading |
| `paginate` | `boolean` | `false` | Enable client-side pagination |
| `pageSize` | `number` | `10` | Rows per page when paginating |
| `selectable` | `boolean` | `false` | Render a checkbox selection column |
| `density` | `'default' \| 'comfortable' \| 'compact'` | `'default'` | Cell padding density |

## Events

| Event (template) | Payload | Description |
| --- | --- | --- |
| `@selection-change` | `(rows: T[])` | Fired when the selected rows change |

## Slots

| Slot | Description |
| --- | --- |
| `empty` | Content shown when `data` is empty and not loading |

## Composable

For full control you can drive your own markup with the underlying composable,
which wraps `useVueTable` with thevue's column mapping and reactive
sorting/pagination/selection state:

```ts
import { useThevueTable } from '@thevue/table'

const { table } = useThevueTable<User>({
  data: () => data.value,
  columns: () => columns,
  selectable: () => true,
  onSelectionChange: rows => emit('selection-change', rows),
})
```

## TypeScript

```ts
import type {
  CellContext,
  ColumnOptions,
  DataTableEmits,
  DataTableProps,
  TableDensity,
} from '@thevue/table'
```

## Theming

All styling reads `--thevue-*` tokens from `@thevue/core` — override the theme
and the table follows automatically. See [@thevue/core docs](../core/README.md).

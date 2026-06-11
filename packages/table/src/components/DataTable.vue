<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { CellContext, DataTableEmits, DataTableProps } from '../types'
import { computed } from 'vue'
import { SELECTION_COLUMN_ID } from '../columns'
import { useThevueTable } from '../composables/useTable'
import TablePagination from './TablePagination.vue'

const props = withDefaults(defineProps<DataTableProps<T>>(), {
  loading: false,
  skeletonRows: 5,
  paginate: false,
  pageSize: 10,
  selectable: false,
  density: 'default',
})

const emit = defineEmits<DataTableEmits<T>>()

const { table } = useThevueTable<T>({
  data: () => props.data,
  columns: () => props.columns,
  selectable: () => props.selectable,
  paginate: () => props.paginate,
  pageSize: () => props.pageSize,
  onSelectionChange: rows => emit('selectionChange', rows),
})

const rows = computed(() => table.getRowModel().rows)
const headers = computed(() => table.getHeaderGroups())
const visibleColumnCount = computed(() => table.getVisibleLeafColumns().length)

function isSelectionColumn(id: string): boolean {
  return id === SELECTION_COLUMN_ID
}

function headerLabel(header: unknown): string {
  return typeof header === 'string' ? header : ''
}

function cellContent(cell: ReturnType<typeof rows.value[number]['getVisibleCells']>[number], index: number) {
  const meta = cell.column.columnDef.meta as { cell?: (ctx: CellContext<T>) => unknown } | undefined
  const value = cell.getValue()
  if (meta?.cell) {
    return meta.cell({ row: cell.row.original, value, index })
  }
  return value as string
}

function columnStyle(meta: unknown): Record<string, string> {
  const m = (meta ?? {}) as { width?: string, align?: string }
  const style: Record<string, string> = {}
  if (m.width)
    style.width = m.width
  if (m.align)
    style.textAlign = m.align
  return style
}
</script>

<template>
  <div class="thevue-table-wrapper">
    <table class="thevue-table" :class="`thevue-table--${density}`">
      <thead class="thevue-table__head">
        <tr v-for="group in headers" :key="group.id">
          <th
            v-for="header in group.headers"
            :key="header.id"
            class="thevue-table__th"
            :style="columnStyle(header.column.columnDef.meta)"
            scope="col"
          >
            <template v-if="isSelectionColumn(header.column.id)">
              <input
                type="checkbox"
                class="thevue-table__checkbox"
                aria-label="Select all rows"
                :checked="table.getIsAllRowsSelected()"
                :indeterminate="table.getIsSomeRowsSelected()"
                @change="table.getToggleAllRowsSelectedHandler()($event)"
              >
            </template>
            <button
              v-else-if="header.column.getCanSort()"
              type="button"
              class="thevue-table__sort-btn"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              {{ headerLabel(header.column.columnDef.header) }}
              <span class="thevue-table__sort-icon" aria-hidden="true">
                {{ header.column.getIsSorted() === 'asc' ? '▲' : header.column.getIsSorted() === 'desc' ? '▼' : '↕' }}
              </span>
            </button>
            <template v-else>
              {{ headerLabel(header.column.columnDef.header) }}
            </template>
          </th>
        </tr>
      </thead>

      <tbody class="thevue-table__body">
        <template v-if="loading">
          <tr
            v-for="n in skeletonRows"
            :key="`skeleton-${n}`"
            class="thevue-table__skeleton-row"
          >
            <td v-for="i in visibleColumnCount" :key="i" class="thevue-table__td">
              <span class="thevue-table__skeleton-bar" />
            </td>
          </tr>
        </template>

        <tr v-else-if="rows.length === 0" class="thevue-table__empty-row">
          <td :colspan="visibleColumnCount" class="thevue-table__td thevue-table__empty-cell">
            <slot name="empty">
              No data
            </slot>
          </td>
        </tr>

        <template v-else>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="row.id"
            class="thevue-table__row"
            :class="{ 'thevue-table__row--selected': row.getIsSelected() }"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="thevue-table__td"
              :style="columnStyle(cell.column.columnDef.meta)"
            >
              <input
                v-if="isSelectionColumn(cell.column.id)"
                type="checkbox"
                class="thevue-table__checkbox"
                :aria-label="`Select row ${rowIndex + 1}`"
                :checked="row.getIsSelected()"
                @change="row.getToggleSelectedHandler()($event)"
              >
              <component :is="{ render: () => cellContent(cell, rowIndex) }" v-else />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <TablePagination
      v-if="paginate"
      :page-index="table.getState().pagination.pageIndex"
      :page-count="table.getPageCount()"
      :can-previous="table.getCanPreviousPage()"
      :can-next="table.getCanNextPage()"
      @previous="table.previousPage()"
      @next="table.nextPage()"
    />
  </div>
</template>

<style>
.thevue-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.thevue-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--thevue-text-base);
  font-size: var(--thevue-font-size-sm);
}

.thevue-table__th {
  text-align: left;
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-muted);
  border-bottom: 1px solid var(--thevue-border-base);
  padding: var(--thevue-space-3);
  white-space: nowrap;
}

.thevue-table__td {
  border-bottom: 1px solid var(--thevue-border-subtle);
  padding: var(--thevue-space-3);
}

.thevue-table--comfortable .thevue-table__th,
.thevue-table--comfortable .thevue-table__td {
  padding: var(--thevue-space-4);
}

.thevue-table--compact .thevue-table__th,
.thevue-table--compact .thevue-table__td {
  padding: var(--thevue-space-2);
}

.thevue-table__row:hover {
  background: var(--thevue-bg-subtle);
}

.thevue-table__row--selected {
  background: var(--thevue-color-primary-50);
}

.thevue-table__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--thevue-space-1);
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.thevue-table__sort-icon {
  font-size: 0.75em;
  opacity: 0.6;
}

.thevue-table__checkbox {
  cursor: pointer;
}

.thevue-table__empty-cell {
  text-align: center;
  color: var(--thevue-text-muted);
  padding: var(--thevue-space-6);
}

.thevue-table__skeleton-bar {
  display: block;
  height: 0.75rem;
  border-radius: var(--thevue-radius-sm);
  background: var(--thevue-bg-muted);
  animation: thevue-table-pulse 1.4s ease-in-out infinite;
}

@keyframes thevue-table-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>

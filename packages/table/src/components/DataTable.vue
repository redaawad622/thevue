<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { CellContext, DataTableEmits, DataTableProps } from '../types'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, ref } from 'vue'
import { EXPANDER_COLUMN_ID, SELECTION_COLUMN_ID } from '../columns'
import { useThevueTable } from '../composables/useTable'
import TablePagination from './TablePagination.vue'

const props = withDefaults(defineProps<DataTableProps<T>>(), {
  loading: false,
  skeletonRows: 5,
  paginate: false,
  pageSize: 10,
  selectable: false,
  density: 'default',
  showColumnToggle: false,
  resizable: false,
  expandable: false,
  virtual: false,
  stickyHeader: false,
})

const emit = defineEmits<DataTableEmits<T>>()

const { table } = useThevueTable<T>({
  data: () => props.data,
  columns: () => props.columns,
  selectable: () => props.selectable,
  paginate: () => props.paginate,
  pageSize: () => props.pageSize,
  resizable: () => props.resizable,
  expandable: () => props.expandable,
  onSelectionChange: rows => emit('selectionChange', rows),
})

const rows = computed(() => table.getRowModel().rows)
const headers = computed(() => table.getHeaderGroups())
const visibleColumnCount = computed(() => table.getVisibleLeafColumns().length)
const toggleableColumns = computed(() =>
  table.getAllLeafColumns().filter(
    column => column.id !== SELECTION_COLUMN_ID && column.id !== EXPANDER_COLUMN_ID,
  ),
)

function isSelectionColumn(id: string): boolean {
  return id === SELECTION_COLUMN_ID
}

function isExpanderColumn(id: string): boolean {
  return id === EXPANDER_COLUMN_ID
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

function columnStyle(meta: unknown, size?: number): Record<string, string> {
  const m = (meta ?? {}) as { width?: string, align?: string }
  const style: Record<string, string> = {}
  if (size !== undefined) {
    style.width = `${size}px`
    style.flex = `0 0 ${size}px`
  }
  else if (m.width) {
    style.width = m.width
    style.flex = `0 0 ${m.width}`
  }
  if (m.align)
    style.textAlign = m.align
  return style
}
const parentRef = ref<HTMLDivElement | null>(null)

const rowVirtualizer = useVirtualizer({
  get count() {
    return rows.value.length
  },
  getScrollElement: () => parentRef.value,
  estimateSize: () => 45,
  overscan: 5,
})
</script>

<template>
  <div ref="parentRef" class="thevue-table-wrapper" :style="maxHeight ? { maxHeight, overflowY: 'auto' } : undefined">
    <details v-if="showColumnToggle" class="thevue-table__column-toggle">
      <summary class="thevue-table__column-toggle-summary">
        Columns
      </summary>
      <div class="thevue-table__column-toggle-menu">
        <label
          v-for="column in toggleableColumns"
          :key="column.id"
          class="thevue-table__column-toggle-option"
        >
          <input
            type="checkbox"
            :checked="column.getIsVisible()"
            @change="column.toggleVisibility()"
          >
          {{ headerLabel(column.columnDef.header) }}
        </label>
      </div>
    </details>

    <table
      class="thevue-table"
      :class="[`thevue-table--${density}`, { 'thevue-table--sticky-header': stickyHeader, 'thevue-table--virtual': virtual }]"
    >
      <thead class="thevue-table__head">
        <tr v-for="group in headers" :key="group.id">
          <th
            v-for="header in group.headers"
            :key="header.id"
            class="thevue-table__th"
            :style="columnStyle(header.column.columnDef.meta, props.resizable ? header.getSize() : undefined)"
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
            <template v-else-if="isExpanderColumn(header.column.id)">
              <!-- empty header cell for expander -->
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
            <input
              v-if="header.column.getCanFilter()"
              type="text"
              class="thevue-table__filter-input"
              :aria-label="`Filter ${headerLabel(header.column.columnDef.header)}`"
              :value="(header.column.getFilterValue() as string) ?? ''"
              @input="header.column.setFilterValue(($event.target as HTMLInputElement).value)"
            >
            <span
              v-if="props.resizable && header.column.getCanResize()"
              class="thevue-table__resize-handle"
              :class="{ 'thevue-table__resize-handle--active': header.column.getIsResizing() }"
              @mousedown="header.getResizeHandler()($event)"
              @touchstart="header.getResizeHandler()($event)"
            />
          </th>
        </tr>
      </thead>

      <tbody
        class="thevue-table__body"
        :style="virtual ? { height: `${rowVirtualizer.getTotalSize()}px` } : undefined"
      >
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

        <template v-else-if="virtual">
          <template v-for="virtualRow in rowVirtualizer.getVirtualItems()" :key="virtualRow.key">
            <tr
              :ref="el => rowVirtualizer.measureElement(el as Element)"
              :data-index="virtualRow.index"
              class="thevue-table__row"
              :class="{ 'thevue-table__row--selected': rows[virtualRow.index]!.getIsSelected() }"
              :style="{
                transform: `translateY(${virtualRow.start}px)`,
              }"
            >
              <td
                v-for="cell in rows[virtualRow.index]!.getVisibleCells()"
                :key="cell.id"
                class="thevue-table__td"
                :style="columnStyle(cell.column.columnDef.meta, cell.column.getSize())"
              >
                <input
                  v-if="isSelectionColumn(cell.column.id)"
                  type="checkbox"
                  class="thevue-table__checkbox"
                  :aria-label="`Select row ${virtualRow.index + 1}`"
                  :checked="rows[virtualRow.index]!.getIsSelected()"
                  @change="rows[virtualRow.index]!.getToggleSelectedHandler()($event)"
                >
                <button
                  v-else-if="isExpanderColumn(cell.column.id)"
                  type="button"
                  class="thevue-table__expand-btn"
                  :aria-label="rows[virtualRow.index]!.getIsExpanded() ? `Collapse row ${virtualRow.index + 1}` : `Expand row ${virtualRow.index + 1}`"
                  @click="rows[virtualRow.index]!.toggleExpanded()"
                >
                  <span class="thevue-table__expand-icon" aria-hidden="true">
                    {{ rows[virtualRow.index]!.getIsExpanded() ? '▼' : '▶' }}
                  </span>
                </button>
                <component :is="{ render: () => cellContent(cell, virtualRow.index) }" v-else />
              </td>
              <td
                v-if="rows[virtualRow.index]!.getIsExpanded()"
                :colspan="visibleColumnCount"
                class="thevue-table__td thevue-table__expanded-cell"
                style="width: 100%; flex: 1 1 100%; box-sizing: border-box;"
              >
                <slot name="expanded" :row="rows[virtualRow.index]!.original" />
              </td>
            </tr>
          </template>
        </template>

        <template v-else>
          <template v-for="(row, rowIndex) in rows" :key="row.id">
            <tr
              class="thevue-table__row"
              :class="{ 'thevue-table__row--selected': row.getIsSelected() }"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="thevue-table__td"
                :style="columnStyle(cell.column.columnDef.meta, props.resizable ? cell.column.getSize() : undefined)"
              >
                <input
                  v-if="isSelectionColumn(cell.column.id)"
                  type="checkbox"
                  class="thevue-table__checkbox"
                  :aria-label="`Select row ${rowIndex + 1}`"
                  :checked="row.getIsSelected()"
                  @change="row.getToggleSelectedHandler()($event)"
                >
                <button
                  v-else-if="isExpanderColumn(cell.column.id)"
                  type="button"
                  class="thevue-table__expand-btn"
                  :aria-label="row.getIsExpanded() ? `Collapse row ${rowIndex + 1}` : `Expand row ${rowIndex + 1}`"
                  @click="row.toggleExpanded()"
                >
                  <span class="thevue-table__expand-icon" aria-hidden="true">
                    {{ row.getIsExpanded() ? '▼' : '▶' }}
                  </span>
                </button>
                <component :is="{ render: () => cellContent(cell, rowIndex) }" v-else />
              </td>
            </tr>
            <tr v-if="row.getIsExpanded()" class="thevue-table__expanded-row">
              <td :colspan="visibleColumnCount" class="thevue-table__td thevue-table__expanded-cell">
                <slot name="expanded" :row="row.original" />
              </td>
            </tr>
          </template>
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
  position: relative;
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

.thevue-table--sticky-header .thevue-table__th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--thevue-bg-base);
}

.thevue-table__column-toggle {
  display: inline-block;
  margin-bottom: var(--thevue-space-2);
}

.thevue-table__column-toggle-summary {
  display: inline-flex;
  align-items: center;
  padding: var(--thevue-space-1) var(--thevue-space-2);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  background: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  font-size: var(--thevue-font-size-sm);
  cursor: pointer;
  list-style: none;
}

.thevue-table__column-toggle-summary::-webkit-details-marker {
  display: none;
}

.thevue-table__column-toggle-menu {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-1);
  margin-top: var(--thevue-space-1);
  padding: var(--thevue-space-2);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  background: var(--thevue-bg-base);
}

.thevue-table__column-toggle-option {
  display: flex;
  align-items: center;
  gap: var(--thevue-space-1);
  font-size: var(--thevue-font-size-sm);
  cursor: pointer;
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

.thevue-table__filter-input {
  display: block;
  width: 100%;
  margin-top: var(--thevue-space-1);
  padding: var(--thevue-space-1) var(--thevue-space-2);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-sm);
  background: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  font: inherit;
  font-weight: var(--thevue-font-weight-normal);
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

.thevue-table__resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 4px;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  z-index: 10;
}

.thevue-table__resize-handle--active {
  background: var(--thevue-color-primary-500);
}

.thevue-table__expand-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: var(--thevue-text-muted);
  cursor: pointer;
  width: var(--thevue-space-5);
  height: var(--thevue-space-5);
  border-radius: var(--thevue-radius-sm);
  transition: background 150ms ease, color 150ms ease;
}

.thevue-table__expand-btn:hover {
  background: var(--thevue-bg-muted);
  color: var(--thevue-text-base);
}

.thevue-table__expand-icon {
  font-size: 0.75em;
}

.thevue-table__expanded-cell {
  background: var(--thevue-bg-subtle);
  padding: var(--thevue-space-4);
}

.thevue-table--virtual {
  display: grid;
}

.thevue-table--virtual .thevue-table__head {
  display: grid;
}

.thevue-table--virtual .thevue-table__head tr {
  display: flex;
  width: 100%;
}

.thevue-table--virtual .thevue-table__body {
  display: grid;
  position: relative;
}

.thevue-table--virtual .thevue-table__row {
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.thevue-table--virtual .thevue-table__th,
.thevue-table--virtual .thevue-table__td {
  display: block;
  box-sizing: border-box;
}
</style>

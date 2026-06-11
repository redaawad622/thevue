<script setup lang="ts">
import { Btn, DataTable, defineColumns } from '@thevue/vue'
import { computed, h, ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive' | 'Pending'
  department: string
  joinedDate: string
  [key: string]: unknown
}

// 1. Mock Data for standard table
const originalData: User[] = [
  { id: '1', name: 'Amelia Earhart', email: 'amelia@aviation.org', role: 'Pilot', status: 'Active', department: 'Operations', joinedDate: '2023-01-15' },
  { id: '2', name: 'Charles Lindbergh', email: 'charles@aviation.org', role: 'Co-Pilot', status: 'Active', department: 'Operations', joinedDate: '2023-02-20' },
  { id: '3', name: 'Bessie Coleman', email: 'bessie@flying.org', role: 'Instructor', status: 'Active', department: 'Training', joinedDate: '2022-11-05' },
  { id: '4', name: 'Wright Wilbur', email: 'wilbur@wright.com', role: 'Engineer', status: 'Active', department: 'Engineering', joinedDate: '2021-08-10' },
  { id: '5', name: 'Wright Orville', email: 'orville@wright.com', role: 'Engineer', status: 'Inactive', department: 'Engineering', joinedDate: '2021-08-10' },
  { id: '6', name: 'Harriet Quimby', email: 'harriet@journalism.com', role: 'Journalist', status: 'Pending', department: 'Marketing', joinedDate: '2024-03-01' },
  { id: '7', name: 'Chuck Yeager', email: 'chuck@supersonic.mil', role: 'Test Pilot', status: 'Active', department: 'Research', joinedDate: '2020-05-18' },
  { id: '8', name: 'Sally Ride', email: 'sally@nasa.gov', role: 'Astronaut', status: 'Active', department: 'Research', joinedDate: '2019-10-12' },
  { id: '9', name: 'Yuri Gagarin', email: 'yuri@cosmos.ru', role: 'Cosmonaut', status: 'Inactive', department: 'Operations', joinedDate: '2018-04-12' },
  { id: '10', name: 'Mae Jemison', email: 'mae@jemison.org', role: 'Doctor', status: 'Active', department: 'Medical', joinedDate: '2022-07-22' },
]

const isEmpty = ref(false)
const tableData = computed(() => {
  return isEmpty.value ? [] : originalData
})

// Columns definitions
const columns = defineColumns<User>([
  { key: 'name', header: 'Name', sortable: true, filterable: true, width: '180px' },
  { key: 'email', header: 'Email Address', sortable: true, filterable: true, width: '220px' },
  { key: 'role', header: 'Role', sortable: true, filterable: true, width: '140px' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '120px',
    align: 'center',
    cell: ({ value }) => {
      const status = value as string
      let colorClass = 'status-badge--neutral'
      if (status === 'Active')
        colorClass = 'status-badge--success'
      else if (status === 'Inactive')
        colorClass = 'status-badge--danger'
      else if (status === 'Pending')
        colorClass = 'status-badge--warning'

      return h('span', { class: ['status-badge', colorClass] }, status)
    },
  },
  { key: 'department', header: 'Department', sortable: true, filterable: true, width: '150px' },
  { key: 'joinedDate', header: 'Joined Date', sortable: true, width: '130px' },
])

// 2. Interactive States
const isLoading = ref(false)
const isSelectable = ref(true)
const isPaginated = ref(true)
const isResizable = ref(true)
const isExpandable = ref(true)
const showColumnToggle = ref(true)
const density = ref<'default' | 'comfortable' | 'compact'>('default')

// Selected Rows
const selectedRows = ref<User[]>([])
function onSelectionChange(rows: User[]) {
  selectedRows.value = rows
}

// 3. Virtual Scroll Mock Data (10,000 Rows)
interface VirtualRow {
  id: string
  title: string
  count: number
  category: string
  rating: number
  [key: string]: unknown
}

function generateVirtualData(): VirtualRow[] {
  const categories = ['Electronics', 'Home', 'Outdoors', 'Books', 'Apparel']
  const data: VirtualRow[] = []
  for (let i = 1; i <= 10000; i++) {
    data.push({
      id: String(i),
      title: `Product Reference Item #${i}`,
      count: Math.floor(Math.random() * 1000) + 1,
      category: categories[i % categories.length]!,
      rating: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)),
    })
  }
  return data
}

const virtualData = generateVirtualData()

const virtualColumns = defineColumns<VirtualRow>([
  { key: 'id', header: 'Product ID', sortable: true, width: '120px' },
  { key: 'title', header: 'Product Name', sortable: true, filterable: true, width: '300px' },
  { key: 'category', header: 'Category', sortable: true, filterable: true, width: '180px' },
  { key: 'count', header: 'Inventory Count', sortable: true, width: '150px', align: 'right' },
  { key: 'rating', header: 'Rating', sortable: true, width: '120px', align: 'center' },
])
</script>

<template>
  <div class="table-showcase">
    <!-- Interactive Settings & Main DataTable -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        DataTable Options & Interaction
      </h2>

      <!-- Option Controls -->
      <div class="showcase-card options-card">
        <div class="options-flex">
          <label class="option-toggle">
            <input v-model="isLoading" type="checkbox">
            <span>Show Loading (Skeleton)</span>
          </label>
          <label class="option-toggle">
            <input v-model="isEmpty" type="checkbox">
            <span>Empty State (No Data)</span>
          </label>
          <label class="option-toggle">
            <input v-model="isSelectable" type="checkbox">
            <span>Selection Column</span>
          </label>
          <label class="option-toggle">
            <input v-model="isPaginated" type="checkbox">
            <span>Enable Client Pagination</span>
          </label>
          <label class="option-toggle">
            <input v-model="isResizable" type="checkbox">
            <span>Resizable Columns</span>
          </label>
          <label class="option-toggle">
            <input v-model="isExpandable" type="checkbox">
            <span>Expandable Rows</span>
          </label>
          <label class="option-toggle">
            <input v-model="showColumnToggle" type="checkbox">
            <span>Column Visibility Toggle</span>
          </label>
          <div class="option-select-group">
            <span class="option-select-label">Density</span>
            <select v-model="density" class="density-select">
              <option value="default">
                Default
              </option>
              <option value="comfortable">
                Comfortable
              </option>
              <option value="compact">
                Compact
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Interactive Table -->
      <div class="showcase-card table-card">
        <DataTable
          :data="tableData"
          :columns="columns"
          :loading="isLoading"
          :paginate="isPaginated"
          :page-size="5"
          :selectable="isSelectable"
          :resizable="isResizable"
          :expandable="isExpandable"
          :show-column-toggle="showColumnToggle"
          :density="density"
          @selection-change="onSelectionChange"
        >
          <!-- Custom Expansion details -->
          <template #expanded="{ row }">
            <div class="expanded-detail">
              <h4 class="detail-title">
                Detailed Record for {{ row.name }}
              </h4>
              <div class="detail-grid">
                <div><strong>Unique ID:</strong> {{ row.id }}</div>
                <div><strong>Email:</strong> {{ row.email }}</div>
                <div><strong>Department:</strong> {{ row.department }}</div>
                <div><strong>Role:</strong> {{ row.role }}</div>
                <div><strong>Employment Status:</strong> {{ row.status }}</div>
                <div><strong>Date of Joining:</strong> {{ row.joinedDate }}</div>
              </div>
            </div>
          </template>

          <!-- Custom empty state -->
          <template #empty>
            <div class="custom-empty">
              <div class="empty-icon">
                📂
              </div>
              <div class="empty-title">
                No Matching Records Found
              </div>
              <div class="empty-desc">
                Adjust your filters or reload the dataset.
              </div>
              <Btn variant="outline" color="neutral" size="sm" @click="isEmpty = false">
                Reset Empty State
              </Btn>
            </div>
          </template>
        </DataTable>
      </div>

      <!-- Selection Info -->
      <div v-if="selectedRows.length > 0" class="selection-banner">
        <span>Selected: <strong>{{ selectedRows.length }} rows</strong> (IDs: {{ selectedRows.map(r => r.id).join(', ') }})</span>
      </div>
    </section>

    <!-- Virtual Scrolling (10,000 Rows) -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Virtualization & Sticky Header (10,000 Rows)
      </h2>
      <p class="section-description">
        Demonstrates rendering a large dataset of 10,000 entries efficiently using DOM recycling/windowing.
        Features a sticky header pinned to the top of the scroll container.
      </p>

      <div class="showcase-card table-card">
        <DataTable
          :data="virtualData"
          :columns="virtualColumns"
          virtual
          sticky-header
          max-height="400px"
          :density="density"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.table-showcase {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-6);
}

.options-card {
  margin-bottom: var(--thevue-space-4);
  padding: var(--thevue-space-4);
}

.options-flex {
  display: flex;
  flex-wrap: wrap;
  gap: var(--thevue-space-4);
  align-items: center;
}

.option-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--thevue-space-2);
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-base);
  cursor: pointer;
}

.option-select-group {
  display: inline-flex;
  align-items: center;
  gap: var(--thevue-space-2);
}

.option-select-label {
  font-size: var(--thevue-font-size-sm);
  font-weight: var(--thevue-font-weight-medium);
  color: var(--thevue-text-subtle);
}

.density-select {
  padding: var(--thevue-space-1) var(--thevue-space-2);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  background: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  font-size: var(--thevue-font-size-sm);
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.section-description {
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-subtle);
  margin-top: calc(-1 * var(--thevue-space-2));
  margin-bottom: var(--thevue-space-4);
}

/* Custom badge styling inside table */
:deep(.status-badge) {
  display: inline-flex;
  align-items: center;
  padding: var(--thevue-space-0_5) var(--thevue-space-2);
  border-radius: var(--thevue-radius-full);
  font-size: var(--thevue-font-size-xs);
  font-weight: var(--thevue-font-weight-semibold);
}

:deep(.status-badge--success) {
  background-color: var(--thevue-color-success-50);
  color: var(--thevue-color-success-700);
  border: 1px solid var(--thevue-color-success-200);
}

[data-theme="dark"] :deep(.status-badge--success) {
  background-color: var(--thevue-color-success-950);
  color: var(--thevue-color-success-300);
  border-color: var(--thevue-color-success-800);
}

:deep(.status-badge--danger) {
  background-color: var(--thevue-color-danger-50);
  color: var(--thevue-color-danger-700);
  border: 1px solid var(--thevue-color-danger-200);
}

[data-theme="dark"] :deep(.status-badge--danger) {
  background-color: var(--thevue-color-danger-950);
  color: var(--thevue-color-danger-300);
  border-color: var(--thevue-color-danger-800);
}

:deep(.status-badge--warning) {
  background-color: var(--thevue-color-warning-50);
  color: var(--thevue-color-warning-700);
  border: 1px solid var(--thevue-color-warning-200);
}

[data-theme="dark"] :deep(.status-badge--warning) {
  background-color: var(--thevue-color-warning-950);
  color: var(--thevue-color-warning-300);
  border-color: var(--thevue-color-warning-800);
}

:deep(.status-badge--neutral) {
  background-color: var(--thevue-color-neutral-100);
  color: var(--thevue-color-neutral-700);
  border: 1px solid var(--thevue-color-neutral-300);
}

[data-theme="dark"] :deep(.status-badge--neutral) {
  background-color: var(--thevue-color-neutral-900);
  color: var(--thevue-color-neutral-300);
  border-color: var(--thevue-color-neutral-700);
}

.expanded-detail {
  padding: var(--thevue-space-4);
  background: var(--thevue-bg-muted);
  border-radius: var(--thevue-radius-md);
  margin: var(--thevue-space-2);
  border: 1px solid var(--thevue-border-base);
}

.detail-title {
  margin-top: 0;
  margin-bottom: var(--thevue-space-3);
  font-size: var(--thevue-font-size-sm);
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-base);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--thevue-space-2);
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-subtle);
}

.custom-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--thevue-space-12) var(--thevue-space-6);
  text-align: center;
}

.empty-icon {
  font-size: var(--thevue-font-size-4xl);
  margin-bottom: var(--thevue-space-4);
}

.empty-title {
  font-size: var(--thevue-font-size-md);
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-base);
  margin-bottom: var(--thevue-space-1);
}

.empty-desc {
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-muted);
  margin-bottom: var(--thevue-space-4);
}

.selection-banner {
  margin-top: var(--thevue-space-3);
  padding: var(--thevue-space-3) var(--thevue-space-4);
  background: var(--thevue-color-primary-50);
  border: 1px solid var(--thevue-color-primary-200);
  border-radius: var(--thevue-radius-md);
  color: var(--thevue-color-primary-700);
  font-size: var(--thevue-font-size-sm);
}

[data-theme="dark"] .selection-banner {
  background: var(--thevue-color-primary-950);
  border-color: var(--thevue-color-primary-800);
  color: var(--thevue-color-primary-300);
}
</style>

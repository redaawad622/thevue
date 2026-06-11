import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { h } from 'vue'
import { DataTable, defineColumns } from '../src/index'

interface User {
  id: number
  name: string
  age: number
}

const users: User[] = [
  { id: 1, name: 'Carol', age: 35 },
  { id: 2, name: 'Alice', age: 30 },
  { id: 3, name: 'Eve', age: 42 },
  { id: 4, name: 'Bob', age: 25 },
  { id: 5, name: 'Dave', age: 38 },
]

const columns = defineColumns<User>([
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true },
])

function rowTexts(screen: { container: Element }): string[] {
  return [...screen.container.querySelectorAll('.thevue-table tbody tr')].map(
    tr => tr.querySelector('td')?.textContent?.trim() ?? '',
  )
}

describe('dataTable rendering', () => {
  it('renders a header cell per column', () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    const headerText = [...screen.container.querySelectorAll('.thevue-table thead th')]
      .map(th => th.textContent?.trim() ?? '')
      .join(' ')
    expect(headerText).toContain('Name')
    expect(headerText).toContain('Age')
  })

  it('renders a row per data item', () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    expect(screen.container.querySelectorAll('.thevue-table tbody tr').length).toBe(5)
  })

  it('renders cell values from the data', () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    expect(screen.container.textContent).toContain('Carol')
    expect(screen.container.textContent).toContain('42')
  })

  it('supports a custom cell render function', () => {
    const custom = defineColumns<User>([
      { key: 'name', header: 'Name', cell: ({ row }) => h('em', { class: 'custom-cell' }, row.name) },
    ])
    const screen = render(DataTable, { props: { data: users, columns: custom } })
    const em = screen.container.querySelector('em.custom-cell')
    expect(em).not.toBeNull()
    expect(em!.textContent).toBe('Carol')
  })
})

describe('dataTable sorting', () => {
  it('sorts ascending then descending when a sortable header is clicked', async () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    await screen.getByRole('button', { name: /name/i }).click()
    expect(rowTexts(screen)[0]).toBe('Alice')
    await screen.getByRole('button', { name: /name/i }).click()
    expect(rowTexts(screen)[0]).toBe('Eve')
  })
})

describe('dataTable pagination', () => {
  it('paginates data and advances pages', async () => {
    const screen = render(DataTable, {
      props: { data: users, columns, paginate: true, pageSize: 2 },
    })
    expect(screen.container.querySelectorAll('.thevue-table tbody tr').length).toBe(2)
    expect(screen.container.querySelector('.thevue-table__page-info')!.textContent).toContain('1 / 3')
    await screen.getByRole('button', { name: /next page/i }).click()
    expect(screen.container.querySelector('.thevue-table__page-info')!.textContent).toContain('2 / 3')
  })
})

describe('dataTable selection', () => {
  it('emits selection-change with the selected rows', async () => {
    const screen = render(DataTable, {
      props: { data: users, columns, selectable: true },
    })
    await screen.getByRole('checkbox', { name: /select row 1/i }).click()
    const events = screen.emitted('selectionChange') as User[][][]
    expect(events).toBeTruthy()
    const last = events.at(-1)![0]
    expect(last).toHaveLength(1)
    expect(last[0].name).toBe('Carol')
  })

  it('selects all rows via the header checkbox', async () => {
    const screen = render(DataTable, {
      props: { data: users, columns, selectable: true },
    })
    await screen.getByRole('checkbox', { name: /select all rows/i }).click()
    const events = screen.emitted('selectionChange') as User[][][]
    expect(events.at(-1)![0]).toHaveLength(5)
  })
})

describe('dataTable states', () => {
  it('renders skeleton rows while loading', () => {
    const screen = render(DataTable, { props: { data: [], columns, loading: true } })
    expect(screen.container.querySelectorAll('.thevue-table__skeleton-row').length).toBeGreaterThan(0)
  })

  it('renders the empty slot when there is no data', () => {
    const screen = render(DataTable, {
      props: { data: [], columns },
      slots: { empty: () => 'Nothing here' },
    })
    expect(screen.container.textContent).toContain('Nothing here')
  })

  it('applies a density modifier class', () => {
    const screen = render(DataTable, {
      props: { data: users, columns, density: 'compact' },
    })
    expect(screen.container.querySelector('.thevue-table--compact')).not.toBeNull()
  })
})

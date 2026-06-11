import { describe, expect, it, vi } from 'vitest'
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

describe('dataTable column filtering', () => {
  const filterableColumns = defineColumns<User>([
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'age', header: 'Age', sortable: true },
  ])

  it('renders a filter input only for filterable columns', () => {
    const screen = render(DataTable, { props: { data: users, columns: filterableColumns } })
    const inputs = [...screen.container.querySelectorAll('.thevue-table__filter-input')]
    expect(inputs).toHaveLength(1)
    expect(inputs[0].getAttribute('aria-label')).toMatch(/name/i)
  })

  it('filters rows when typing in a column filter input', async () => {
    const screen = render(DataTable, { props: { data: users, columns: filterableColumns } })
    await screen.getByLabelText(/filter name/i).fill('ali')
    expect(rowTexts(screen)).toEqual(['Alice'])
  })
})

describe('dataTable column visibility', () => {
  it('renders a toggle option per column when showColumnToggle is set', () => {
    const screen = render(DataTable, { props: { data: users, columns, showColumnToggle: true } })
    expect(screen.container.querySelectorAll('.thevue-table__column-toggle-option')).toHaveLength(2)
  })

  it('hides a column when its visibility checkbox is unchecked', async () => {
    const screen = render(DataTable, { props: { data: users, columns, showColumnToggle: true } })
    await screen.getByText('Columns').click()
    await screen.getByRole('checkbox', { name: /age/i }).click()
    const headerText = [...screen.container.querySelectorAll('.thevue-table thead th')]
      .map(th => th.textContent?.trim() ?? '')
      .join(' ')
    expect(headerText).not.toContain('Age')
    expect(headerText).toContain('Name')
  })
})

describe('dataTable column resizing', () => {
  it('does not render resize handles by default', () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    expect(screen.container.querySelectorAll('.thevue-table__resize-handle')).toHaveLength(0)
  })

  it('renders a resize handle for each resizable column', () => {
    const screen = render(DataTable, { props: { data: users, columns, resizable: true } })
    expect(screen.container.querySelectorAll('.thevue-table__resize-handle')).toHaveLength(2)
  })

  it('resizes a column by dragging its resize handle', async () => {
    const screen = render(DataTable, { props: { data: users, columns, resizable: true } })
    const th = screen.container.querySelectorAll('.thevue-table thead th')[0] as HTMLElement
    expect(th.style.width).toBe('150px')

    const handle = screen.container.querySelector('.thevue-table__resize-handle') as HTMLElement
    const doc = handle.ownerDocument
    const win = doc.defaultView!
    handle.dispatchEvent(new win.MouseEvent('mousedown', { bubbles: true, clientX: 100 }))
    doc.dispatchEvent(new win.MouseEvent('mousemove', { bubbles: true, clientX: 150 }))
    doc.dispatchEvent(new win.MouseEvent('mouseup', { bubbles: true, clientX: 150 }))

    await vi.waitFor(() => expect(th.style.width).toBe('200px'))
  })
})

describe('dataTable sticky header', () => {
  it('applies the sticky-header modifier class when stickyHeader is set', () => {
    const screen = render(DataTable, { props: { data: users, columns, stickyHeader: true } })
    expect(screen.container.querySelector('.thevue-table--sticky-header')).not.toBeNull()
  })

  it('applies maxHeight to the scroll wrapper', () => {
    const screen = render(DataTable, {
      props: { data: users, columns, stickyHeader: true, maxHeight: '300px' },
    })
    const wrapper = screen.container.querySelector('.thevue-table-wrapper') as HTMLElement
    expect(wrapper.style.maxHeight).toBe('300px')
  })
})

describe('dataTable row expansion', () => {
  it('does not render expander buttons by default', () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    expect(screen.container.querySelectorAll('.thevue-table__expand-btn')).toHaveLength(0)
  })

  it('renders expander buttons and toggles row visibility on click', async () => {
    const screen = render(DataTable, {
      props: { data: users, columns, expandable: true },
      slots: {
        expanded: ({ row }) => h('div', { class: 'expanded-content' }, `Details for ${row.name}`),
      },
    })

    const buttons = screen.container.querySelectorAll('.thevue-table__expand-btn')
    expect(buttons).toHaveLength(5)

    expect(screen.container.querySelector('.expanded-content')).toBeNull()

    await screen.getByRole('button', { name: /expand row 1/i }).click()

    expect(screen.container.querySelector('.expanded-content')).not.toBeNull()
    expect(screen.container.querySelector('.expanded-content')!.textContent).toBe('Details for Carol')

    await screen.getByRole('button', { name: /collapse row 1/i }).click()
    expect(screen.container.querySelector('.expanded-content')).toBeNull()
  })
})

describe('dataTable virtual scrolling', () => {
  it('does not apply virtual layout by default', () => {
    const screen = render(DataTable, { props: { data: users, columns } })
    expect(screen.container.querySelector('.thevue-table--virtual')).toBeNull()
  })

  it('virtualizes row rendering for large datasets', async () => {
    const manyUsers = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + (i % 50),
    }))

    const screen = render(DataTable, {
      props: {
        data: manyUsers,
        columns,
        virtual: true,
        maxHeight: '200px',
      },
    })

    expect(screen.container.querySelector('.thevue-table--virtual')).not.toBeNull()

    const wrapper = screen.container.querySelector('.thevue-table-wrapper')
    expect(wrapper).not.toBeNull()

    await vi.waitFor(() => {
      const renderedRows = screen.container.querySelectorAll('.thevue-table__body tr.thevue-table__row')
      expect(renderedRows.length).toBeLessThan(100)
      expect(renderedRows.length).toBeGreaterThan(0)
    })
  })
})

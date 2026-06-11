import { addIcon } from '@iconify/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Icon, useIconRegistry } from '../src/index'

// register icon data locally so tests never hit the Iconify network API
addIcon('test:box', {
  body: '<rect width="24" height="24" fill="currentColor" />',
  width: 24,
  height: 24,
})

describe('icon (iconify)', () => {
  it('renders an inline svg for an iconify name', async () => {
    const screen = render(Icon, { props: { name: 'test:box' } })
    await expect.poll(() => screen.container.querySelector('svg')).not.toBeNull()
    expect(screen.container.querySelector('rect')).not.toBeNull()
  })

  it('defaults to the md token size and currentColor', async () => {
    const screen = render(Icon, { props: { name: 'test:box' } })
    await expect.poll(() => screen.container.querySelector('svg')).not.toBeNull()
    const el = screen.container.querySelector<SVGElement>('svg')!
    expect(el.style.width).toBe('var(--thevue-font-size-md)')
    expect(el.style.height).toBe('var(--thevue-font-size-md)')
  })

  it('accepts a token size and a numeric pixel size', async () => {
    const tokenSized = render(Icon, { props: { name: 'test:box', size: 'xl' } })
    await expect.poll(() => tokenSized.container.querySelector('svg')).not.toBeNull()
    expect(tokenSized.container.querySelector<SVGElement>('svg')!.style.width).toBe('var(--thevue-font-size-xl)')

    const pixelSized = render(Icon, { props: { name: 'test:box', size: 32 } })
    await expect.poll(() => pixelSized.container.querySelector('svg')).not.toBeNull()
    expect(pixelSized.container.querySelector<SVGElement>('svg')!.style.width).toBe('32px')
  })

  it('applies the color prop', async () => {
    const screen = render(Icon, { props: { name: 'test:box', color: 'rgb(255, 0, 0)' } })
    await expect.poll(() => screen.container.querySelector('svg')).not.toBeNull()
    expect(screen.container.querySelector<SVGElement>('svg')!.style.color).toBe('rgb(255, 0, 0)')
  })

  it('applies spin and flip modifier classes', async () => {
    const screen = render(Icon, { props: { name: 'test:box', spin: true, flip: 'horizontal' } })
    await expect.poll(() => screen.container.querySelector('svg')).not.toBeNull()
    const el = screen.container.querySelector<SVGElement>('svg')!
    expect(el.classList.contains('thevue-icon--spin')).toBe(true)
    expect(el.classList.contains('thevue-icon--flip-horizontal')).toBe(true)
  })
})

describe('icon (custom registry)', () => {
  it('renders SVGs registered through useIconRegistry', () => {
    const registry = useIconRegistry()
    registry.register('brand:logo', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>')

    expect(registry.has('brand:logo')).toBe(true)

    const screen = render(Icon, { props: { name: 'brand:logo' } })
    expect(screen.container.querySelector('circle')).not.toBeNull()
  })

  it('custom icons win over iconify resolution and honor size/color', () => {
    const registry = useIconRegistry()
    registry.register('test:box', '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="4" /></svg>')

    const screen = render(Icon, { props: { name: 'test:box', size: 'sm', color: 'rgb(0, 128, 0)' } })
    expect(screen.container.querySelector('ellipse')).not.toBeNull()
    const host = screen.container.querySelector<HTMLElement>('.thevue-icon')!
    expect(host.style.width).toBe('var(--thevue-font-size-sm)')
    expect(host.style.color).toBe('rgb(0, 128, 0)')

    registry.unregister('test:box')
    expect(registry.has('test:box')).toBe(false)
  })
})

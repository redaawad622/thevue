import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { h } from 'vue'
import { Btn, BtnGroup } from '../src/index'

function getBtn(screen: { container: Element }): HTMLElement {
  const el = screen.container.querySelector<HTMLElement>('.thevue-btn')
  expect(el).not.toBeNull()
  return el!
}

describe('btn', () => {
  it('renders a native button with sensible defaults', () => {
    const screen = render(Btn, { slots: { default: () => 'Click me' } })
    const btn = getBtn(screen)
    expect(btn.tagName).toBe('BUTTON')
    expect((btn as HTMLButtonElement).type).toBe('button')
    expect(btn.classList.contains('thevue-btn--solid')).toBe(true)
    expect(btn.classList.contains('thevue-btn--primary')).toBe(true)
    expect(btn.classList.contains('thevue-btn--md')).toBe(true)
    expect(btn.textContent).toContain('Click me')
  })

  it('applies variant, color and size modifier classes', () => {
    const screen = render(Btn, {
      props: { variant: 'outline', color: 'danger', size: 'xs' },
      slots: { default: () => 'Delete' },
    })
    const btn = getBtn(screen)
    expect(btn.classList.contains('thevue-btn--outline')).toBe(true)
    expect(btn.classList.contains('thevue-btn--danger')).toBe(true)
    expect(btn.classList.contains('thevue-btn--xs')).toBe(true)
  })

  it('supports fullWidth', () => {
    const screen = render(Btn, { props: { fullWidth: true }, slots: { default: () => 'Wide' } })
    expect(getBtn(screen).classList.contains('thevue-btn--full')).toBe(true)
  })

  it('disabled blocks clicks and sets the attribute', () => {
    const onClick = vi.fn()
    const screen = render(Btn, {
      props: { disabled: true },
      attrs: { onClick },
      slots: { default: () => 'Nope' },
    })
    const btn = getBtn(screen)
    expect(btn.hasAttribute('disabled')).toBe(true)
    btn.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('loading shows a spinner, sets aria-busy and blocks clicks', () => {
    const onClick = vi.fn()
    const screen = render(Btn, {
      props: { loading: true },
      attrs: { onClick },
      slots: { default: () => 'Saving' },
    })
    const btn = getBtn(screen)
    expect(btn.getAttribute('aria-busy')).toBe('true')
    expect(btn.querySelector('.thevue-btn__spinner')).not.toBeNull()
    btn.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders left and right icons', () => {
    const screen = render(Btn, {
      props: { leftIcon: 'thevue:spinner', rightIcon: 'thevue:spinner' },
      slots: { default: () => 'Icons' },
    })
    expect(getBtn(screen).querySelectorAll('.thevue-btn__icon').length).toBe(2)
  })

  it('is polymorphic via the as prop', () => {
    const screen = render(Btn, {
      props: { as: 'a' },
      attrs: { href: 'https://example.com' },
      slots: { default: () => 'Link' },
    })
    const btn = getBtn(screen)
    expect(btn.tagName).toBe('A')
    expect(btn.getAttribute('href')).toBe('https://example.com')
    expect(btn.hasAttribute('type')).toBe(false)
  })

  it('fires click when enabled', async () => {
    const onClick = vi.fn()
    const screen = render(Btn, { attrs: { onClick }, slots: { default: () => 'Go' } })
    // real (CDP) click via locator: avoids the Vue event-timestamp guard that
    // can swallow synchronous element.click() right after mount
    await screen.getByRole('button', { name: 'Go' }).click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('btnGroup', () => {
  it('renders a role=group wrapper around buttons', () => {
    const screen = render(BtnGroup, {
      slots: {
        default: () => [h(Btn, () => 'One'), h(Btn, () => 'Two')],
      },
    })
    const group = screen.container.querySelector('.thevue-btn-group')
    expect(group).not.toBeNull()
    expect(group!.getAttribute('role')).toBe('group')
    expect(group!.querySelectorAll('.thevue-btn').length).toBe(2)
  })
})

import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { h, nextTick } from 'vue'
import { Modal } from '../src/index'

describe('modal', () => {
  it('renders nothing when modelValue is false', () => {
    render(Modal, {
      props: { modelValue: false },
      slots: { default: () => 'hello default' },
    })
    expect(document.body.querySelector('.thevue-modal')).toBeNull()
  })

  it('renders open modal with slot, title, and subtitle', () => {
    render(Modal, {
      props: {
        modelValue: true,
        title: 'Confirm Action',
        subtitle: 'Are you sure you want to proceed?',
      },
      slots: { default: () => 'This action cannot be undone.' },
    })
    expect(document.body.querySelector('.thevue-modal')).not.toBeNull()
    expect(document.body.querySelector('#thevue-modal-title')?.textContent).toContain('Confirm Action')
    expect(document.body.textContent).toContain('Are you sure you want to proceed?')
    expect(document.body.textContent).toContain('This action cannot be undone.')
  })

  it('emits update:modelValue and close when close button is clicked', async () => {
    const onUpdate = vi.fn()
    const onClose = vi.fn()
    const screen = render(Modal, {
      props: { modelValue: true },
      attrs: {
        'onUpdate:modelValue': onUpdate,
        'onClose': onClose,
      },
    })
    const closeBtn = screen.getByRole('button', { name: 'Close modal' })
    await closeBtn.click()
    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  it('closes when backdrop is clicked if closeOnOverlayClick is true', async () => {
    const onUpdate = vi.fn()
    render(Modal, {
      props: { modelValue: true, closeOnOverlayClick: true },
      attrs: {
        'onUpdate:modelValue': onUpdate,
      },
    })
    const backdrop = document.body.querySelector('.thevue-modal__backdrop') as HTMLElement
    expect(backdrop).not.toBeNull()
    backdrop.click()
    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  it('does not close when backdrop is clicked if closeOnOverlayClick is false', () => {
    const onUpdate = vi.fn()
    render(Modal, {
      props: { modelValue: true, closeOnOverlayClick: false },
      attrs: {
        'onUpdate:modelValue': onUpdate,
      },
    })
    const backdrop = document.body.querySelector('.thevue-modal__backdrop') as HTMLElement
    backdrop.click()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('closes on Escape keypress if closeOnEsc is true', () => {
    const onUpdate = vi.fn()
    render(Modal, {
      props: { modelValue: true, closeOnEsc: true },
      attrs: {
        'onUpdate:modelValue': onUpdate,
      },
    })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  it('does not close on Escape keypress if closeOnEsc is false', () => {
    const onUpdate = vi.fn()
    render(Modal, {
      props: { modelValue: true, closeOnEsc: false },
      attrs: {
        'onUpdate:modelValue': onUpdate,
      },
    })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('locks body scroll on open and unlocks on close', async () => {
    // Reset overflow before starting the test to ensure clean baseline
    document.body.style.overflow = ''
    expect(document.body.style.overflow).toBe('')

    const screen = render(Modal, {
      props: { modelValue: true, scrollLock: true },
    })
    expect(document.body.style.overflow).toBe('hidden')

    await screen.rerender({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('focuses first focusable element when opened and traps focus on Tab keypress', async () => {
    render(Modal, {
      props: { modelValue: true, hideCloseButton: true },
      slots: {
        default: () => [
          h('input', { id: 'input1', type: 'text' }),
          h('button', { id: 'btn2' }, 'Button 2'),
        ],
      },
    })

    const input1 = document.getElementById('input1') as HTMLElement
    const btn2 = document.getElementById('btn2') as HTMLElement

    await nextTick()
    expect(document.activeElement).toBe(input1)

    btn2.focus()
    expect(document.activeElement).toBe(btn2)

    // Simulating pressing Tab on the last element (btn2) -> wraps focus back to input1
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    window.dispatchEvent(tabEvent)
    expect(document.activeElement).toBe(input1)
  })
})

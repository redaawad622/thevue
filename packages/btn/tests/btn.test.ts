import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Btn } from '../src/index'

describe('btn', () => {
  it('renders its slot content', () => {
    const screen = render(Btn, {
      slots: { default: () => 'hello' },
    })
    expect(screen.container.querySelector('.thevue-btn')).not.toBeNull()
    expect(screen.container.textContent).toContain('hello')
  })
})

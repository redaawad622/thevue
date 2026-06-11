import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Thevue } from '../src/index'

describe('thevue bundle plugin', () => {
  it('registers components globally', () => {
    const TestComponent = {
      template: `
        <div>
          <Btn data-testid="global-btn">Click me</Btn>
        </div>
      `,
    }

    // Render WITH global plugin registration (TDD Green)
    const screen = render(TestComponent, {
      global: {
        plugins: [Thevue],
      },
    })

    const btn = screen.container.querySelector('button.thevue-btn')
    expect(btn).not.toBeNull()
    expect(btn!.textContent).toBe('Click me')
  })
})

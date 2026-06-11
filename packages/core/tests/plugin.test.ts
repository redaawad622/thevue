import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, h } from 'vue'
import { darkTheme, ThevuePlugin, useTheme } from '../src/index'

const Probe = defineComponent({
  setup() {
    const { theme, isDark, setDark } = useTheme()
    return () => h('button', { onClick: () => setDark(!isDark.value) }, `${theme.value.name}:${isDark.value}`)
  },
})

afterEach(() => {
  document.getElementById('thevue-tokens')?.remove()
  document.documentElement.removeAttribute('data-theme')
})

describe('thevuePlugin', () => {
  it('injects a style tag with the token CSS variables', () => {
    render(Probe, { global: { plugins: [ThevuePlugin] } })
    const style = document.getElementById('thevue-tokens')
    expect(style).not.toBeNull()
    expect(style!.textContent).toContain('--thevue-color-primary-500')
    expect(style!.textContent).toContain('[data-theme="dark"]')
  })

  it('exposes reactive theme state through useTheme', () => {
    const screen = render(Probe, { global: { plugins: [ThevuePlugin] } })
    expect(screen.container.textContent).toBe('light:false')
  })

  it('setDark toggles the data-theme attribute on <html>', async () => {
    const screen = render(Probe, { global: { plugins: [ThevuePlugin] } })
    await screen.getByRole('button').click()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(screen.container.textContent).toBe('dark:true')
  })

  it('accepts a custom default theme via options', () => {
    const screen = render(Probe, {
      global: { plugins: [[ThevuePlugin, { theme: darkTheme }]] },
    })
    expect(screen.container.textContent).toBe('dark:true')
  })
})

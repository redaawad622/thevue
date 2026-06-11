import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, h } from 'vue'
import { createTheme, ThemeProvider, useTheme } from '../src/index'

describe('themeProvider', () => {
  it('applies the theme variables as inline style on its root element', () => {
    const theme = createTheme({ tokens: { colors: { primary: { 500: '#123456' } } } })
    const screen = render(ThemeProvider, {
      props: { theme },
      slots: { default: () => h('span', 'hello') },
    })
    const root = screen.container.querySelector<HTMLElement>('.thevue-theme-provider')
    expect(root).not.toBeNull()
    expect(root!.style.getPropertyValue('--thevue-color-primary-500')).toBe('#123456')
    expect(root!.textContent).toContain('hello')
  })

  it('provides the theme to descendants via useTheme', () => {
    const theme = createTheme({ name: 'scoped-brand' })
    const Probe = defineComponent({
      setup() {
        const { theme: current } = useTheme()
        return () => h('i', current.value.name)
      },
    })
    const screen = render(ThemeProvider, {
      props: { theme },
      slots: { default: () => h(Probe) },
    })
    expect(screen.container.textContent).toBe('scoped-brand')
  })
})

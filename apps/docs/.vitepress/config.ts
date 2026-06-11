import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'thevue',
  description: 'A modular, tree-shakeable Vue 3 component framework',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: { text: '⚡ thevue' },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/core' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Theming & Tokens', link: '/guide/theming' },
          { text: 'Contributing', link: '/guide/contributing' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Core (Theming & Tokens)', link: '/components/core' },
          { text: 'Tokens Reference', link: '/components/tokens' },
          { text: 'Icons', link: '/components/icons' },
          { text: 'Button', link: '/components/btn' },
          { text: 'Data Table', link: '/components/table' },
          { text: 'Column API Reference', link: '/components/column-api' },
          { text: 'Aggregate Bundle (@thevue/vue)', link: '/components/vue' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/redaawad622/thevue' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 thevue Team',
    },
  },
})

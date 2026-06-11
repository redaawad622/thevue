# Getting Started

`thevue` is a **modular, tree-shakeable Vue 3 component framework** designed with modern, premium aesthetics and token-driven styles.

Every component in the framework is developed and published as an **independent npm package** (e.g. `@thevue/btn`, `@thevue/table`). They all consume design tokens and system parameters from a shared core package (`@thevue/core`).

---

## Core Philosophy

1. **Modular Independence**: Consumers can opt to install the entire suite or just a single component, minimizing the final build footprint.
2. **Tokens-Only Styling**: Component layouts are driven by plain CSS and CSS Custom Properties (`--thevue-*`). The framework contains no Tailwind CSS, utility class frameworks, or hardcoded hexadecimal colors.
3. **Rigorous Quality**: Every feature is developed under strict Test-Driven Development (TDD) guidelines and validated inside a real browser environment.
4. **Strict Strictness**: Built with Vue 3.5, TypeScript 6 strict mode, and Vite library bundles.

---

## What Next?

- **[Installation Guide](./installation.md)**: Pick your preferred installation strategy (aggregate bundle vs. single component).
- **[Theming & Tokens](./theming.md)**: Explore the `--thevue-*` CSS variables and custom theming capabilities.
- **[Contributing](./contributing.md)**: Read our onboard rules and gate sequence criteria.

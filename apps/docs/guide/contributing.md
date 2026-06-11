# Contributing Guide

Thank you for contributing to `thevue`! To maintain codebase consistency, code quality, and strict package isolation, we follow a set of non-negotiable architectural rules.

---

## Architectural Layers

Packages must only import dependencies from layers **below** them. Atomic components at **Layer 2 (L2)** must never import each other to avoid circular dependencies and ensure they can be used standalone.

```
L0  @thevue/core    Design tokens, theme engine, CSS custom properties
L1  @thevue/icons   Icon components based on Iconify + custom registry
L2  components       @thevue/btn, @thevue/table (isolated components)
L3  blocks           Future dashboard, page template layouts (can use L2)
L3  @thevue/vue      Convenience framework bundle (re-exports everything)
```

---

## Creating a New Package

Never hand-roll a package's directory or config files. Always use our generator script from the repository root:

```powershell
# Create an atomic component
pnpm create-package --name dialog --display-name "Dialog" --layer component

# Create a block package that depends on btn and table
pnpm create-package --name login-card --display-name "LoginCard" --layer block --deps btn,table
```

The generator will scaffold the ESM configurations, Vite configs, Vitest testing suites, TypeScript projects, and workspace dependency links automatically.

---

## The Gate (Mandatory Pre-Commit Checks)

Before pushing any changes to `main`, you **must** run the following gate sequence checks from the workspace root (`D:\thevue`):

1. **Build**: Run `pnpm build` to compile all packages and verify type-checking completes without error.
2. **Test**: Run `pnpm test` to execute all Vitest browser-mode suites.
3. **Format & Lint**: Run `pnpm exec eslint . --fix` followed by `pnpm lint` to ensure code style is clean.
4. **Documentation**: Create or update the relevant `.md` READMEs in the changed packages.
5. **Git Commit**: Commit with the subject style `Phase N: <package> — <summary>` and end the commit body with:
   `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

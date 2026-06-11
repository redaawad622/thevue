const customIcons = new Map<string, string>()

export interface IconRegistry {
  /** Register a raw `<svg>…</svg>` string under a name */
  register: (name: string, svg: string) => void
  /** Register several icons at once */
  registerAll: (icons: Record<string, string>) => void
  unregister: (name: string) => void
  has: (name: string) => boolean
  /** All registered icon names */
  names: () => string[]
}

/** Resolves a custom icon's SVG markup, or undefined if not registered. */
export function resolveCustomIcon(name: string): string | undefined {
  return customIcons.get(name)
}

/**
 * Global registry for project-specific SVG icons. Registered names take
 * precedence over Iconify resolution in `<Icon>`.
 */
export function useIconRegistry(): IconRegistry {
  return {
    register: (name, svg) => {
      customIcons.set(name, svg)
    },
    registerAll: (icons) => {
      for (const [name, svg] of Object.entries(icons))
        customIcons.set(name, svg)
    },
    unregister: (name) => {
      customIcons.delete(name)
    },
    has: name => customIcons.has(name),
    names: () => [...customIcons.keys()],
  }
}

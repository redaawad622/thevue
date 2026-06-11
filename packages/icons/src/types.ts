export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps {
  /**
   * Icon name. Either an Iconify name (`collection:icon`, e.g. `mdi:home`)
   * or a name registered through `useIconRegistry()`.
   */
  name: string
  /**
   * Token size (maps to `--thevue-font-size-*`) or a pixel number.
   * @default 'md'
   */
  size?: IconSize | number
  /** @default 'currentColor' */
  color?: string
  /** Continuously rotate the icon (e.g. loading spinners) */
  spin?: boolean
  /** Mirror the icon */
  flip?: 'horizontal' | 'vertical' | 'both'
}

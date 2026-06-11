import type { Component } from 'vue'

export type BtnVariant = 'solid' | 'outline' | 'ghost' | 'link' | 'soft'

export type BtnColor = 'primary' | 'neutral' | 'success' | 'warning' | 'danger'

export type BtnSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface BtnProps {
  /** @default 'solid' */
  variant?: BtnVariant
  /** @default 'primary' */
  color?: BtnColor
  /** @default 'md' */
  size?: BtnSize
  /** Shows a spinner and blocks interaction */
  loading?: boolean
  disabled?: boolean
  /** Stretch to the container's width */
  fullWidth?: boolean
  /** Icon name (Iconify or registered) rendered before the label */
  leftIcon?: string
  /** Icon name rendered after the label */
  rightIcon?: string
  /**
   * Element or component to render as — e.g. `'a'` or `RouterLink`.
   * @default 'button'
   */
  as?: string | Component
  /**
   * Native button type, applied only when rendering a real `<button>`.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
}

export interface BtnGroupProps {
  /** Accessible label for the group */
  label?: string
}

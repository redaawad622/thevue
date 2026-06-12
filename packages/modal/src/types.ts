export interface ModalProps {
  /**
   * Controls the open/close state of the modal.
   * Supports two-way binding using `v-model`.
   */
  modelValue?: boolean

  /**
   * Title text shown in the modal header.
   */
  title?: string

  /**
   * Subtitle or secondary description text shown in the modal header.
   */
  subtitle?: string

  /**
   * Size variant of the modal.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  /**
   * Whether clicking the backdrop overlay closes the modal.
   * @default true
   */
  closeOnOverlayClick?: boolean

  /**
   * Whether pressing the Escape key closes the modal.
   * @default true
   */
  closeOnEsc?: boolean

  /**
   * Whether to teleport the modal markup to another DOM element (e.g. body).
   * @default true
   */
  teleport?: boolean

  /**
   * Target element/selector to teleport the modal container to.
   * @default 'body'
   */
  teleportTo?: string | HTMLElement

  /**
   * Whether to hide the top-right close icon button.
   * @default false
   */
  hideCloseButton?: boolean

  /**
   * Whether to prevent background page scrolling while the modal is open.
   * @default true
   */
  scrollLock?: boolean
}

export interface ModalEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'open'): void
}

import { useIconRegistry } from '@thevue/icons'

const SPINNER_SVG = '<svg viewBox="0 0 24 24" fill="none">'
  + '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="4" />'
  + '<path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="4" stroke-linecap="round" />'
  + '</svg>'

/** Registers the built-in loading spinner icon (idempotent). */
export function registerSpinnerIcon(): void {
  const registry = useIconRegistry()
  if (!registry.has('thevue:spinner'))
    registry.register('thevue:spinner', SPINNER_SVG)
}

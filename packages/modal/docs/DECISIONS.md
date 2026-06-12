# Architectural Decisions — `@thevue/modal`

This document details the engineering and design choices made during the creation of `@thevue/modal`.

## 1. Focus Trapping: Native Event Handlers vs External Dependencies

### Decision
We implemented focus trapping inside the component utilizing keyboard keydown listeners (`Tab` and `Shift + Tab`) and document query selections of focusable nodes instead of pulling heavy libraries like `focus-trap` or `focus-trap-js`.

### Rationale
- **Size**: External focus trap libraries add bundle bytes. Native element querying handles 99% of UI needs.
- **Tree-shaking**: No third-party modules means `@thevue/modal` remains lightweight, carrying only Vue-specific footprint.
- **Strict Isolation**: Follows monorepo rules. The component depends only on `@thevue/core` and `@thevue/icons`.

---

## 2. Animation & Transitions: Single Outer Wrapper Transition

### Decision
A single `<Transition name="thevue-modal-fade">` is applied to the outermost wrapper, with sub-selector CSS rules transitioning inner elements (backdrop opacity and modal scale/translation).

### Rationale
- **Simplicity**: Double transitions (one for overlay, one for dialog card) require synchronization and delay triggers (e.g. `TransitionGroup` or nested elements hooks) that can cause flashes or mismatch states.
- **Fluidity**: Parent animation classes allow parallel, smooth, and declarative animation rules for both the background mask and dialogue scale/location:
  ```css
  .thevue-modal-fade-enter-active .thevue-modal {
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease;
  }
  ```

---

## 3. Scroll Locking on Viewport Body

### Decision
When the modal opens, we apply `overflow: hidden` to `document.body` (if `scrollLock` is true). When closing, we query the remaining modals in the DOM and only reset the body overflow to `''` if no other modals are active:
```ts
const otherOpenModals = document.querySelectorAll('.thevue-modal__wrapper').length
if (otherOpenModals <= 1) {
  document.body.style.overflow = ''
}
```

### Rationale
- **Nested Modals Support**: If a child modal is opened from a parent modal, closing the child modal must not restore scrolling on the body while the parent modal is still visible. Checking the number of active modal wrappers avoids this regression.

---

## 4. Teleportation by Default

### Decision
Modals teleport to `body` by default to avoid issues with parent containers that have `overflow: hidden` or custom stacking contexts (z-index constraints).

### Rationale
- **Robustness**: Teleporting to body places the modal at the top level, ensuring backdrop filters, overlay positioning, and elevation shadows render without clipping.
- **Customizability**: A `:disabled="!teleport"` option allows developers to keep the modal collocated in the markup for scoped styles or customized layouts.

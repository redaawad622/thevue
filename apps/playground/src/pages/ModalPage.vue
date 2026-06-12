<script setup lang="ts">
import { Btn, Modal } from '@thevue/vue'
import { ref } from 'vue'

const showBasic = ref(false)
const showCustomHeader = ref(false)
const showNestedParent = ref(false)
const showNestedChild = ref(false)
const showFormTrap = ref(false)

// Sizes demo
const showSize = ref<Record<string, boolean>>({
  sm: false,
  md: false,
  lg: false,
  xl: false,
  full: false,
})

// Options demo
const closeOnOverlay = ref(true)
const closeOnEsc = ref(true)
const showOptionsModal = ref(false)

const formEmail = ref('')
const formName = ref('')
const formSubmitted = ref(false)

function submitForm() {
  if (formEmail.value && formName.value) {
    formSubmitted.value = true
    setTimeout(() => {
      formSubmitted.value = false
      showFormTrap.value = false
      formEmail.value = ''
      formName.value = ''
    }, 1500)
  }
}
</script>

<template>
  <div class="modal-showcase">
    <!-- Basic Modals -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Basic Usage & Slots
      </h2>
      <div class="showcase-grid grid-2">
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Default Modal
          </h3>
          <p class="showcase-desc">
            A clean, accessible modal window with title, subtitle, close button, and footer actions.
          </p>
          <Btn @click="showBasic = true">
            Open Standard Modal
          </Btn>
        </div>

        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Custom Header / Layout
          </h3>
          <p class="showcase-desc">
            Using named slots to fully customize the header and add icons or unique elements.
          </p>
          <Btn variant="outline" color="neutral" @click="showCustomHeader = true">
            Open Custom Header Modal
          </Btn>
        </div>
      </div>
    </section>

    <!-- Modal Sizes -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Modal Sizes
      </h2>
      <div class="showcase-card">
        <p class="showcase-desc">
          Select a size to view the dialog proportions relative to the screen width.
        </p>
        <div class="flex-wrap">
          <Btn variant="soft" color="primary" @click="showSize.sm = true">
            Small (sm)
          </Btn>
          <Btn variant="soft" color="neutral" @click="showSize.md = true">
            Medium (md)
          </Btn>
          <Btn variant="soft" color="success" @click="showSize.lg = true">
            Large (lg)
          </Btn>
          <Btn variant="soft" color="warning" @click="showSize.xl = true">
            Extra Large (xl)
          </Btn>
          <Btn variant="soft" color="danger" @click="showSize.full = true">
            Full Screen (full)
          </Btn>
        </div>
      </div>
    </section>

    <!-- Focus Trap & Forms -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Accessibility & Interaction
      </h2>
      <div class="showcase-grid grid-3">
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Keyboard Focus Trap
          </h3>
          <p class="showcase-desc">
            Locks focus inside the modal. Tabbing past the last element wraps focus back to the first.
          </p>
          <Btn color="success" @click="showFormTrap = true">
            Open Form Dialog
          </Btn>
        </div>

        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Overlay & Key Closures
          </h3>
          <p class="showcase-desc">
            Toggle closure rules for backdrop clicks and Escape key down events.
          </p>
          <div class="controls-row">
            <label class="control-label">
              <input v-model="closeOnOverlay" type="checkbox">
              Overlay Click Close
            </label>
            <label class="control-label">
              <input v-model="closeOnEsc" type="checkbox">
              ESC Key Close
            </label>
          </div>
          <Btn variant="outline" color="neutral" @click="showOptionsModal = true">
            Test Closure Configuration
          </Btn>
        </div>

        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Nested & Stacked Modals
          </h3>
          <p class="showcase-desc">
            Verify stacking orders (z-indices) and click handling on overlapping backdrops.
          </p>
          <Btn variant="outline" color="neutral" @click="showNestedParent = true">
            Open Nested Modals Demo
          </Btn>
        </div>
      </div>
    </section>

    <!-- Modals Markup -->

    <!-- Basic Modal -->
    <Modal
      v-model="showBasic"
      title="Standard Information"
      subtitle="This is a simple subtitle to describe the dialog context"
    >
      <p>This is the standard content inside the body slot of the modal. By default, it wraps cleanly and supports scroll overflow if the content exceeds viewport height. Focus is trapped automatically.</p>
      <template #footer>
        <Btn variant="ghost" color="neutral" @click="showBasic = false">
          Cancel
        </Btn>
        <Btn color="primary" @click="showBasic = false">
          Acknowledge
        </Btn>
      </template>
    </Modal>

    <!-- Custom Header Modal -->
    <Modal v-model="showCustomHeader" :hide-close-button="true">
      <template #header>
        <div class="custom-header-layout">
          <div class="custom-header-icon">
            <span class="emoji-icon">🔔</span>
          </div>
          <div>
            <h3 class="custom-header-title">
              System Alert
            </h3>
            <p class="custom-header-subtitle">
              Urgent notifications requiring attention
            </p>
          </div>
        </div>
      </template>
      <p>This modal hides the default close button and header, utilizing custom header layouts. Focus will land on the first action button in the footer.</p>
      <template #footer>
        <Btn color="neutral" @click="showCustomHeader = false">
          Dismiss
        </Btn>
      </template>
    </Modal>

    <!-- Sizes Modals -->
    <Modal v-model="showSize.sm" size="sm" title="Small Dialog" subtitle="Size: sm (384px)">
      <p>Ideal for simple confirmations, alerts, or small action forms.</p>
      <template #footer>
        <Btn @click="showSize.sm = false">
          Close
        </Btn>
      </template>
    </Modal>

    <Modal v-model="showSize.md" size="md" title="Medium Dialog" subtitle="Size: md (512px)">
      <p>The standard modal size. Ideal for general forms, quick setups, and informative lists.</p>
      <template #footer>
        <Btn @click="showSize.md = false">
          Close
        </Btn>
      </template>
    </Modal>

    <Modal v-model="showSize.lg" size="lg" title="Large Dialog" subtitle="Size: lg (768px)">
      <p>Great for detailed configuration panels, small tables, and medium sized workflows.</p>
      <template #footer>
        <Btn @click="showSize.lg = false">
          Close
        </Btn>
      </template>
    </Modal>

    <Modal v-model="showSize.xl" size="xl" title="Extra Large Dialog" subtitle="Size: xl (1024px)">
      <p>Suitable for media galleries, multi-step wizards, and broad dashboards.</p>
      <template #footer>
        <Btn @click="showSize.xl = false">
          Close
        </Btn>
      </template>
    </Modal>

    <Modal v-model="showSize.full" size="full" title="Full Screen Dialog" subtitle="Size: full (100vw/vh)">
      <p>Replaces the whole viewport area. Ideal for text editors, complex drawing boards, or heavy focus-oriented features.</p>
      <template #footer>
        <Btn @click="showSize.full = false">
          Close
        </Btn>
      </template>
    </Modal>

    <!-- Form Trap Modal -->
    <Modal v-model="showFormTrap" title="User Signup Form" subtitle="Ensure to fill out all the input fields">
      <form class="demo-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name-input">Full Name</label>
          <input id="name-input" v-model="formName" type="text" required class="demo-input" placeholder="John Doe">
        </div>
        <div class="form-group">
          <label for="email-input">Email Address</label>
          <input id="email-input" v-model="formEmail" type="email" required class="demo-input" placeholder="john@example.com">
        </div>
        <div v-if="formSubmitted" class="form-success">
          ✓ Form submitted successfully! Closing...
        </div>
        <div class="form-actions-row">
          <Btn variant="ghost" color="neutral" type="button" @click="showFormTrap = false">
            Cancel
          </Btn>
          <Btn color="success" type="submit">
            Submit Form
          </Btn>
        </div>
      </form>
    </Modal>

    <!-- Options Modal -->
    <Modal
      v-model="showOptionsModal"
      title="Dynamic Configuration"
      subtitle="Testing specific interactions"
      :close-on-overlay-click="closeOnOverlay"
      :close-on-esc="closeOnEsc"
    >
      <div class="modal-options-status">
        <p>Current Rules Applied:</p>
        <ul>
          <li>Backdrop Overlay Click Close: <strong>{{ closeOnOverlay ? 'ENABLED' : 'DISABLED' }}</strong></li>
          <li>Escape Key Close: <strong>{{ closeOnEsc ? 'ENABLED' : 'DISABLED' }}</strong></li>
        </ul>
        <p>Try clicking outside or pressing <kbd>ESC</kbd> to verify closures.</p>
      </div>
      <template #footer>
        <Btn color="primary" @click="showOptionsModal = false">
          Close Manually
        </Btn>
      </template>
    </Modal>

    <!-- Stacked / Nested Modals -->
    <Modal v-model="showNestedParent" title="Parent Modal" subtitle="First level stacking context">
      <p>This is the parent modal. Click below to open a child modal on top. Body scroll lock and focus trap handles parent stacks correctly.</p>
      <Btn color="primary" @click="showNestedChild = true">
        Open Child Modal
      </Btn>
      <template #footer>
        <Btn variant="outline" color="neutral" @click="showNestedParent = false">
          Close Parent
        </Btn>
      </template>
    </Modal>

    <Modal v-model="showNestedChild" title="Child Modal" subtitle="Second level stacking context" size="sm">
      <p>This child modal sits on top of the parent. The backdrop layer is darker, and focus trapping is now locked exclusively to this window.</p>
      <template #footer>
        <Btn color="danger" @click="showNestedChild = false">
          Close Child
        </Btn>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.modal-showcase {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-6);
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.showcase-desc {
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-subtle);
  margin-top: 0;
  margin-bottom: var(--thevue-space-4);
  line-height: var(--thevue-leading-relaxed);
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--thevue-space-3);
  align-items: center;
}

.controls-row {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-2);
  margin-bottom: var(--thevue-space-4);
}

.control-label {
  display: inline-flex;
  align-items: center;
  gap: var(--thevue-space-2);
  font-size: var(--thevue-font-size-sm);
  font-weight: var(--thevue-font-weight-medium);
  cursor: pointer;
}

.custom-header-layout {
  display: flex;
  align-items: center;
  gap: var(--thevue-space-3);
}

.custom-header-icon {
  background-color: var(--thevue-color-warning-50);
  border: 1px solid var(--thevue-color-warning-200);
  padding: var(--thevue-space-2);
  border-radius: var(--thevue-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-header-title {
  margin: 0;
  font-size: var(--thevue-font-size-md);
  font-weight: var(--thevue-font-weight-bold);
  color: var(--thevue-color-warning-700);
}

.custom-header-subtitle {
  margin: 0;
  font-size: var(--thevue-font-size-xs);
  color: var(--thevue-text-subtle);
}

.demo-form {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-1);
}

.form-group label {
  font-size: var(--thevue-font-size-xs);
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-subtle);
}

.demo-input {
  padding: var(--thevue-space-2) var(--thevue-space-3);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  background-color: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  font-family: var(--thevue-font-sans);
  font-size: var(--thevue-font-size-sm);
}

.demo-input:focus {
  outline: 2px solid var(--thevue-color-primary-500);
  border-color: transparent;
}

.form-success {
  background-color: var(--thevue-color-success-50);
  color: var(--thevue-color-success-700);
  padding: var(--thevue-space-2);
  border-radius: var(--thevue-radius-md);
  font-size: var(--thevue-font-size-sm);
  font-weight: var(--thevue-font-weight-medium);
  text-align: center;
}

.form-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: var(--thevue-space-2);
  margin-top: var(--thevue-space-2);
}

.modal-options-status {
  font-size: var(--thevue-font-size-sm);
}

.modal-options-status ul {
  padding-left: var(--thevue-space-4);
  margin: var(--thevue-space-2) 0;
}

.modal-options-status kbd {
  background-color: var(--thevue-bg-muted);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-sm);
  padding: 0 var(--thevue-space-1);
  font-size: var(--thevue-font-size-xs);
  font-family: var(--thevue-font-mono);
}
</style>

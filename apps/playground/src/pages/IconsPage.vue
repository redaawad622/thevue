<script setup lang="ts">
import { Icon, useIconRegistry } from '@thevue/vue'
import { ref } from 'vue'

// Register a custom SVG icon in the registry
const registry = useIconRegistry()
registry.register('custom:rocket', `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5s3 2.5 10 2.5 10-.19 10-2.5-1-4.24-2.5-5.5" />
    <path d="M12 2C7.5 2 4 6.5 4 11c0 1.25.25 2.44.71 3.53L12 22l7.29-7.47c.46-1.09.71-2.28.71-3.53 0-4.5-3.5-9-8-9Z" />
    <circle cx="12" cy="10" r="2" />
  </svg>
`)
registry.register('custom:sparkles', `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
  </svg>
`)

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const iconColors = [
  { label: 'Default', value: 'currentColor' },
  { label: 'Primary', value: 'var(--thevue-color-primary-600)' },
  { label: 'Success', value: 'var(--thevue-color-success-600)' },
  { label: 'Warning', value: 'var(--thevue-color-warning-600)' },
  { label: 'Danger', value: 'var(--thevue-color-danger-600)' },
]

const sampleIcons = [
  'octicon:home-16',
  'octicon:gear-16',
  'octicon:heart-fill-16',
  'octicon:info-16',
  'octicon:check-circle-fill-16',
  'octicon:alert-16',
  'octicon:search-16',
  'octicon:trash-16',
]

// Interactive state
const isSpinning = ref(false)
const activeFlip = ref<'horizontal' | 'vertical' | 'both' | undefined>(undefined)
const activeColor = ref('currentColor')
const activeSize = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg')
</script>

<template>
  <div class="icons-showcase">
    <!-- Interactive Demo -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Interactive Icon Sandbox
      </h2>
      <div class="showcase-grid grid-1-3">
        <div class="showcase-card controls-card">
          <h3 class="showcase-card-title">
            Controls
          </h3>

          <div class="control-group">
            <span class="control-label">Size</span>
            <div class="radio-group">
              <label v-for="size in sizes" :key="size" class="radio-label">
                <input v-model="activeSize" type="radio" :value="size">
                <span>{{ size.toUpperCase() }}</span>
              </label>
            </div>
          </div>

          <div class="control-group">
            <span class="control-label">Color</span>
            <select v-model="activeColor" class="select-control">
              <option v-for="color in iconColors" :key="color.value" :value="color.value">
                {{ color.label }}
              </option>
            </select>
          </div>

          <div class="control-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="isSpinning" type="checkbox">
              <span>Spin Animation</span>
            </label>
          </div>

          <div class="control-group">
            <span class="control-label">Flip</span>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model="activeFlip" type="radio" :value="undefined">
                <span>None</span>
              </label>
              <label class="radio-label">
                <input v-model="activeFlip" type="radio" value="horizontal">
                <span>Horiz</span>
              </label>
              <label class="radio-label">
                <input v-model="activeFlip" type="radio" value="vertical">
                <span>Vert</span>
              </label>
              <label class="radio-label">
                <input v-model="activeFlip" type="radio" value="both">
                <span>Both</span>
              </label>
            </div>
          </div>
        </div>

        <div class="showcase-card preview-card">
          <h3 class="showcase-card-title">
            Live Preview
          </h3>
          <div class="preview-display">
            <div class="preview-item">
              <Icon
                name="octicon:zap-16"
                :size="activeSize"
                :color="activeColor"
                :spin="isSpinning"
                :flip="activeFlip"
              />
              <span class="preview-name">octicon:zap-16</span>
            </div>
            <div class="preview-item">
              <Icon
                name="custom:rocket"
                :size="activeSize"
                :color="activeColor"
                :spin="isSpinning"
                :flip="activeFlip"
              />
              <span class="preview-name">custom:rocket (Custom SVG)</span>
            </div>
            <div class="preview-item">
              <Icon
                name="custom:sparkles"
                :size="activeSize"
                :color="activeColor"
                :spin="isSpinning"
                :flip="activeFlip"
              />
              <span class="preview-name">custom:sparkles (Custom SVG)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Library Samples -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Iconify Library Samples
      </h2>
      <div class="showcase-card">
        <div class="icon-grid">
          <div v-for="iconName in sampleIcons" :key="iconName" class="icon-grid-item">
            <div class="icon-grid-preview">
              <Icon :name="iconName" size="lg" />
            </div>
            <span class="icon-grid-name">{{ iconName }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Sizes Reference -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Size Scale (xs .. xl)
      </h2>
      <div class="showcase-card">
        <div class="size-scale-row">
          <div v-for="size in sizes" :key="size" class="size-scale-item">
            <span class="size-scale-label">{{ size.toUpperCase() }}</span>
            <div class="size-scale-icon-container">
              <Icon name="octicon:star-fill-16" :size="size" color="var(--thevue-color-warning-500)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.icons-showcase {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-6);
}

.grid-1-3 {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--thevue-space-4);
}

@media (max-width: 768px) {
  .grid-1-3 {
    grid-template-columns: 1fr;
  }
}

.controls-card {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-4);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-2);
}

.control-label {
  font-size: var(--thevue-font-size-xs);
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-subtle);
  text-transform: uppercase;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--thevue-space-2);
}

.radio-label, .checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: var(--thevue-space-2);
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-base);
  cursor: pointer;
}

.select-control {
  padding: var(--thevue-space-2);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  background: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  font-size: var(--thevue-font-size-sm);
}

.preview-card {
  display: flex;
  flex-direction: column;
}

.preview-display {
  display: flex;
  flex-wrap: wrap;
  gap: var(--thevue-space-6);
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  min-height: 200px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--thevue-space-3);
  padding: var(--thevue-space-4);
  border-radius: var(--thevue-radius-lg);
  border: 1px dashed var(--thevue-border-base);
  width: 180px;
}

.preview-name {
  font-size: var(--thevue-font-size-xs);
  font-family: monospace;
  color: var(--thevue-text-muted);
  text-align: center;
  word-break: break-all;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--thevue-space-4);
}

.icon-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--thevue-space-2);
  padding: var(--thevue-space-3);
  border-radius: var(--thevue-radius-md);
  background: var(--thevue-bg-muted);
  border: 1px solid var(--thevue-border-subtle);
  transition: transform 150ms ease;
}

.icon-grid-item:hover {
  transform: translateY(-2px);
}

.icon-grid-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}

.icon-grid-name {
  font-size: var(--thevue-font-size-xs);
  font-family: monospace;
  color: var(--thevue-text-subtle);
  text-align: center;
  word-break: break-all;
}

.size-scale-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--thevue-space-6);
}

.size-scale-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--thevue-space-3);
}

.size-scale-label {
  font-size: var(--thevue-font-size-xs);
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-subtle);
}

.size-scale-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--thevue-bg-muted);
  border-radius: var(--thevue-radius-md);
  border: 1px solid var(--thevue-border-subtle);
}
</style>

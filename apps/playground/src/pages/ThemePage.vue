<script setup lang="ts">
const colors = ['primary', 'neutral', 'success', 'warning', 'danger'] as const
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const fontSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const
const weights = ['normal', 'medium', 'semibold', 'bold'] as const
const spacings = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const
const radii = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const
const shadows = ['sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <div class="theme-showcase">
    <!-- Color Swatches -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Color Palettes
      </h2>
      <div class="showcase-grid grid-1">
        <div v-for="color in colors" :key="color" class="showcase-card">
          <h3 class="showcase-card-title theme-palette-title">
            {{ color }}
          </h3>
          <div class="palette-ramp">
            <div
              v-for="shade in shades"
              :key="shade"
              class="palette-swatch"
              :style="{ backgroundColor: `var(--thevue-color-${color}-${shade})` }"
            >
              <div class="swatch-info">
                <span class="swatch-shade">{{ shade }}</span>
                <span class="swatch-var">--thevue-color-{{ color }}-{{ shade }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Typography Scale -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Typography & Type Scale
      </h2>
      <div class="showcase-grid grid-2">
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Font Sizes
          </h3>
          <div class="typography-scale">
            <div v-for="size in fontSizes" :key="size" class="type-row">
              <span class="type-label">size-{{ size }}</span>
              <span
                class="type-preview"
                :style="{ fontSize: `var(--thevue-font-size-${size})` }"
              >
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          </div>
        </div>

        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Font Weights & Families
          </h3>
          <div class="type-families-weights">
            <div class="family-item">
              <span class="family-label">Sans-serif Family</span>
              <span class="family-preview font-sans">
                Pack my box with five dozen liquor jugs.
              </span>
            </div>
            <div class="family-item">
              <span class="family-label">Monospace Family</span>
              <span class="family-preview font-mono">
                const framework = 'thevue';
              </span>
            </div>

            <hr class="theme-divider">

            <div v-for="weight in weights" :key="weight" class="weight-row">
              <span class="weight-label">{{ weight }}</span>
              <span
                class="weight-preview"
                :style="{ fontWeight: `var(--thevue-font-weight-${weight})` }"
              >
                thevue weight-{{ weight }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Spacing & Sizing -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Spacing Scale
      </h2>
      <div class="showcase-card">
        <div class="spacing-ramp">
          <div v-for="space in spacings" :key="space" class="space-item">
            <div class="space-info">
              <span class="space-name">space-{{ space }}</span>
              <span class="space-val">{{ space * 4 }}px ({{ space * 0.25 }}rem)</span>
            </div>
            <div class="space-bar-container">
              <div
                class="space-bar"
                :style="{ width: `var(--thevue-space-${space})` }"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Radii & Shadows -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Borders, Radii & Shadows
      </h2>
      <div class="showcase-grid grid-2">
        <!-- Border Radii -->
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Border Radii
          </h3>
          <div class="radii-grid">
            <div v-for="radius in radii" :key="radius" class="radius-item">
              <div
                class="radius-block"
                :style="{ borderRadius: `var(--thevue-radius-${radius})` }"
              />
              <span class="radius-label">radius-{{ radius }}</span>
            </div>
          </div>
        </div>

        <!-- Shadows / Elevation -->
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Shadows & Elevation
          </h3>
          <div class="shadows-list">
            <div
              v-for="shadow in shadows"
              :key="shadow"
              class="shadow-item"
              :style="{ boxShadow: `var(--thevue-shadow-${shadow})` }"
            >
              <span class="shadow-label">shadow-{{ shadow }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.theme-showcase {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-6);
}

.grid-1 {
  grid-template-columns: 1fr;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.theme-palette-title {
  text-transform: capitalize;
  font-weight: var(--thevue-font-weight-semibold);
  font-size: var(--thevue-font-size-md);
  margin-bottom: var(--thevue-space-4);
  color: var(--thevue-text-base) !important;
}

.palette-ramp {
  display: flex;
  flex-direction: column;
  border-radius: var(--thevue-radius-lg);
  overflow: hidden;
  border: 1px solid var(--thevue-border-base);
}

.palette-swatch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--thevue-space-3) var(--thevue-space-4);
  height: 52px;
  box-sizing: border-box;
}

.swatch-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  mix-blend-mode: difference;
  color: #fff;
  font-family: var(--thevue-font-mono);
  font-size: var(--thevue-font-size-xs);
}

.swatch-shade {
  font-weight: var(--thevue-font-weight-semibold);
}

.swatch-var {
  opacity: 0.8;
}

.typography-scale {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-4);
}

.type-row {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-1);
}

.type-label {
  font-size: var(--thevue-font-size-xs);
  font-family: var(--thevue-font-mono);
  color: var(--thevue-text-muted);
}

.type-preview {
  color: var(--thevue-text-base);
  word-break: break-word;
}

.type-families-weights {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-4);
}

.family-item {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-1);
}

.family-label {
  font-size: var(--thevue-font-size-xs);
  color: var(--thevue-text-muted);
}

.family-preview {
  font-size: var(--thevue-font-size-md);
  color: var(--thevue-text-base);
}

.font-sans {
  font-family: var(--thevue-font-sans);
}

.font-mono {
  font-family: var(--thevue-font-mono);
}

.theme-divider {
  border: 0;
  border-top: 1px solid var(--thevue-border-subtle);
  margin: var(--thevue-space-2) 0;
}

.weight-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weight-label {
  font-size: var(--thevue-font-size-sm);
  color: var(--thevue-text-subtle);
  text-transform: capitalize;
}

.weight-preview {
  font-size: var(--thevue-font-size-md);
  color: var(--thevue-text-base);
}

.spacing-ramp {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-3);
}

.space-item {
  display: flex;
  align-items: center;
  gap: var(--thevue-space-4);
}

.space-info {
  display: flex;
  justify-content: space-between;
  width: 180px;
  flex-shrink: 0;
  font-family: var(--thevue-font-mono);
  font-size: var(--thevue-font-size-xs);
  color: var(--thevue-text-subtle);
}

.space-bar-container {
  flex-grow: 1;
  background: var(--thevue-bg-muted);
  height: 20px;
  border-radius: var(--thevue-radius-sm);
  overflow: hidden;
}

.space-bar {
  background: var(--thevue-color-primary-500);
  height: 100%;
}

.radii-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--thevue-space-4);
}

.radius-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--thevue-space-2);
}

.radius-block {
  width: 64px;
  height: 64px;
  background: var(--thevue-color-primary-500);
  border: 1px solid var(--thevue-border-base);
}

.radius-label {
  font-size: var(--thevue-font-size-xs);
  font-family: var(--thevue-font-mono);
  color: var(--thevue-text-subtle);
}

.shadows-list {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-4);
}

.shadow-item {
  background: var(--thevue-bg-subtle);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-md);
  padding: var(--thevue-space-4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow-label {
  font-size: var(--thevue-font-size-sm);
  font-family: var(--thevue-font-mono);
  color: var(--thevue-text-base);
}
</style>

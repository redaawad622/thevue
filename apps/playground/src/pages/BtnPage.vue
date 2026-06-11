<script setup lang="ts">
import { Btn, BtnGroup } from '@thevue/vue'
import { ref } from 'vue'

const isLoading = ref(false)
function toggleLoading() {
  isLoading.value = !isLoading.value
}

const colors = ['primary', 'neutral', 'success', 'warning', 'danger'] as const
const variants = ['solid', 'outline', 'ghost', 'soft', 'link'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <div class="btn-showcase">
    <!-- Variants & Colors Matrix -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Variants & Colors Matrix
      </h2>
      <div class="showcase-card">
        <div class="matrix-grid">
          <div class="matrix-header" />
          <div v-for="color in colors" :key="color" class="matrix-header color-header">
            {{ color }}
          </div>

          <template v-for="variant in variants" :key="variant">
            <div class="matrix-row-label">
              {{ variant }}
            </div>
            <div v-for="color in colors" :key="`${variant}-${color}`" class="matrix-cell">
              <Btn :variant="variant" :color="color">
                Button
              </Btn>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Sizes Showcase -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Sizes
      </h2>
      <div class="showcase-card">
        <div class="size-row">
          <div v-for="size in sizes" :key="size" class="size-item">
            <span class="size-label">{{ size.toUpperCase() }}</span>
            <Btn :size="size">
              Button
            </Btn>
          </div>
        </div>
      </div>
    </section>

    <!-- States Showcase -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        States & Special Options
      </h2>
      <div class="showcase-grid grid-2">
        <!-- Loading & Disabled States -->
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Interactions & States
          </h3>
          <div class="state-controls">
            <Btn variant="outline" color="neutral" @click="toggleLoading">
              Toggle Demo Loading State
            </Btn>
          </div>
          <div class="flex-wrap">
            <Btn :loading="isLoading">
              Default Btn
            </Btn>
            <Btn :loading="isLoading" variant="outline" color="success">
              Outline Success
            </Btn>
            <Btn disabled>
              Disabled Btn
            </Btn>
            <Btn disabled variant="soft" color="danger">
              Disabled Soft Danger
            </Btn>
          </div>
        </div>

        <!-- Full Width -->
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Full Width layout
          </h3>
          <div class="full-width-demo">
            <Btn full-width>
              Full Width Primary Button
            </Btn>
            <Btn full-width variant="outline" color="neutral">
              Full Width Outline Neutral
            </Btn>
          </div>
        </div>
      </div>
    </section>

    <!-- Icons & Polymorphism -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Icons & Polymorphism
      </h2>
      <div class="showcase-grid grid-2">
        <!-- Icons -->
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Icons
          </h3>
          <div class="flex-wrap">
            <Btn left-icon="octicon:heart-fill-16" color="danger">
              Favorite
            </Btn>
            <Btn right-icon="octicon:arrow-right-16" variant="outline">
              Next Page
            </Btn>
            <Btn left-icon="octicon:search-16" variant="ghost" color="neutral" />
            <Btn left-icon="octicon:download-16" right-icon="octicon:check-16" color="success">
              Download Complete
            </Btn>
          </div>
        </div>

        <!-- Polymorphic Anchor -->
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Polymorphism (as="a")
          </h3>
          <div class="flex-wrap">
            <Btn as="a" href="https://github.com/redaawad622/thevue" target="_blank" rel="noopener">
              Open Github Repository
            </Btn>
            <Btn as="a" href="#/theme" variant="outline" color="neutral">
              Go to Theme Tokens
            </Btn>
          </div>
        </div>
      </div>
    </section>

    <!-- Button Groups -->
    <section class="showcase-section">
      <h2 class="showcase-section-title">
        Button Groups
      </h2>
      <div class="showcase-grid grid-2">
        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Standard Group
          </h3>
          <BtnGroup label="Standard group pagination">
            <Btn variant="outline" color="neutral">
              Previous
            </Btn>
            <Btn variant="outline" color="neutral">
              1
            </Btn>
            <Btn variant="outline" color="neutral">
              2
            </Btn>
            <Btn variant="outline" color="neutral">
              3
            </Btn>
            <Btn variant="outline" color="neutral">
              Next
            </Btn>
          </BtnGroup>
        </div>

        <div class="showcase-card">
          <h3 class="showcase-card-title">
            Solid Primary Group
          </h3>
          <BtnGroup label="Primary options">
            <Btn color="primary">
              Left Action
            </Btn>
            <Btn color="primary">
              Middle Action
            </Btn>
            <Btn color="primary">
              Right Action
            </Btn>
          </BtnGroup>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.btn-showcase {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-6);
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.matrix-grid {
  display: grid;
  grid-template-columns: auto repeat(5, 1fr);
  gap: var(--thevue-space-4);
  align-items: center;
  overflow-x: auto;
  padding: var(--thevue-space-2) 0;
}

.matrix-header {
  font-weight: var(--thevue-font-weight-semibold);
  font-size: var(--thevue-font-size-sm);
  text-align: center;
  text-transform: capitalize;
  color: var(--thevue-text-base);
}

.matrix-row-label {
  font-weight: var(--thevue-font-weight-medium);
  font-size: var(--thevue-font-size-sm);
  text-transform: capitalize;
  color: var(--thevue-text-subtle);
}

.matrix-cell {
  display: flex;
  justify-content: center;
}

.size-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--thevue-space-6);
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--thevue-space-2);
}

.size-label {
  font-size: var(--thevue-font-size-xs);
  font-weight: var(--thevue-font-weight-semibold);
  color: var(--thevue-text-subtle);
}

.state-controls {
  margin-bottom: var(--thevue-space-4);
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--thevue-space-3);
  align-items: center;
}

.full-width-demo {
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-3);
}
</style>

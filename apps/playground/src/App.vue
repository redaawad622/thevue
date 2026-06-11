<script setup lang="ts">
import { useTheme } from '@thevue/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BtnPage from './pages/BtnPage.vue'
import IconsPage from './pages/IconsPage.vue'
import TablePage from './pages/TablePage.vue'
import ThemePage from './pages/ThemePage.vue'

const currentHash = ref(window.location.hash || '#/btn')

function updateHash() {
  currentHash.value = window.location.hash || '#/btn'
}

onMounted(() => {
  window.addEventListener('hashchange', updateHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updateHash)
})

const currentPage = computed(() => {
  switch (currentHash.value) {
    case '#/btn': return BtnPage
    case '#/table': return TablePage
    case '#/icons': return IconsPage
    case '#/theme': return ThemePage
    default: return BtnPage
  }
})

const { isDark, setDark } = useTheme()
const toggleTheme = () => setDark(!isDark.value)

const navItems = [
  { path: '#/btn', label: 'Button' },
  { path: '#/table', label: 'Table' },
  { path: '#/icons', label: 'Icons' },
  { path: '#/theme', label: 'Theme Tokens' },
]
</script>

<template>
  <div class="playground-layout">
    <aside class="playground-sidebar">
      <div class="playground-logo">
        <span class="logo-emoji">⚡</span>
        <span class="logo-text">thevue</span>
      </div>
      <nav class="playground-nav">
        <a
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          class="playground-nav-item"
          :class="{ 'playground-nav-item--active': currentHash === item.path }"
        >
          {{ item.label }}
        </a>
      </nav>
      <div class="playground-footer">
        <Btn variant="outline" color="neutral" full-width @click="toggleTheme">
          {{ isDark ? '🌞 Light Mode' : '🌙 Dark Mode' }}
        </Btn>
      </div>
    </aside>
    <main class="playground-main">
      <header class="playground-header">
        <h1 class="playground-title">
          {{ navItems.find(item => item.path === currentHash)?.label || 'Playground' }} Showcase
        </h1>
      </header>
      <div class="playground-content">
        <component :is="currentPage" />
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --sidebar-width: 260px;
}

body {
  margin: 0;
  font-family: var(--thevue-font-sans);
  background-color: var(--thevue-bg-base);
  color: var(--thevue-text-base);
  min-height: 100vh;
}

.playground-layout {
  display: flex;
  min-height: 100vh;
}

.playground-sidebar {
  width: var(--sidebar-width);
  background: var(--thevue-bg-subtle);
  border-right: 1px solid var(--thevue-border-subtle);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.playground-logo {
  padding: var(--thevue-space-6);
  display: flex;
  align-items: center;
  gap: var(--thevue-space-2);
  border-bottom: 1px solid var(--thevue-border-subtle);
}

.logo-emoji {
  font-size: var(--thevue-font-size-xl);
}

.logo-text {
  font-weight: var(--thevue-font-weight-bold);
  font-size: var(--thevue-font-size-lg);
  color: var(--thevue-text-base);
  letter-spacing: -0.025em;
}

.playground-nav {
  padding: var(--thevue-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--thevue-space-1);
  flex-grow: 1;
}

.playground-nav-item {
  display: block;
  padding: var(--thevue-space-2) var(--thevue-space-3);
  border-radius: var(--thevue-radius-md);
  color: var(--thevue-text-subtle);
  text-decoration: none;
  font-size: var(--thevue-font-size-sm);
  font-weight: var(--thevue-font-weight-medium);
  transition: all 150ms ease;
}

.playground-nav-item:hover {
  background: var(--thevue-bg-muted);
  color: var(--thevue-text-base);
}

.playground-nav-item--active {
  background: var(--thevue-color-primary-500);
  color: var(--thevue-text-inverted) !important;
}

[data-theme="dark"] .playground-nav-item--active {
  background: var(--thevue-color-primary-600);
}

.playground-footer {
  padding: var(--thevue-space-4);
  border-top: 1px solid var(--thevue-border-subtle);
}

.playground-main {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.playground-header {
  padding: var(--thevue-space-6) var(--thevue-space-8);
  border-bottom: 1px solid var(--thevue-border-subtle);
  background: var(--thevue-bg-base);
}

.playground-title {
  margin: 0;
  font-size: var(--thevue-font-size-2xl);
  font-weight: var(--thevue-font-weight-bold);
  letter-spacing: -0.025em;
}

.playground-content {
  padding: var(--thevue-space-8);
  flex-grow: 1;
  background: var(--thevue-bg-base);
}

/* Common Showcase Styles */
.showcase-section {
  margin-bottom: var(--thevue-space-8);
}

.showcase-section-title {
  margin-top: 0;
  margin-bottom: var(--thevue-space-4);
  font-size: var(--thevue-font-size-lg);
  font-weight: var(--thevue-font-weight-semibold);
  border-bottom: 1px solid var(--thevue-border-subtle);
  padding-bottom: var(--thevue-space-2);
}

.showcase-grid {
  display: grid;
  gap: var(--thevue-space-4);
}

.showcase-card {
  background: var(--thevue-bg-subtle);
  border: 1px solid var(--thevue-border-base);
  border-radius: var(--thevue-radius-lg);
  padding: var(--thevue-space-6);
}

.showcase-card-title {
  margin-top: 0;
  margin-bottom: var(--thevue-space-4);
  font-size: var(--thevue-font-size-md);
  font-weight: var(--thevue-font-weight-medium);
  color: var(--thevue-text-subtle);
}
</style>

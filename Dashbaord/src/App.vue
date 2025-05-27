<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'

const route = useRoute()
const isMobile = ref(window.innerWidth < 768)
const sidebarOpen = ref(!isMobile.value)
const sidebarCollapsed = ref(false) // Added collapsed state for sidebar

// Hide layout for specific routes (e.g. login)
const hideLayout = computed(() => route.path === '/login')

// Update page title from route meta
watch(
  () => route.meta.title,
  (title) => {
    if (title) {
      document.title = `${title} | Obodetek Dashboard`
    } else {
      document.title = 'Obodetek Dashboard'
    }
  },
  { immediate: true }
)

// Resize handler
function onResize() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value && sidebarOpen.value) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

// Toggle sidebar open/close
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  // Optionally toggle collapsed state if your design requires it
  // sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-obodetek-dark">
    <!-- Sidebar (only if layout is visible) -->
    <div
      v-if="!hideLayout"
      :class="['transition-all duration-300', sidebarOpen ? 'w-64' : 'w-0']"
      class="flex-shrink-0"
    >
      <AppSidebar
        :open="sidebarOpen"
        :collapsed="sidebarCollapsed"
        @toggle="toggleSidebar"
      />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar (only if layout is visible) -->
      <AppTopbar v-if="!hideLayout" @toggle-sidebar="toggleSidebar" />

      <!-- Router View -->
      <main
        :class="[
          'flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6',
          hideLayout ? 'bg-gray-900' : 'bg-obodetek-dark'
        ]"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

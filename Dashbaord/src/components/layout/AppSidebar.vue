<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  open: boolean
  collapsed: boolean
}>()

const emit = defineEmits(['toggle'])
const route = useRoute()
const router = useRouter()

const navigationItems = [
  { 
    name: 'Dashboard', 
    route: '/', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>` 
  },
  { 
    name: 'Devices', 
    route: '/devices', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>` 
  },
  { 
    name: 'AI Insights', 
    route: '/ai-insights', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>` 
  },
  { 
    name: 'Alerts', 
    route: '/alerts', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>` 
  },
  { 
    name: 'Analytics', 
    route: '/analytics', 
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>` 
  },
]

const isActive = (path: string) => route.path === path

function navigateTo(path: string) {
  router.push(path)
  if (window.innerWidth < 768) {
    emit('toggle')
  }
}

const isMobile = ref(window.innerWidth < 768)

function handleResize() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

const sidebarClasses = computed(() => [
  'fixed z-10 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out shadow-lg bg-opacity-90 backdrop-blur-md bg-obodetek-dark flex flex-col h-screen',
  props.collapsed ? 'w-20' : 'w-64',
  !props.open ? '-translate-x-full' : 'translate-x-0',
])

function logout() {
  localStorage.removeItem('auth')
  router.push('/login')
  if (props.open) {
    emit('toggle')
  }
}
</script>

<template>
  <div :class="sidebarClasses">
    <!-- Logo -->
    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center">
        <img
          src="/mainfavicon.png"
          alt="Obodetek Logo"
          class="h-10 w-10 rounded-lg object-cover"
        />
        <img
          v-if="!props.collapsed"
          src="/mainlogo.png"
          alt="Obodetek Text Logo"
          class="h-6 ml-3 object-contain"
        />
      </div>

      <!-- Close button for mobile -->
      <button
        class="rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none md:hidden"
        @click="$emit('toggle')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-4">
      <nav class="px-2 space-y-2">
        <template v-for="item in navigationItems" :key="item.name">
          <button
            @click="navigateTo(item.route)"
            :class="[
              'w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ease-in-out',
              isActive(item.route)
                ? 'bg-gradient-to-r from-obodetek-yellow/20 to-obodetek-purple/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            ]"
          >
            <span v-html="item.icon" class="mr-3"></span>
            <span v-if="!props.collapsed" class="font-medium">{{ item.name }}</span>
            <span
              v-if="isActive(item.route) && !props.collapsed"
              class="w-1 h-5 ml-auto rounded-full bg-gradient-to-b from-obodetek-yellow to-obodetek-purple"
            ></span>
          </button>
        </template>
      </nav>
    </div>

    <!-- Logout Button -->
    <div class="p-4 border-t border-gray-800">
      <button
        class="w-full flex items-center px-3 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        @click="logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span v-if="!props.collapsed" class="font-medium">Logout</span>
      </button>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="props.open"
    class="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
    @click="$emit('toggle')"
  ></div>
</template>

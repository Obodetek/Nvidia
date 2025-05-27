<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/app'
//import { useRouter } from 'vue-router'

const emit = defineEmits(['toggle-sidebar'])
const appStore = useAppStore()
//const router = useRouter()
const showNotifications = ref(false)
const showProfile = ref(false)
const searchQuery = ref('')

function toggleProfile() {
  showProfile.value = !showProfile.value
  if (showNotifications.value) showNotifications.value = false
}

// Computed safe user data
const userName = computed(() => appStore.user?.name ?? '')
const userEmail = computed(() => appStore.user?.email ?? '')
const userAvatar = computed(() => appStore.user?.avatar ?? '')
const userInitials = computed(() => appStore.userInitials)
</script>

<template>
  <header class="bg-opacity-70 backdrop-blur-sm bg-obodetek-dark border-b border-gray-800 sticky top-0 z-10">
    <div class="flex items-center justify-between h-16 px-4">
      <!-- Left: Menu toggle and search -->
      <div class="flex items-center flex-1">
        <button
          class="text-gray-400 hover:text-white focus:outline-none p-2"
          @click="$emit('toggle-sidebar')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Search -->
        <div class="ml-4 md:ml-6 relative w-full max-w-md">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search..."
              class="block w-full bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Right: Notifications & Profile -->
      <div class="flex items-center">
        <!-- Profile -->
        <div class="relative ml-4">
          <button
            class="flex items-center text-sm focus:outline-none"
            @click="toggleProfile"
          >
            <img
              v-if="userAvatar"
              :src="userAvatar"
              alt="User avatar"
              class="h-8 w-8 rounded-full object-cover"
            />
            <div
              v-else
              class="h-8 w-8 rounded-full bg-gradient-to-r from-obodetek-orange to-obodetek-purple flex items-center justify-center text-white font-medium"
            >
              {{ userInitials }}
            </div>
          </button>

          <!-- Profile Dropdown -->
          <div
            v-if="showProfile"
            class="absolute right-0 mt-2 w-48 bg-opacity-90 backdrop-blur-md bg-obodetek-card shadow-lg rounded-lg overflow-hidden border border-gray-700 z-10"
          >
            <div class="p-3 border-b border-gray-700">
              <p class="font-medium text-sm">{{ userName }}</p>
              <p class="text-xs text-gray-400">{{ userEmail }}</p>
            </div>
            <div class="py-1">
              <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </a>
              <!-- You can add other menu items here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center p-4 h-[80vh]">
    <h1 class="text-6xl font-bold gradient-text mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
    <p class="text-gray-400 max-w-md mb-8">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <BaseButton
      variant="gradient"
      @click="goHome"
    >
      Return to Dashboard
    </BaseButton>
  </div>
</template>
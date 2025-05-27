<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  icon?: string
  change?: number
  color?: 'yellow' | 'orange' | 'red' | 'pink' | 'purple'
}>()

const cardColor = computed(() => {
  switch(props.color) {
    case 'yellow': return 'from-obodetek-yellow/20 to-transparent';
    case 'orange': return 'from-obodetek-orange/20 to-transparent';
    case 'red': return 'from-obodetek-red/20 to-transparent';
    case 'pink': return 'from-obodetek-pink/20 to-transparent';
    case 'purple': return 'from-obodetek-purple/20 to-transparent';
    default: return 'from-obodetek-yellow/20 to-transparent';
  }
})

const iconColor = computed(() => {
  switch(props.color) {
    case 'yellow': return 'from-obodetek-yellow to-obodetek-orange';
    case 'orange': return 'from-obodetek-orange to-obodetek-red';
    case 'red': return 'from-obodetek-red to-obodetek-pink';
    case 'pink': return 'from-obodetek-pink to-obodetek-purple';
    case 'purple': return 'from-obodetek-purple to-obodetek-yellow';
    default: return 'from-obodetek-yellow to-obodetek-orange';
  }
})

const changeColor = computed(() => {
  if (!props.change) return '';
  return props.change > 0 ? 'text-green-400' : 'text-red-400';
})

const changeIcon = computed(() => {
  if (!props.change) return '';
  return props.change > 0 
    ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>';
})
</script>

<template>
  <div class="glass-card overflow-hidden">
    <div class="h-full flex flex-col p-6 relative">
      <!-- Background decoration -->
      <div :class="['absolute inset-0 bg-gradient-to-br opacity-20', cardColor]"></div>
      
      <!-- Content -->
      <div class="relative flex justify-between items-start mb-4">
        <h3 class="text-gray-400 text-sm">{{ title }}</h3>
        <div 
          v-if="icon"
          :class="['h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white', iconColor]"
          v-html="icon"
        ></div>
      </div>
      
      <div class="relative mt-auto">
        <div class="flex items-end justify-between">
          <div>
            <p class="text-2xl font-bold text-white">{{ value }}</p>
            <div v-if="change !== undefined" class="flex items-center mt-2">
              <span 
                :class="['flex items-center text-xs font-medium', changeColor]"
                v-html="changeIcon + ' ' + Math.abs(change) + '%'"
              ></span>
              <span class="text-xs text-gray-400 ml-1">from last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
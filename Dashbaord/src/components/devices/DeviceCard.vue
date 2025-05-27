<script setup lang="ts">
import { computed } from 'vue'
import type { Device } from '../../types'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps<{
  device: Device
}>()

const emit = defineEmits(['view', 'edit', 'remove'])

const statusColor = computed(() => {
  switch(props.device.status) {
    case 'online': return 'bg-green-500';
    case 'offline': return 'bg-red-500';
    case 'maintenance': return 'bg-yellow-500';
    case 'warning': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
})

const statusText = computed(() => {
  return props.device.status.charAt(0).toUpperCase() + props.device.status.slice(1)
})

const deviceIcon = computed(() => {
  switch(props.device.type) {
    case 'sensor':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>`;
    case 'gateway':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>`;
    case 'controller':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>`;
    case 'camera':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>`;
    case 'smartlock':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>`;
  }
})

const formattedDate = computed(() => {
  return new Date(props.device.lastActive).toLocaleString()
})

const batteryColor = computed(() => {
  if (props.device.batteryLevel === null) return '';
  if (props.device.batteryLevel < 20) return 'text-red-500';
  if (props.device.batteryLevel < 50) return 'text-yellow-500';
  return 'text-green-500';
})
</script>

<template>
  <div class="glass-card h-full">
    <div class="p-4 h-full flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-md flex items-center justify-center bg-gradient-to-br from-obodetek-purple to-obodetek-pink text-white">
            <span v-html="deviceIcon"></span>
          </div>
          <div class="ml-3">
            <h3 class="font-medium text-white">{{ device.name }}</h3>
            <div class="flex items-center mt-1">
              <span :class="['h-2 w-2 rounded-full mr-1', statusColor]"></span>
              <span class="text-xs text-gray-400">{{ statusText }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="text-xs font-mono bg-gray-800 px-2 py-1 rounded">{{ device.id }}</span>
        </div>
      </div>
      
      <!-- Details -->
      <div class="flex-1">
        <div class="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p class="text-gray-400 text-xs">Type</p>
            <p class="text-white capitalize">{{ device.type }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs">Location</p>
            <p class="text-white">{{ device.location }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs">IP</p>
            <p class="text-white font-mono">{{ device.ip }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs">Firmware</p>
            <p class="text-white font-mono">{{ device.firmware }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs">Last Active</p>
            <p class="text-white">{{ formattedDate }}</p>
          </div>
          <div v-if="device.batteryLevel !== null">
            <p class="text-gray-400 text-xs">Battery</p>
            <p :class="['font-medium', batteryColor]">{{ device.batteryLevel }}%</p>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-between mt-2 pt-2 border-t border-gray-700">
        <BaseButton
          variant="secondary"
          size="sm"
          glass
          icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /></svg>"
          @click="$emit('view', device)"
        >
          View
        </BaseButton>
        <BaseButton
          variant="primary"
          size="sm"
          glass
          icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' /></svg>"
          @click="$emit('edit', device)"
        >
          Edit
        </BaseButton>
        <BaseButton
          variant="danger"
          size="sm"
          glass
          icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' /></svg>"
          @click="$emit('remove', device)"
        >
          Remove
        </BaseButton>
      </div>
    </div>
  </div>
</template>
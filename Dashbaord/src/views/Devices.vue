<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import DeviceCard from '../components/devices/DeviceCard.vue'
import { useDeviceStore } from '../stores/devices'
import type { Device, DeviceType, DeviceStatus } from '../types'

const deviceStore = useDeviceStore()
const searchQuery = ref('')
const selectedType = ref<DeviceType | 'all'>('all')
const selectedStatus = ref<DeviceStatus | 'all'>('all')
const selectedLocation = ref<string | 'all'>('all')
const viewMode = ref<'grid' | 'list'>('grid')

// Get unique locations
const locations = computed(() => {
  const locSet = new Set<string>()
  deviceStore.devices.forEach(device => {
    locSet.add(device.location)
  })
  return Array.from(locSet)
})

// Filtered devices
const filteredDevices = computed(() => {
  return deviceStore.devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          device.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === 'all' || device.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'all' || device.status === selectedStatus.value
    const matchesLocation = selectedLocation.value === 'all' || device.location === selectedLocation.value
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation
  })
})

// Device handlers
const handleViewDevice = (device: Device) => {
  // Show device details (would open a modal in a full implementation)
  alert(`Viewing details for device: ${device.name}`)
}

const handleEditDevice = (device: Device) => {
  // Edit device (would open a modal in a full implementation)
  alert(`Editing device: ${device.name}`)
}

const handleRemoveDevice = (device: Device) => {
  // Confirm and remove device
  if (confirm(`Are you sure you want to remove device "${device.name}"?`)) {
    deviceStore.removeDevice(device.id)
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">Devices</h1>
      <p class="text-gray-400">Manage your IoT devices</p>
    </div>
    
    <!-- Filters & Controls -->
    <div class="glass-card p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-400 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              v-model="searchQuery"
              placeholder="Search devices..."
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            />
          </div>
        </div>
        
        <!-- Filters -->
        <div class="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Type Filter -->
          <div>
            <label for="type-filter" class="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select
              id="type-filter"
              v-model="selectedType"
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="sensor">Sensor</option>
              <option value="gateway">Gateway</option>
              <option value="controller">Controller</option>
              <option value="camera">Camera</option>
              <option value="smartlock">Smart Lock</option>
            </select>
          </div>
          
          <!-- Status Filter -->
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select
              id="status-filter"
              v-model="selectedStatus"
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          
          <!-- Location Filter -->
          <div>
            <label for="location-filter" class="block text-sm font-medium text-gray-400 mb-1">Location</label>
            <select
              id="location-filter"
              v-model="selectedLocation"
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            >
              <option value="all">All Locations</option>
              <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- View Controls -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <div class="flex items-center">
          <span class="text-sm text-gray-400 mr-2">View as:</span>
          <div class="flex border border-gray-700 rounded-lg overflow-hidden">
            <button 
              class="p-2" 
              :class="viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400'"
              @click="viewMode = 'grid'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              class="p-2" 
              :class="viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'"
              @click="viewMode = 'list'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div>
          <BaseButton
            variant="gradient"
            class="gradient-btn"
            icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' /></svg>"
          >
            Add Device
          </BaseButton>
        </div>
      </div>
    </div>
    
    <!-- Results Count -->
    <div class="flex justify-between items-center mb-4">
      <p class="text-gray-400 text-sm">Showing {{ filteredDevices.length }} of {{ deviceStore.devices.length }} devices</p>
    </div>
    
    <!-- Devices Grid -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DeviceCard
        v-for="device in filteredDevices"
        :key="device.id"
        :device="device"
        @view="handleViewDevice"
        @edit="handleEditDevice"
        @remove="handleRemoveDevice"
      />
    </div>
    
    <!-- Devices List -->
    <div v-else class="glass-card overflow-hidden">
      <table class="min-w-full">
        <thead>
          <tr class="bg-black bg-opacity-30 border-b border-gray-700">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Active</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr 
            v-for="device in filteredDevices" 
            :key="device.id"
            class="hover:bg-gray-800 hover:bg-opacity-40 transition-colors duration-150"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div 
                  class="h-8 w-8 rounded-md flex items-center justify-center bg-gradient-to-br from-obodetek-purple to-obodetek-pink text-white mr-3"
                  v-html="device.type === 'sensor' ? `<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' /></svg>` : ''"
                ></div>
                <div>
                  <div class="text-sm font-medium text-white">{{ device.name }}</div>
                  <div class="text-xs text-gray-400">{{ device.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-white capitalize">{{ device.type }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': device.status === 'online',
                  'bg-red-100 text-red-800': device.status === 'offline',
                  'bg-yellow-100 text-yellow-800': device.status === 'maintenance',
                  'bg-orange-100 text-orange-800': device.status === 'warning'
                }"
              >
                {{ device.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
              {{ device.location }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
              {{ new Date(device.lastActive).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  glass
                  @click="handleViewDevice(device)"
                >
                  View
                </BaseButton>
                <BaseButton
                  variant="primary"
                  size="sm"
                  glass
                  @click="handleEditDevice(device)"
                >
                  Edit
                </BaseButton>
                <BaseButton
                  variant="danger"
                  size="sm"
                  glass
                  @click="handleRemoveDevice(device)"
                >
                  Remove
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
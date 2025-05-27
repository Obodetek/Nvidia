<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'
import BaseButton from '../components/ui/BaseButton.vue'
import type { Notification } from '../types'

const appStore = useAppStore()

// Generate more mock alerts
const generateMockAlerts = (count = 15) => {
  const alertTypes = ['info', 'warning', 'error', 'success'] as const
  const alertTitles = [
    'Device Offline',
    'Connection Lost',
    'High Temperature Detected',
    'Firmware Update Available',
    'Security Alert',
    'Battery Level Critical',
    'Maintenance Required',
    'Network Issue',
    'Sensor Malfunction',
    'Data Threshold Exceeded'
  ]
  
  const deviceIds = ['A1283', 'B9472', 'C4782', 'D1039', 'E5629']
  
  const alerts: Notification[] = []
  
  for (let i = 0; i < count; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const title = alertTitles[Math.floor(Math.random() * alertTitles.length)]
    const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)]
    
    let message = ''
    
    switch (type) {
      case 'error':
        message = `Critical issue detected on Device #${deviceId}. Immediate attention required.`
        break
      case 'warning':
        message = `Abnormal readings from Device #${deviceId}. Please check device status.`
        break
      case 'info':
        message = `Device #${deviceId} has a new notification that may require your attention.`
        break
      case 'success':
        message = `Device #${deviceId} has successfully completed the requested operation.`
        break
    }
    
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7))
    
    alerts.push({
      id: `alert-${i + 4}`, // Start from 4 to avoid duplicates with existing notifications
      title,
      message,
      type,
      read: Math.random() > 0.7, // 30% chance of being unread
      timestamp: timestamp.toISOString()
    })
  }
  
  return alerts
}

const allAlerts = ref<Notification[]>([
  ...appStore.notifications,
  ...generateMockAlerts()
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))

// Filters
const selectedType = ref<'all' | 'info' | 'warning' | 'error' | 'success'>('all')
const selectedRead = ref<'all' | 'read' | 'unread'>('all')
const searchQuery = ref('')

// Filtered alerts
const filteredAlerts = computed(() => {
  return allAlerts.value.filter(alert => {
    const matchesType = selectedType.value === 'all' || alert.type === selectedType.value
    const matchesRead = selectedRead.value === 'all' || 
                        (selectedRead.value === 'read' && alert.read) || 
                        (selectedRead.value === 'unread' && !alert.read)
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesType && matchesRead && matchesSearch
  })
})

// Mark as read
const markAsRead = (alert: Notification) => {
  if (!alert.read) {
    alert.read = true
    
    // Also update in app store if it exists there
    const storeAlert = appStore.notifications.find(n => n.id === alert.id)
    if (storeAlert) {
      appStore.markNotificationAsRead(alert.id)
    }
  }
}

const markAllAsRead = () => {
  allAlerts.value.forEach(alert => {
    alert.read = true
  })
  
  // Also update in app store
  appStore.markAllNotificationsAsRead()
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">Alerts</h1>
      <p class="text-gray-400">System notifications and real-time alerts</p>
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
              placeholder="Search alerts..."
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            />
          </div>
        </div>
        
        <!-- Filters -->
        <div class="flex-1 grid grid-cols-2 gap-4">
          <!-- Type Filter -->
          <div>
            <label for="type-filter" class="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select
              id="type-filter"
              v-model="selectedType"
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>
          
          <!-- Read Status Filter -->
          <div>
            <label for="read-filter" class="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select
              id="read-filter"
              v-model="selectedRead"
              class="block w-full bg-black bg-opacity-20 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-obodetek-purple focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Controls -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <div>
          <p class="text-sm text-gray-400">
            Showing {{ filteredAlerts.length }} of {{ allAlerts.length }} alerts
          </p>
        </div>
        
        <div>
          <BaseButton
            variant="primary"
            size="sm"
            glass
            @click="markAllAsRead"
          >
            Mark All as Read
          </BaseButton>
        </div>
      </div>
    </div>
    
    <!-- Alerts List -->
    <div class="space-y-4">
      <div 
        v-for="alert in filteredAlerts" 
        :key="alert.id"
        class="glass-card overflow-hidden transition-all duration-200"
        :class="{ 'border-l-4': !alert.read, 'border-opacity-100': !alert.read }"
        :style="!alert.read ? {
          borderLeftColor: alert.type === 'info' ? '#3B82F6' : 
                          alert.type === 'warning' ? '#F59E0B' : 
                          alert.type === 'error' ? '#EF4444' : 
                          '#10B981'
        } : {}"
      >
        <div class="p-4">
          <div class="flex">
            <!-- Alert icon -->
            <div 
              class="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4"
              :class="{
                'bg-blue-500 bg-opacity-10 text-blue-400': alert.type === 'info',
                'bg-yellow-500 bg-opacity-10 text-yellow-400': alert.type === 'warning',
                'bg-red-500 bg-opacity-10 text-red-400': alert.type === 'error',
                'bg-green-500 bg-opacity-10 text-green-400': alert.type === 'success',
              }"
            >
              <svg v-if="alert.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-if="alert.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-if="alert.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-if="alert.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div class="flex-1">
              <div class="flex justify-between">
                <h3 class="text-lg font-medium text-white">{{ alert.title }}</h3>
                <div class="flex items-center">
                  <span 
                    :class="[
                      'text-xs px-2 py-1 rounded-full mr-2',
                      alert.type === 'info' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                      alert.type === 'warning' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                      alert.type === 'error' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                      'bg-green-500 bg-opacity-20 text-green-400'
                    ]"
                  >
                    {{ alert.type }}
                  </span>
                  <button
                    v-if="!alert.read"
                    class="text-gray-400 hover:text-white"
                    @click="markAsRead(alert)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p class="text-gray-300 mt-2">{{ alert.message }}</p>
              
              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500">{{ formatDate(alert.timestamp) }}</span>
                
                <div class="flex space-x-2">
                  <BaseButton
                    variant="secondary"
                    size="sm"
                    glass
                  >
                    Dismiss
                  </BaseButton>
                  <BaseButton
                    variant="primary"
                    size="sm"
                    glass
                  >
                    View Details
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredAlerts.length === 0" class="glass-card p-6 text-center">
        <p class="text-gray-400">No alerts match your current filters.</p>
        <BaseButton
          variant="secondary"
          size="sm"
          glass
          class="mt-4"
          @click="selectedType = 'all'; selectedRead = 'all'; searchQuery = ''"
        >
          Reset Filters
        </BaseButton>
      </div>
    </div>
  </div>
</template>
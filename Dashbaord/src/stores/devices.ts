import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Device, DeviceType, DeviceStatus } from '../types'

export const useDeviceStore = defineStore('devices', () => {
  const devices = ref<Device[]>([])
  const isLoading = ref(false)
  
  // Generate random device data
  function generateDevices(count: number = 24) {
    const types: DeviceType[] = ['sensor', 'gateway', 'controller', 'camera', 'smartlock']
    const statuses: DeviceStatus[] = ['online', 'offline', 'maintenance', 'warning']
    const locations = ['Factory Floor', 'Warehouse', 'Office', 'Exterior', 'Server Room']
    
    const newDevices: Device[] = []
    
    for (let i = 1; i <= count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const lastActive = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7))
      
      const device: Device = {
        id: `D${String(i).padStart(4, '0')}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
        type,
        status,
        location,
        ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        lastActive: lastActive.toISOString(),
        batteryLevel: type === 'sensor' ? Math.floor(Math.random() * 100) : null,
        firmware: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        dataPoints: Math.floor(Math.random() * 10000)
      }
      
      newDevices.push(device)
    }
    
    devices.value = newDevices
  }
  
  // Getters
  const devicesByStatus = computed(() => {
    const result = {
      online: 0,
      offline: 0,
      maintenance: 0,
      warning: 0
    }
    
    devices.value.forEach(device => {
      result[device.status]++
    })
    
    return result
  })
  
  const devicesByType = computed(() => {
    const result: Record<string, number> = {}
    
    devices.value.forEach(device => {
      if (!result[device.type]) {
        result[device.type] = 0
      }
      result[device.type]++
    })
    
    return result
  })
  
  const totalDevices = computed(() => devices.value.length)
  const activeDevices = computed(() => devices.value.filter(d => d.status === 'online').length)
  
  // Actions
  function addDevice(device: Device) {
    devices.value.push(device)
  }
  
  function updateDevice(id: string, updates: Partial<Device>) {
    const index = devices.value.findIndex(d => d.id === id)
    if (index !== -1) {
      devices.value[index] = { ...devices.value[index], ...updates }
    }
  }
  
  function removeDevice(id: string) {
    devices.value = devices.value.filter(d => d.id !== id)
  }
  
  function setLoading(value: boolean) {
    isLoading.value = value
  }
  
  // Initialize with mock data
  generateDevices()
  
  return {
    devices,
    isLoading,
    devicesByStatus,
    devicesByType,
    totalDevices,
    activeDevices,
    addDevice,
    updateDevice,
    removeDevice,
    generateDevices,
    setLoading
  }
})
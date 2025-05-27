import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, User, AppTheme } from '../types'

export const useAppStore = defineStore('app', () => {
  // State
  const notifications = ref<Notification[]>([])
  const user = ref<User | null>({
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@obodetek.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Admin'
  })
  const theme = ref<AppTheme>('dark')
  const isLoading = ref(false)
  
  // Getters
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })
  
  const userInitials = computed(() => {
    if (user.value && user.value.name) {
      const nameParts = user.value.name.split(' ')
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`
      }
      return nameParts[0][0]
    }
    return 'U'
  })
  
  // Actions
  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
  }
  
  function markNotificationAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }
  
  function markAllNotificationsAsRead() {
    notifications.value.forEach(n => {
      n.read = true
    })
  }
  
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  
  function setLoading(value: boolean) {
    isLoading.value = value
  }

  // New logout action: clear user and notifications
  function logout() {
    user.value = null
    notifications.value = []
  }

  // Mock initial notifications
  addNotification({
    id: '1',
    title: 'System Update Available',
    message: 'A new system update is available for your dashboard.',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  })
  addNotification({
    id: '2',
    title: 'Critical Alert',
    message: 'Temperature sensor on Device #A1283 reporting abnormal readings.',
    type: 'error',
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString()
  })
  addNotification({
    id: '3',
    title: 'AI Prediction',
    message: 'Maintenance recommended for Device #B9472 within next 14 days.',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 86400000).toISOString()
  })
  
  return { 
    notifications, 
    user, 
    theme, 
    isLoading,
    unreadNotifications,
    userInitials,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleTheme,
    setLoading,
    logout,  // <== added logout here
  }
})

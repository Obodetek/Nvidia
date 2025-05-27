// App Types
export type AppTheme = 'dark' | 'light'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  timestamp: string
}

// Device Types
export type DeviceType = 'sensor' | 'gateway' | 'controller' | 'camera' | 'smartlock'
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'warning'

export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  location: string
  ip: string
  lastActive: string
  batteryLevel: number | null
  firmware: string
  dataPoints: number
}

// Chart & Analytics Types
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
}

// AI Insight Types
export interface AIPrediction {
  id: string
  deviceId: string
  deviceName: string
  type: 'maintenance' | 'anomaly' | 'optimization'
  confidence: number
  message: string
  suggestedAction: string
  timestamp: string
}
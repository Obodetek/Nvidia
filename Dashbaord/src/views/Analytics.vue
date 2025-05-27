<script setup lang="ts">
import { computed, onMounted } from 'vue'
import LineChart from '../components/charts/LineChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'
import { useDeviceStore } from '../stores/devices'
import type { ChartData } from '../types'

const deviceStore = useDeviceStore()

// Generate random data for charts
const generateTimeSeriesData = (days = 30, minValue = 10, maxValue = 100, trend = 0) => {
  const labels = []
  const data = []
  
  for (let i = days; i > 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    
    // Add trend factor to create some directionality in the data
    const trendFactor = (days - i) * trend
    data.push(Math.floor(Math.random() * (maxValue - minValue) + minValue + trendFactor))
  }
  
  return { labels, data }
}

// Data usage over time
const dataUsageTimeSeriesData = generateTimeSeriesData(30, 20, 80, 0.5)
const dataUsageChart = computed<ChartData>(() => ({
  labels: dataUsageTimeSeriesData.labels,
  datasets: [
    {
      label: 'Data Usage (MB)',
      data: dataUsageTimeSeriesData.data,
      backgroundColor: 'rgba(202, 69, 196, 0.2)',
      borderColor: '#ca45c4',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }
  ]
}))

// Activity by hour
const activityByHourData = (() => {
  const labels = []
  const data = []
  
  for (let i = 0; i < 24; i++) {
    labels.push(`${i}:00`)
    
    // Simulate higher activity during business hours
    let baseValue = 20
    if (i >= 8 && i <= 18) {
      baseValue = 60
    }
    if (i >= 12 && i <= 14) {
      baseValue = 40 // lunch dip
    }
    
    data.push(Math.floor(baseValue + Math.random() * 30))
  }
  
  return { labels, data }
})()

const activityByHourChart = computed<ChartData>(() => ({
  labels: activityByHourData.labels,
  datasets: [
    {
      label: 'Activity Level',
      data: activityByHourData.data,
      backgroundColor: 'rgba(248, 183, 6, 0.2)',
      borderColor: '#f8b706',
      borderWidth: 2,
      tension: 0.1,
      fill: true
    }
  ]
}))

// Device performance comparison
const devicePerformanceData = (() => {
  const devices = deviceStore.devices.slice(0, 5)
  const labels = devices.map(d => d.name)
  const processingData = devices.map(() => Math.floor(Math.random() * 50) + 50)
  const responseData = devices.map(() => Math.floor(Math.random() * 40) + 60)
  
  return { labels, processingData, responseData }
})()

const devicePerformanceChart = computed<ChartData>(() => ({
  labels: devicePerformanceData.labels,
  datasets: [
    {
      label: 'Processing Speed',
      data: devicePerformanceData.processingData,
      backgroundColor: 'rgba(216, 50, 109, 0.7)',
      borderColor: '#d8326d',
      borderWidth: 1
    },
    {
      label: 'Response Time',
      data: devicePerformanceData.responseData,
      backgroundColor: 'rgba(255, 103, 2, 0.7)',
      borderColor: '#ff6702',
      borderWidth: 1
    }
  ]
}))

// Location distribution
const locationDistributionData = (() => {
  const locationCounts: Record<string, number> = {}
  
  deviceStore.devices.forEach(device => {
    if (!locationCounts[device.location]) {
      locationCounts[device.location] = 0
    }
    locationCounts[device.location]++
  })
  
  return {
    labels: Object.keys(locationCounts),
    data: Object.values(locationCounts)
  }
})()

const locationDistributionChart = computed<ChartData>(() => ({
  labels: locationDistributionData.labels,
  datasets: [
    {
      label: 'Device Count by Location',
      data: locationDistributionData.data,
      backgroundColor: [
        'rgba(248, 183, 6, 0.7)',  // yellow
        'rgba(255, 103, 2, 0.7)',  // orange
        'rgba(235, 67, 73, 0.7)',  // red
        'rgba(216, 50, 109, 0.7)', // pink
        'rgba(202, 69, 196, 0.7)'  // purple
      ],
      borderWidth: 0
    }
  ]
}))

onMounted(() => {
  // Ensure we have devices data
  if (deviceStore.devices.length === 0) {
    deviceStore.generateDevices()
  }
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">Analytics</h1>
      <p class="text-gray-400">Detailed insights and performance analysis</p>
    </div>
    
    <!-- Main Charts -->
    <div class="grid grid-cols-1 gap-6 mb-6">
      <div class="glass-card p-6">
        <h2 class="text-lg font-medium text-white mb-4">Data Consumption Trends (30 Days)</h2>
        <LineChart
          :chart-data="dataUsageChart"
          :height="300"
        />
      </div>
    </div>
    
    <!-- Activity by hour & Device performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="glass-card p-6">
        <h2 class="text-lg font-medium text-white mb-4">Activity by Hour</h2>
        <LineChart
          :chart-data="activityByHourChart"
          :height="250"
        />
      </div>
      
      <div class="glass-card p-6">
        <h2 class="text-lg font-medium text-white mb-4">Device Performance Comparison</h2>
        <LineChart
          :chart-data="devicePerformanceChart"
          :height="250"
        />
      </div>
    </div>
    
    <!-- Location distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="glass-card p-6">
        <h2 class="text-lg font-medium text-white mb-4">Device Distribution by Location</h2>
        <DoughnutChart
          :chart-data="locationDistributionChart"
          :height="250"
        />
      </div>
      
      <div class="glass-card p-6">
        <h2 class="text-lg font-medium text-white mb-4">Summary Statistics</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-black bg-opacity-20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Total Data Processed</p>
            <p class="text-2xl font-bold text-white mt-1">1.78 TB</p>
            <p class="text-xs text-green-400 mt-1">↑ 12% from last month</p>
          </div>
          
          <div class="bg-black bg-opacity-20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Average Response Time</p>
            <p class="text-2xl font-bold text-white mt-1">238 ms</p>
            <p class="text-xs text-red-400 mt-1">↓ 5% decline in performance</p>
          </div>
          
          <div class="bg-black bg-opacity-20 rounded-lg p-4">
            <p class="text-sm text-gray-400">System Uptime</p>
            <p class="text-2xl font-bold text-white mt-1">99.94%</p>
            <p class="text-xs text-green-400 mt-1">↑ 0.3% improvement</p>
          </div>
          
          <div class="bg-black bg-opacity-20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Active Connections (Avg)</p>
            <p class="text-2xl font-bold text-white mt-1">143</p>
            <p class="text-xs text-green-400 mt-1">↑ 24% increase</p>
          </div>
        </div>
        
        <div class="mt-6">
          <h3 class="text-md font-medium text-white mb-3">Performance Insights</h3>
          <ul class="space-y-2">
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm text-gray-300">System performance is within expected parameters</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="text-sm text-gray-300">Device response times showing minor degradation</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm text-gray-300">Network bandwidth capacity sufficient for current load</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
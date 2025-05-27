<script setup lang="ts">
import {  onMounted, computed } from 'vue'
import StatCard from '../components/dashboard/StatCard.vue'
import LineChart from '../components/charts/LineChart.vue'
import DoughnutChart from '../components/charts/DoughnutChart.vue'
import { useDeviceStore } from '../stores/devices'
import type { ChartData } from '../types'

const deviceStore = useDeviceStore()

// Generate random data for charts
const generateTimeSeriesData = (days = 7, minValue = 10, maxValue = 100) => {
  const labels = []
  const data = []
  
  for (let i = days; i > 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    data.push(Math.floor(Math.random() * (maxValue - minValue) + minValue))
  }
  
  return { labels, data }
}

// Data usage chart
const dataUsageTimeSeriesData = generateTimeSeriesData(14, 20, 80)
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

// Device status chart
const deviceStatusChart = computed<ChartData>(() => {
  const statusCounts = deviceStore.devicesByStatus
  
  return {
    labels: ['Online', 'Offline', 'Maintenance', 'Warning'],
    datasets: [
      {
        label: 'Device Status',
        data: [
          statusCounts.online,
          statusCounts.offline,
          statusCounts.maintenance,
          statusCounts.warning
        ],
        backgroundColor: [
          '#34D399', // green
          '#F87171', // red
          '#FBBF24', // yellow
          '#FB923C'  // orange
        ],
        borderWidth: 0
      }
    ]
  }
})

// Device types chart
const deviceTypesChart = computed<ChartData>(() => {
  const typeData = deviceStore.devicesByType
  
  return {
    labels: Object.keys(typeData).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [
      {
        label: 'Device Types',
        data: Object.values(typeData),
        backgroundColor: [
          '#f8b706', // yellow
          '#ff6702', // orange
          '#eb4349', // red
          '#d8326d', // pink
          '#ca45c4'  // purple
        ],
        borderWidth: 0
      }
    ]
  }
})

// AI predictions chart
const predictionData = generateTimeSeriesData(10, 0, 100)
const aiPredictionsChart = computed<ChartData>(() => ({
  labels: predictionData.labels,
  datasets: [
    {
      label: 'Maintenance Predictions',
      data: predictionData.data.map(val => val * 0.8),
      borderColor: '#f8b706',
      backgroundColor: 'rgba(248, 183, 6, 0.2)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    },
    {
      label: 'Anomaly Detections',
      data: predictionData.data.map(val => val * 0.5),
      borderColor: '#eb4349',
      backgroundColor: 'rgba(235, 67, 73, 0.2)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }
  ]
}))

// Simulated real-time data updates
/*const refreshData = () => {
  deviceStore.generateDevices()
}*/

onMounted(() => {
  // Refresh data every minute in real-world app
  // setInterval(refreshData, 60000)
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p class="text-gray-400">Welcome to your Obodetek IoT dashboard</p>
    </div>
    
    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Devices"
        :value="deviceStore.totalDevices"
        color="yellow"
        :change="5"
        icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' /></svg>"
      />
      <StatCard
        title="Active Devices"
        :value="deviceStore.activeDevices"
        color="orange"
        :change="-2"
        icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z' /></svg>"
      />
      <StatCard
        title="Alerts"
        value="3"
        color="red"
        :change="12"
        icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>"
      />
      <StatCard
        title="Data Usage"
        value="1.34 GB"
        color="purple"
        :change="8"
        icon="<svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' /></svg>"
      />
    </div>
    
    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="glass-card p-4">
        <LineChart
          :chart-data="dataUsageChart"
          title="Data Usage"
          :height="250"
        />
      </div>
      
      <div class="glass-card p-4">
        <LineChart
          :chart-data="aiPredictionsChart"
          title="AI Predictions"
          :height="250"
        />
      </div>
    </div>
    
    <!-- Status and Types Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="glass-card p-4">
        <DoughnutChart
          :chart-data="deviceStatusChart"
          title="Device Status"
          :height="250"
        />
      </div>
      
      <div class="glass-card p-4">
        <DoughnutChart
          :chart-data="deviceTypesChart"
          title="Device Types"
          :height="250"
        />
      </div>
    </div>
  </div>
</template>
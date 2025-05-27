<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDeviceStore } from '../stores/devices'
import BaseButton from '../components/ui/BaseButton.vue'
import LineChart from '../components/charts/LineChart.vue'

import type { AIPrediction, ChartData } from '../types'

const deviceStore = useDeviceStore()

// Typed arrays for filtering
type PredictionType = 'all' | 'maintenance' | 'anomaly' | 'optimization'
type ConfidenceType = 'all' | 'high' | 'medium' | 'low'

const types: PredictionType[] = ['all', 'maintenance', 'anomaly', 'optimization']
const confidences: ConfidenceType[] = ['all', 'high', 'medium', 'low']

// Generate mock AI predictions
const generatePredictions = (count = 12) => {
  const predictions: AIPrediction[] = []
  const predictionTypes: Exclude<PredictionType, 'all'>[] = ['maintenance', 'anomaly', 'optimization']
  const devices = deviceStore.devices

  for (let i = 0; i < count; i++) {
    const device = devices[Math.floor(Math.random() * devices.length)]
    const type = predictionTypes[Math.floor(Math.random() * predictionTypes.length)]
    const timestamp = new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
    const confidence = Math.floor(Math.random() * 50) + 50 // 50-100%

    let message = ''
    let suggestedAction = ''

    if (type === 'maintenance') {
      message = `${device.type.charAt(0).toUpperCase() + device.type.slice(1)} may require maintenance soon.`
      suggestedAction = 'Schedule preventive maintenance in the next 14 days.'
    } else if (type === 'anomaly') {
      message = `Unusual behavior detected in ${device.name}.`
      suggestedAction = 'Investigate device behavior and check for malfunctions.'
    } else {
      message = `${device.name} could be optimized for better performance.`
      suggestedAction = 'Adjust settings to improve efficiency and reduce power consumption.'
    }

    predictions.push({
      id: `P${i + 1}`,
      deviceId: device.id,
      deviceName: device.name,
      type,
      confidence,
      message,
      suggestedAction,
      timestamp
    })
  }

  return predictions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const aiPredictions = ref<AIPrediction[]>(generatePredictions())

const anomalyTimeSeriesData = (() => {
  const labels: string[] = []
  const normalData: number[] = []
  const anomalyData: number[] = []

  for (let i = 30; i > 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

    const baseValue = 50 + Math.sin(i * 0.5) * 20
    normalData.push(Math.floor(baseValue + Math.random() * 5))

    if (i === 25 || i === 15 || i === 5) {
      anomalyData.push(Math.floor(baseValue + 30 + Math.random() * 10))
    } else {
      anomalyData.push(NaN)
    }
  }

  return { labels, normalData, anomalyData }
})()

const anomalyDetectionChart = computed<ChartData>(() => ({
  labels: anomalyTimeSeriesData.labels,
  datasets: [
    {
      label: 'Normal Readings',
      data: anomalyTimeSeriesData.normalData,
      borderColor: '#ca45c4',
      backgroundColor: 'rgba(202, 69, 196, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    },
    {
      label: 'Anomalies',
      data: anomalyTimeSeriesData.anomalyData,
      borderColor: '#eb4349',
      backgroundColor: 'rgba(235, 67, 73, 0.5)',
      borderWidth: 0,
      pointRadius: 6,
      pointHoverRadius: 8,
      fill: false
    }
  ]
}))

const maintenanceForecastData = (() => {
  const labels: string[] = []
  const data: number[] = []

  const currentDate = new Date()
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate)
    date.setMonth(currentDate.getMonth() + i)
    labels.push(date.toLocaleDateString('en-US', { month: 'short' }))

    data.push(Math.floor(20 + i * 5 + Math.random() * 10))
  }

  return { labels, data }
})()

const maintenanceForecastChart = computed<ChartData>(() => ({
  labels: maintenanceForecastData.labels,
  datasets: [
    {
      label: 'Maintenance Probability (%)',
      data: maintenanceForecastData.data,
      borderColor: '#ff6702',
      backgroundColor: 'rgba(255, 103, 2, 0.2)',
      borderWidth: 2,
      tension: 0.2,
      fill: true
    }
  ]
}))

const selectedType = ref<PredictionType>('all')
const selectedConfidence = ref<ConfidenceType>('all')

const filteredPredictions = computed(() => {
  return aiPredictions.value.filter(prediction => {
    const matchesType = selectedType.value === 'all' || prediction.type === selectedType.value

    let matchesConfidence = true
    if (selectedConfidence.value === 'high') {
      matchesConfidence = prediction.confidence >= 80
    } else if (selectedConfidence.value === 'medium') {
      matchesConfidence = prediction.confidence >= 65 && prediction.confidence < 80
    } else if (selectedConfidence.value === 'low') {
      matchesConfidence = prediction.confidence < 65
    }

    return matchesType && matchesConfidence
  })
})

const predictionTypeIcon = (type: string) => {
  switch(type) {
    case 'maintenance':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>`
    case 'anomaly':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>`
    case 'optimization':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>`
    default:
      return ''
  }
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 80) return 'text-green-400'
  if (confidence >= 65) return 'text-yellow-400'
  return 'text-red-400'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <h2 class="text-3xl font-semibold">AI Predictions</h2>
      <div class="flex gap-2">
        <BaseButton
          v-for="type in types"
          :key="type"
          :class="{'bg-indigo-600 text-white': selectedType === type, 'bg-gray-200': selectedType !== type}"
          @click="selectedType = type"
          size="sm"
        >
          {{ type.charAt(0).toUpperCase() + type.slice(1) }}
        </BaseButton>
      </div>
      <div class="flex gap-2">
        <BaseButton
          v-for="conf in confidences"
          :key="conf"
          :class="{'bg-indigo-600 text-white': selectedConfidence === conf, 'bg-gray-200': selectedConfidence !== conf}"
          @click="selectedConfidence = conf"
          size="sm"
        >
          {{ conf.charAt(0).toUpperCase() + conf.slice(1) }}
        </BaseButton>
      </div>
    </div>

    <ul class="space-y-4">
      <li
        v-for="prediction in filteredPredictions"
        :key="prediction.id"
        class="border border-gray-300 rounded p-4 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <div class="flex items-center gap-3 mb-2">
          <div v-html="predictionTypeIcon(prediction.type)" class="w-5 h-5"></div>
          <h3 class="font-semibold text-lg">{{ prediction.deviceName }}</h3>
          <span :class="getConfidenceClass(prediction.confidence)" class="ml-auto font-bold">{{ prediction.confidence }}%</span>
        </div>
        <p class="text-gray-600 mb-2">{{ prediction.message }}</p>
        <p class="text-sm text-gray-500 italic mb-2">Suggested: {{ prediction.suggestedAction }}</p>
        <p class="text-xs text-gray-400">Timestamp: {{ formatDate(prediction.timestamp) }}</p>
      </li>
    </ul>

    <!--
    Uncomment below if you want to show healthScoreData chart

    <div class="mt-10">
      <h2 class="text-2xl font-semibold mb-4">Device Health Scores</h2>
      <LineChart :chart-data="healthScoreData" title="Health Scores" :height="250" />
    </div>
    -->

    <div class="mt-10">
      <h2 class="text-2xl font-semibold mb-4">Anomaly Detection Over Time</h2>
      <LineChart :chart-data="anomalyDetectionChart" :height="300" />
    </div>

    <div class="mt-10">
      <h2 class="text-2xl font-semibold mb-4">Maintenance Forecast (Next 12 Months)</h2>
      <LineChart :chart-data="maintenanceForecastChart" :height="300" />
    </div>
  </div>
</template>

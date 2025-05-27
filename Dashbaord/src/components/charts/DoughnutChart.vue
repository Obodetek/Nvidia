<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import type { ChartData } from '../../types'

// Register Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  chartData: ChartData
  height?: number
  title?: string
  legend?: boolean
  cutout?: string
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// Create or update chart
const setupChart = () => {
  if (!canvas.value) return

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy()
  }

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: props.cutout || '70%',
      plugins: {
        legend: {
          display: props.legend !== false,
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              family: 'Inter, sans-serif',
              size: 12
            },
            boxWidth: 12,
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: 'rgba(255, 255, 255, 0.9)',
          bodyColor: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 4,
          displayColors: true,
          usePointStyle: true,
          callbacks: {
            labelTextColor: function() {
              return 'rgba(255, 255, 255, 0.7)'
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  setupChart()
})

watch(() => props.chartData, () => {
  setupChart()
}, { deep: true })
</script>

<template>
  <div>
    <h3 v-if="title" class="text-sm font-medium mb-4 text-gray-300">{{ title }}</h3>
    <div class="relative">
      <canvas
        ref="canvas"
        :height="height || 250"
      ></canvas>
    </div>
  </div>
</template>
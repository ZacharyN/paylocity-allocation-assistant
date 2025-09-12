<template>
  <div class="container mx-auto py-8">
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Time Entry System</h1>
        <p class="text-gray-600 dark:text-gray-400">Track your daily time entries with the calendar interface</p>
      </div>

      <!-- Pay Period Mock Data Setup -->
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Mock Setup Controls -->
        <UCard class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-settings" class="w-5 h-5 text-blue-500" />
              <h3 class="text-lg font-semibold text-blue-700 dark:text-blue-300">Test Configuration</h3>
            </div>
          </template>
          
          <div class="space-y-4">
            <p class="text-sm text-blue-600 dark:text-blue-400">
              This page demonstrates the Time Entry Calendar component with mock data for testing purposes.
            </p>
            
            <div class="flex items-center gap-4">
              <UButton 
                @click="createMockPayPeriod"
                color="blue"
                icon="i-lucide-calendar-plus"
                :disabled="!!currentPayPeriod"
              >
                Create Mock Pay Period
              </UButton>
              
              <UButton 
                @click="createMockCostCenters"
                color="green" 
                icon="i-lucide-building"
                :disabled="costCenters.length > 0"
              >
                Create Mock Cost Centers
              </UButton>

              <UButton 
                @click="resetMockData"
                color="red"
                variant="outline"
                icon="i-lucide-refresh-cw"
              >
                Reset Data
              </UButton>
            </div>

            <div class="text-xs text-gray-500 dark:text-gray-400">
              <strong>Note:</strong> This is a demo page. In production, data would come from the database via API endpoints.
            </div>
          </div>
        </UCard>

        <!-- Time Entry Calendar -->
        <TimeEntryCalendar
          :selected-pay-period="currentPayPeriod"
          :cost-centers="costCenters"
          @create-pay-period="createMockPayPeriod"
        />

        <!-- Debug Information (Dev only) -->
        <UCard v-if="showDebug" class="bg-gray-50 dark:bg-gray-900">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-bug" class="w-4 h-4 text-gray-500" />
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Debug Information</h4>
              </div>
              <UButton
                variant="ghost"
                size="xs"
                icon="i-lucide-x"
                @click="showDebug = false"
              />
            </div>
          </template>
          
          <div class="space-y-4 text-sm">
            <div>
              <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Current Pay Period:</h5>
              <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">{{ JSON.stringify(currentPayPeriod, null, 2) }}</pre>
            </div>
            
            <div>
              <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Centers:</h5>
              <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">{{ JSON.stringify(costCenters, null, 2) }}</pre>
            </div>
          </div>
        </UCard>

        <!-- Debug Toggle -->
        <div class="text-center">
          <UButton
            variant="ghost"
            size="xs"
            @click="showDebug = !showDebug"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {{ showDebug ? 'Hide' : 'Show' }} Debug Info
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PayPeriod, CostCenter } from '@/types'

// Page meta
definePageMeta({
  title: 'Time Entry System'
})

// State
const currentPayPeriod = ref<PayPeriod | null>(null)
const costCenters = ref<CostCenter[]>([])
const showDebug = ref(false)

// Toast notifications
const toast = useToast()

// Mock data creation functions
const createMockPayPeriod = () => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7) // Start from a week ago
  
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 7) // End a week from now
  
  currentPayPeriod.value = {
    id: 'mock-pay-period-1',
    startDate,
    endDate,
    totalHours: 80, // 2 weeks * 40 hours
    userId: 'mock-user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  toast.add({
    title: 'Mock Pay Period Created',
    description: `Pay period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
    color: 'success'
  })
}

const createMockCostCenters = () => {
  costCenters.value = [
    {
      id: 'cc-1',
      division: 123,
      funding: 456, 
      program: 789,
      percentage: 60,
      userId: 'mock-user'
    },
    {
      id: 'cc-2', 
      division: 234,
      funding: 567,
      program: 890,
      percentage: 25,
      userId: 'mock-user'
    },
    {
      id: 'cc-3',
      division: 345,
      funding: 678,
      program: 901,
      percentage: 15,
      userId: 'mock-user'
    }
  ]
  
  toast.add({
    title: 'Mock Cost Centers Created',
    description: `Created ${costCenters.value.length} cost centers with 100% allocation`,
    color: 'success'
  })
}

const resetMockData = () => {
  currentPayPeriod.value = null
  costCenters.value = []
  
  toast.add({
    title: 'Data Reset',
    description: 'All mock data has been cleared',
    color: 'info'
  })
}

// Initialize with mock data on mount
onMounted(() => {
  // Auto-create mock data for immediate testing
  createMockCostCenters()
  createMockPayPeriod()
})
</script>
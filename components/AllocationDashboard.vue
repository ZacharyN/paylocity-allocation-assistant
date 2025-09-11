<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-primary-500" />
          <h3 class="text-lg font-semibold">Allocation Dashboard</h3>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-500">
            Progress: 
            <span 
              class="font-semibold ml-1"
              :class="{
                'text-green-600': overallStatus === 'exact' || overallStatus === 'close',
                'text-yellow-600': overallStatus === 'under',
                'text-red-600': overallStatus === 'over'
              }"
            >
              {{ progressPercentage.toFixed(1) }}%
            </span>
          </div>
          <UBadge 
            :color="getStatusColor(overallStatus)" 
            variant="soft"
            :icon="getStatusIcon(overallStatus)"
          >
            {{ getStatusText(overallStatus) }}
          </UBadge>
          <UButton 
            icon="i-heroicons-arrow-path"
            size="xs"
            variant="ghost"
            @click="refreshAllocations"
            :loading="loading"
          />
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
      <p class="text-gray-500">Loading allocation data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 text-center text-red-500">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 mx-auto mb-4" />
      <p class="text-lg mb-2">Failed to load allocation data</p>
      <p class="text-sm">{{ error }}</p>
      <UButton @click="refreshAllocations" class="mt-4">Try Again</UButton>
    </div>

    <!-- No Pay Period Selected -->
    <div v-else-if="!currentPayPeriod" class="p-8 text-center text-gray-500">
      <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-lg mb-2">No pay period selected</p>
      <p class="text-sm">Select a pay period to view allocation tracking</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- Overall Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Total Expected Hours -->
        <UCard class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Expected Hours</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ formatHours(totalExpectedHours) }}</p>
            </div>
            <UIcon name="i-heroicons-target" class="w-8 h-8 text-blue-500" />
          </div>
        </UCard>

        <!-- Total Actual Hours -->
        <UCard class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 dark:text-green-400 font-medium">Actual Hours</p>
              <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ formatHours(totalActualHours) }}</p>
            </div>
            <UIcon name="i-heroicons-clock" class="w-8 h-8 text-green-500" />
          </div>
        </UCard>

        <!-- Variance -->
        <UCard 
          class="border-2"
          :class="{
            'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800': overallVariance >= -0.5 && overallVariance <= 0.5,
            'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800': overallVariance < -0.5,
            'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800': overallVariance > 0.5
          }"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium"
                :class="{
                  'text-green-600 dark:text-green-400': overallVariance >= -0.5 && overallVariance <= 0.5,
                  'text-yellow-600 dark:text-yellow-400': overallVariance < -0.5,
                  'text-red-600 dark:text-red-400': overallVariance > 0.5
                }"
              >
                Variance
              </p>
              <p class="text-2xl font-bold"
                :class="{
                  'text-green-900 dark:text-green-100': overallVariance >= -0.5 && overallVariance <= 0.5,
                  'text-yellow-900 dark:text-yellow-100': overallVariance < -0.5,
                  'text-red-900 dark:text-red-100': overallVariance > 0.5
                }"
              >
                {{ overallVariance >= 0 ? '+' : '' }}{{ formatHours(overallVariance) }}
              </p>
            </div>
            <UIcon 
              :name="overallVariance > 0.5 ? 'i-heroicons-arrow-trending-up' : overallVariance < -0.5 ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-minus'"
              class="w-8 h-8"
              :class="{
                'text-green-500': overallVariance >= -0.5 && overallVariance <= 0.5,
                'text-yellow-500': overallVariance < -0.5,
                'text-red-500': overallVariance > 0.5
              }"
            />
          </div>
        </UCard>
      </div>

      <!-- Pay Period Info -->
      <UCard class="bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-gray-500" />
            <div>
              <p class="font-medium">{{ formatDateRange(currentPayPeriod.startDate, currentPayPeriod.endDate) }}</p>
              <p class="text-sm text-gray-500">{{ currentPayPeriod.totalHours }} hours total</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full transition-all duration-500 rounded-full"
                :class="{
                  'bg-green-500': progressPercentage >= 95,
                  'bg-yellow-500': progressPercentage >= 75 && progressPercentage < 95,
                  'bg-red-500': progressPercentage < 75
                }"
                :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
              />
            </div>
            <span class="text-sm font-medium">{{ progressPercentage.toFixed(0) }}%</span>
          </div>
        </div>
      </UCard>

      <!-- Cost Center Allocation Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Cost Center</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Expected</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actual</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Variance</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Progress</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="allocation in allocations" 
              :key="allocation.costCenter.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <!-- Cost Center Code -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <UBadge variant="outline" color="gray">
                    {{ formatCostCenterCode(allocation.costCenter) }}
                  </UBadge>
                  <span class="text-sm text-gray-500">{{ allocation.costCenter.percentage }}%</span>
                </div>
              </td>
              
              <!-- Expected Hours -->
              <td class="py-4 px-4">
                <span class="font-medium">{{ formatHours(allocation.expectedHours) }}h</span>
              </td>
              
              <!-- Actual Hours -->
              <td class="py-4 px-4">
                <span class="font-medium">{{ formatHours(allocation.actualHours) }}h</span>
              </td>
              
              <!-- Variance -->
              <td class="py-4 px-4">
                <span 
                  class="font-medium"
                  :class="{
                    'text-green-600': Math.abs(allocation.variance) <= allocation.expectedHours * 0.05,
                    'text-yellow-600': allocation.variance < -allocation.expectedHours * 0.05,
                    'text-red-600': allocation.variance > allocation.expectedHours * 0.05
                  }"
                >
                  {{ allocation.variance >= 0 ? '+' : '' }}{{ formatHours(allocation.variance) }}h
                </span>
              </td>
              
              <!-- Progress Bar -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full transition-all duration-300 rounded-full"
                      :class="{
                        'bg-green-500': allocation.status === 'exact' || allocation.status === 'close',
                        'bg-yellow-500': allocation.status === 'under',
                        'bg-red-500': allocation.status === 'over'
                      }"
                      :style="{ width: `${Math.min(allocation.percentageComplete, 100)}%` }"
                    />
                  </div>
                  <span class="text-xs text-gray-500 min-w-[3ch]">{{ allocation.percentageComplete.toFixed(0) }}%</span>
                </div>
              </td>
              
              <!-- Status -->
              <td class="py-4 px-4">
                <UBadge 
                  :color="getStatusColor(allocation.status)" 
                  variant="soft"
                  :icon="getStatusIcon(allocation.status)"
                >
                  {{ getStatusText(allocation.status) }}
                </UBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State for No Allocations -->
      <div v-if="allocations.length === 0" class="p-8 text-center text-gray-500">
        <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p class="text-lg mb-2">No cost centers configured</p>
        <p class="text-sm">Set up cost centers to track allocation progress</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { PayPeriod } from '~/types'
import { formatHours } from '~/utils/time'

// Props
interface Props {
  payPeriodId?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoRefresh: false,
  refreshInterval: 30000 // 30 seconds
})

// Composables
const {
  allocations,
  loading,
  error,
  currentPayPeriod,
  totalExpectedHours,
  totalActualHours,
  overallVariance,
  overallStatus,
  progressPercentage,
  fetchAllocationData,
  refreshAllocations,
  getStatusColor,
  getStatusIcon,
  getStatusText
} = useAllocation()

// Auto-refresh timer
let refreshTimer: NodeJS.Timeout | null = null

// Methods
function formatCostCenterCode(costCenter: any): string {
  return `${String(costCenter.division).padStart(3, '0')}-${String(costCenter.funding).padStart(3, '0')}-${String(costCenter.program).padStart(3, '0')}`
}

function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
  }
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}

function startAutoRefresh() {
  if (props.autoRefresh && !refreshTimer) {
    refreshTimer = setInterval(() => {
      if (props.payPeriodId) {
        refreshAllocations()
      }
    }, props.refreshInterval)
  }
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Watchers
watch(() => props.payPeriodId, async (newId) => {
  if (newId) {
    await fetchAllocationData(newId)
  }
}, { immediate: true })

watch(() => props.autoRefresh, (enabled) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (props.payPeriodId) {
    fetchAllocationData(props.payPeriodId)
  }
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>
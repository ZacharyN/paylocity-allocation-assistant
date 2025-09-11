<template>
  <div class="container mx-auto px-4 py-8 space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Allocation Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Track your time allocation against cost center percentages</p>
      </div>
      <div class="flex items-center gap-4">
        <USelectMenu
          v-model="selectedPayPeriodId"
          :options="payPeriodOptions"
          placeholder="Select Pay Period"
          option-attribute="label"
          value-attribute="value"
        />
        <UToggle 
          v-model="autoRefresh"
          icon="i-heroicons-arrow-path"
        />
        <span class="text-sm text-gray-500">Auto-refresh</span>
      </div>
    </div>

    <!-- Dashboard Component -->
    <AllocationDashboard
      :pay-period-id="selectedPayPeriodId"
      :auto-refresh="autoRefresh"
      :refresh-interval="30000"
    />

    <!-- Quick Actions Card -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Quick Actions</h3>
      </template>
      <div class="flex flex-wrap gap-4">
        <UButton
          to="/cost-centers"
          icon="i-heroicons-cog-6-tooth"
          variant="outline"
        >
          Manage Cost Centers
        </UButton>
        <UButton
          to="/pay-periods"
          icon="i-heroicons-calendar-days"
          variant="outline"
        >
          Manage Pay Periods
        </UButton>
        <UButton
          to="/time-entry"
          icon="i-heroicons-clock"
          variant="outline"
        >
          Add Time Entry
        </UButton>
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="outline"
          @click="exportData"
          :loading="exporting"
        >
          Export Data
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  title: 'Allocation Dashboard',
  description: 'Track time allocation against cost center percentages'
})

// State
const selectedPayPeriodId = ref<string>('')
const autoRefresh = ref(false)
const exporting = ref(false)

// Mock pay period options (replace with actual API call)
const payPeriodOptions = computed(() => [
  {
    label: 'Current Pay Period (Dec 1-15, 2024)',
    value: 'current-period-1',
  },
  {
    label: 'Previous Pay Period (Nov 15-30, 2024)', 
    value: 'previous-period-1',
  },
  {
    label: 'Nov 1-15, 2024',
    value: 'period-nov-1-15',
  }
])

// Methods
async function exportData() {
  exporting.value = true
  try {
    // TODO: Implement export functionality
    await new Promise(resolve => setTimeout(resolve, 2000)) // Mock delay
    
    // Create mock CSV data
    const csvData = [
      ['Cost Center', 'Expected Hours', 'Actual Hours', 'Variance', 'Status'],
      ['123-456-789', '32.00', '30.50', '-1.50', 'Under'],
      ['123-456-790', '8.00', '9.25', '+1.25', 'Over']
    ].map(row => row.join(',')).join('\n')
    
    // Download CSV
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `allocation-report-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    
    // Toast notification
    const toast = useToast()
    toast.add({
      title: 'Export Complete',
      description: 'Allocation report has been downloaded',
      color: 'success'
    })
  } catch (error) {
    console.error('Export error:', error)
    const toast = useToast()
    toast.add({
      title: 'Export Failed',
      description: 'Failed to export allocation report',
      color: 'error'
    })
  } finally {
    exporting.value = false
  }
}

// Auto-select first pay period on mount
onMounted(() => {
  if (payPeriodOptions.value.length > 0) {
    selectedPayPeriodId.value = payPeriodOptions.value[0].value
  }
})
</script>
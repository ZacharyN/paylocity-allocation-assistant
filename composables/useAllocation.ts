// Composable for allocation tracking and dashboard management

import type { CostCenter, PayPeriod, TimeEntry, AllocationSummary } from '~/types'
import { calculateExpectedHours, getAllocationStatus } from '~/utils/time'

export const useAllocation = () => {
  // State
  const allocations = ref<AllocationSummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPayPeriod = ref<PayPeriod | null>(null)
  const timeEntries = ref<TimeEntry[]>([])

  // Computed
  const totalExpectedHours = computed(() => {
    return allocations.value.reduce((sum, allocation) => sum + allocation.expectedHours, 0)
  })

  const totalActualHours = computed(() => {
    return allocations.value.reduce((sum, allocation) => sum + allocation.actualHours, 0)
  })

  const overallVariance = computed(() => {
    return totalActualHours.value - totalExpectedHours.value
  })

  const overallStatus = computed(() => {
    if (!currentPayPeriod.value) return 'exact'
    return getAllocationStatus(totalActualHours.value, totalExpectedHours.value)
  })

  const progressPercentage = computed(() => {
    if (!currentPayPeriod.value || totalExpectedHours.value === 0) return 0
    return Math.min((totalActualHours.value / totalExpectedHours.value) * 100, 100)
  })

  // Methods
  const fetchAllocationData = async (payPeriodId: string) => {
    try {
      loading.value = true
      error.value = null

      // Fetch pay period, cost centers, and time entries in parallel
      const [payPeriodResponse, costCentersResponse, timeEntriesResponse] = await Promise.all([
        $fetch<{ success: boolean; data: PayPeriod }>(`/api/pay-periods/${payPeriodId}`),
        $fetch<{ success: boolean; data: CostCenter[] }>('/api/cost-centers'),
        $fetch<{ success: boolean; data: TimeEntry[] }>(`/api/time-entries?payPeriodId=${payPeriodId}`)
      ])

      if (!payPeriodResponse.success || !costCentersResponse.success || !timeEntriesResponse.success) {
        throw new Error('Failed to fetch allocation data')
      }

      currentPayPeriod.value = payPeriodResponse.data
      timeEntries.value = timeEntriesResponse.data || []
      
      // Calculate allocations
      calculateAllocations(costCentersResponse.data || [], timeEntriesResponse.data || [])
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch allocation data'
    } finally {
      loading.value = false
    }
  }

  const calculateAllocations = (costCenters: CostCenter[], entries: TimeEntry[]) => {
    if (!currentPayPeriod.value) return

    allocations.value = costCenters.map(costCenter => {
      const expectedHours = calculateExpectedHours(costCenter.percentage, currentPayPeriod.value!.totalHours)
      
      // Calculate actual hours for this cost center
      const actualHours = entries
        .filter(entry => entry.costCenterId === costCenter.id)
        .reduce((sum, entry) => sum + entry.calculatedHours, 0)

      const variance = actualHours - expectedHours
      const percentageComplete = expectedHours > 0 ? (actualHours / expectedHours) * 100 : 0
      const status = getAllocationStatus(actualHours, expectedHours)

      return {
        costCenter,
        expectedHours,
        actualHours,
        variance,
        percentageComplete: Math.min(percentageComplete, 100),
        status
      }
    })
  }

  const refreshAllocations = async () => {
    if (currentPayPeriod.value) {
      await fetchAllocationData(currentPayPeriod.value.id)
    }
  }

  const getStatusColor = (status: AllocationSummary['status']) => {
    switch (status) {
      case 'exact':
      case 'close':
        return 'green'
      case 'under':
        return 'yellow'
      case 'over':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusIcon = (status: AllocationSummary['status']) => {
    switch (status) {
      case 'exact':
        return 'i-heroicons-check-circle'
      case 'close':
        return 'i-heroicons-exclamation-triangle'
      case 'under':
        return 'i-heroicons-arrow-down-circle'
      case 'over':
        return 'i-heroicons-arrow-up-circle'
      default:
        return 'i-heroicons-question-mark-circle'
    }
  }

  const getStatusText = (status: AllocationSummary['status']) => {
    switch (status) {
      case 'exact':
        return 'On Target'
      case 'close':
        return 'Close'
      case 'under':
        return 'Under Hours'
      case 'over':
        return 'Over Hours'
      default:
        return 'Unknown'
    }
  }

  return {
    // State
    allocations: readonly(allocations),
    loading: readonly(loading),
    error: readonly(error),
    currentPayPeriod: readonly(currentPayPeriod),
    timeEntries: readonly(timeEntries),

    // Computed
    totalExpectedHours,
    totalActualHours,
    overallVariance,
    overallStatus,
    progressPercentage,

    // Methods
    fetchAllocationData,
    refreshAllocations,
    getStatusColor,
    getStatusIcon,
    getStatusText
  }
}
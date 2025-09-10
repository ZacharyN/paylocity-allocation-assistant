// Composable for cost center management

import type { CostCenter, CostCenterFormData, ValidationError } from '~/types'

export const useCostCenters = () => {
  // State
  const costCenters = ref<CostCenter[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const totalPercentage = computed(() => {
    return costCenters.value.reduce((sum, cc) => sum + cc.percentage, 0)
  })

  const isPercentageValid = computed(() => {
    return Math.abs(totalPercentage.value - 100) < 0.01
  })

  // Methods
  const fetchCostCenters = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch<{ success: boolean; data: CostCenter[] }>('/api/cost-centers')
      
      if (response.success) {
        costCenters.value = response.data || []
      } else {
        throw new Error('Failed to fetch cost centers')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    } finally {
      loading.value = false
    }
  }

  const createCostCenter = async (data: CostCenterFormData) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{ success: boolean; data: CostCenter; errors?: ValidationError[] }>('/api/cost-centers', {
        method: 'POST',
        body: data
      })

      if (response.success && response.data) {
        costCenters.value.push(response.data)
        return { success: true, data: response.data }
      } else {
        return { success: false, errors: response.errors || [] }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create cost center'
      return { success: false, errors: [{ field: 'general', message: error.value }] }
    } finally {
      loading.value = false
    }
  }

  const updateCostCenter = async (id: string, data: Partial<CostCenterFormData>) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch<{ success: boolean; data: CostCenter; errors?: ValidationError[] }>(`/api/cost-centers/${id}`, {
        method: 'PUT',
        body: data
      })

      if (response.success && response.data) {
        const index = costCenters.value.findIndex(cc => cc.id === id)
        if (index !== -1) {
          costCenters.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, errors: response.errors || [] }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update cost center'
      return { success: false, errors: [{ field: 'general', message: error.value }] }
    } finally {
      loading.value = false
    }
  }

  const deleteCostCenter = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      await $fetch(`/api/cost-centers/${id}`, {
        method: 'DELETE'
      })

      costCenters.value = costCenters.value.filter(cc => cc.id !== id)
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete cost center'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    costCenters: readonly(costCenters),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    totalPercentage,
    isPercentageValid,
    
    // Methods
    fetchCostCenters,
    createCostCenter,
    updateCostCenter,
    deleteCostCenter
  }
}
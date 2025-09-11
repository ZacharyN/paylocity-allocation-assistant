// Time entry management composable
import type { TimeEntry, TimeEntryFormData, DayTimeEntry, CostCenter, PayPeriod } from '@/types'
import { calculateHours, isValidTimeRange, formatHours } from '@/utils/time'

interface TimeEntryState {
  entries: Ref<TimeEntry[]>
  loading: Ref<boolean>
  error: Ref<string | null>
}

export const useTimeEntries = (payPeriodId?: string) => {
  // State management
  const entries = ref<TimeEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get time entries for a specific pay period
  const { data: entriesData, refresh: refreshEntries } = useFetch<TimeEntry[]>(
    () => payPeriodId ? `/api/time-entries?payPeriodId=${payPeriodId}` : null,
    {
      key: `time-entries-${payPeriodId}`,
      server: false,
      default: () => []
    }
  )

  // Watch for data changes and update local state
  watchEffect(() => {
    if (entriesData.value) {
      entries.value = entriesData.value
    }
  })

  // Group entries by date for calendar display
  const entriesByDate = computed(() => {
    const grouped: Record<string, DayTimeEntry> = {}
    
    entries.value.forEach(entry => {
      const dateKey = new Date(entry.date).toISOString().split('T')[0]
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          entries: [],
          totalHours: 0
        }
      }
      
      grouped[dateKey].entries.push(entry)
      grouped[dateKey].totalHours += entry.calculatedHours
    })
    
    return grouped
  })

  // Get calendar days for a pay period
  const getCalendarDays = (payPeriod: PayPeriod) => {
    const days: Array<{ date: string; dayEntry: DayTimeEntry | null }> = []
    const startDate = new Date(payPeriod.startDate)
    const endDate = new Date(payPeriod.endDate)
    
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0]
      days.push({
        date: dateKey,
        dayEntry: entriesByDate.value[dateKey] || null
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  // Validation functions
  const validateTimeEntry = (formData: TimeEntryFormData): string[] => {
    const errors: string[] = []
    
    // Time format and range validation
    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
      if (formData.startTime >= formData.endTime) {
        errors.push('End time must be after start time')
      } else {
        errors.push('Invalid time format. Use HH:MM format (24-hour)')
      }
    }
    
    // Check for overlapping entries on the same date
    const existingEntries = entriesByDate.value[formData.date]?.entries || []
    const newStartTime = formData.startTime
    const newEndTime = formData.endTime
    
    for (const entry of existingEntries) {
      const existingStart = entry.startTime
      const existingEnd = entry.endTime
      
      // Check if times overlap
      if (
        (newStartTime >= existingStart && newStartTime < existingEnd) ||
        (newEndTime > existingStart && newEndTime <= existingEnd) ||
        (newStartTime <= existingStart && newEndTime >= existingEnd)
      ) {
        errors.push(`Time conflicts with existing entry ${existingStart}-${existingEnd}`)
        break
      }
    }
    
    // Check if cost center is selected
    if (!formData.costCenterId) {
      errors.push('Please select a cost center')
    }
    
    return errors
  }

  // Create new time entry
  const createTimeEntry = async (formData: TimeEntryFormData): Promise<boolean> => {
    const validationErrors = validateTimeEntry(formData)
    if (validationErrors.length > 0) {
      error.value = validationErrors.join('; ')
      return false
    }

    loading.value = true
    error.value = null

    try {
      const calculatedHours = calculateHours(formData.startTime, formData.endTime)
      
      const { data } = await $fetch<{ success: boolean; data: TimeEntry }>('/api/time-entries', {
        method: 'POST',
        body: {
          ...formData,
          calculatedHours,
          date: new Date(formData.date)
        }
      })

      if (data) {
        entries.value.push(data)
        await refreshEntries()
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('Error creating time entry:', err)
      error.value = err.data?.error || 'Failed to create time entry'
      return false
    } finally {
      loading.value = false
    }
  }

  // Update existing time entry
  const updateTimeEntry = async (id: string, updates: Partial<TimeEntryFormData>): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      let calculatedHours: number | undefined
      if (updates.startTime && updates.endTime) {
        calculatedHours = calculateHours(updates.startTime, updates.endTime)
      }

      const { data } = await $fetch<{ success: boolean; data: TimeEntry }>(`/api/time-entries/${id}`, {
        method: 'PUT',
        body: {
          ...updates,
          ...(calculatedHours !== undefined && { calculatedHours }),
          ...(updates.date && { date: new Date(updates.date) })
        }
      })

      if (data) {
        const index = entries.value.findIndex(entry => entry.id === id)
        if (index !== -1) {
          entries.value[index] = data
        }
        await refreshEntries()
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('Error updating time entry:', err)
      error.value = err.data?.error || 'Failed to update time entry'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete time entry
  const deleteTimeEntry = async (id: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await $fetch(`/api/time-entries/${id}`, {
        method: 'DELETE'
      })

      entries.value = entries.value.filter(entry => entry.id !== id)
      await refreshEntries()
      return true
    } catch (err: any) {
      console.error('Error deleting time entry:', err)
      error.value = err.data?.error || 'Failed to delete time entry'
      return false
    } finally {
      loading.value = false
    }
  }

  // Calculate total hours for a specific cost center
  const getTotalHoursForCostCenter = (costCenterId: string): number => {
    return entries.value
      .filter(entry => entry.costCenterId === costCenterId)
      .reduce((total, entry) => total + entry.calculatedHours, 0)
  }

  // Calculate daily total hours
  const getDailyTotalHours = (date: string): number => {
    return entriesByDate.value[date]?.totalHours || 0
  }

  // Format hours for display
  const formatDisplayHours = (hours: number): string => {
    return formatHours(hours)
  }

  // Clear all entries (for testing/reset)
  const clearEntries = () => {
    entries.value = []
    error.value = null
  }

  return {
    // State
    entries: readonly(entries),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    entriesByDate: readonly(entriesByDate),
    
    // Methods
    getCalendarDays,
    validateTimeEntry,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    getTotalHoursForCostCenter,
    getDailyTotalHours,
    formatDisplayHours,
    clearEntries,
    refreshEntries
  }
}
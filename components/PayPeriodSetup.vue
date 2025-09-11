<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Pay Period Setup</h2>
      <p class="text-gray-600">Configure your pay period dates and total hours for accurate time allocation tracking.</p>
    </div>

    <!-- Pay Period Form -->
    <UCard class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold">New Pay Period</h3>
      </template>

      <UForm :state="formState" :schema="payPeriodSchema" class="space-y-6" @submit="handleSubmit" @error="handleError">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Start Date -->
          <UFormField label="Start Date" name="startDate" required>
            <UInput 
              v-model="formState.startDate" 
              type="date" 
              :min="minDate"
              placeholder="Select start date"
            />
          </UFormField>

          <!-- End Date -->
          <UFormField label="End Date" name="endDate" required>
            <UInput 
              v-model="formState.endDate" 
              type="date" 
              :min="formState.startDate || minDate"
              placeholder="Select end date"
            />
          </UFormField>
        </div>

        <!-- Total Hours -->
        <UFormField label="Total Hours" name="totalHours" required>
          <UInput 
            v-model="formState.totalHours" 
            type="number" 
            min="0.5" 
            max="200" 
            step="0.5"
            placeholder="e.g., 80"
          />
          <template #help>
            <span class="text-sm text-gray-500">Total hours expected for this pay period</span>
          </template>
        </UFormField>

        <!-- Form Actions -->
        <div class="flex gap-3">
          <UButton 
            type="submit" 
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            Create Pay Period
          </UButton>
          
          <UButton 
            color="gray" 
            variant="outline"
            @click="resetForm"
          >
            Reset
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Existing Pay Periods -->
    <UCard v-if="payPeriods.length > 0">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Existing Pay Periods</h3>
          <UButton 
            size="sm" 
            variant="outline" 
            @click="fetchPayPeriods"
            :loading="isLoading"
          >
            Refresh
          </UButton>
        </div>
      </template>

      <div class="space-y-4">
        <div 
          v-for="period in payPeriods" 
          :key="period.id"
          class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <div class="font-medium text-gray-900">
                {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ period.totalHours }} hours • {{ calculateDays(period.startDate, period.endDate) }} days
              </div>
              <div class="text-xs text-gray-500">
                Created {{ formatDateTime(period.createdAt) }}
              </div>
            </div>
            
            <div class="flex gap-2">
              <UButton 
                size="xs" 
                color="red" 
                variant="outline"
                @click="deletePeriod(period.id)"
                :loading="period.deleting"
              >
                Delete
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-else-if="!isLoading">
      <div class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-calendar" class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Pay Periods Yet</h3>
        <p class="text-gray-600 mb-4">Create your first pay period to start tracking time allocations.</p>
      </div>
    </UCard>

    <!-- Loading State -->
    <div v-if="isLoading && payPeriods.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
      <p class="text-gray-500">Loading pay periods...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'

// Mock user ID - in real app this would come from auth
const userId = 'demo-user'

// Form validation schema
const payPeriodSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  totalHours: z.string().min(1, 'Total hours is required')
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine((data) => {
  const hours = parseFloat(data.totalHours)
  return hours > 0 && hours <= 200
}, {
  message: 'Total hours must be between 0.5 and 200',
  path: ['totalHours']
})

type PayPeriodSchema = z.infer<typeof payPeriodSchema>

// Reactive state
const formState = reactive<Partial<PayPeriodSchema>>({
  startDate: '',
  endDate: '',
  totalHours: ''
})

const payPeriods = ref<any[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const toast = useToast()

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6))
  return sixMonthsAgo.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return formState.startDate && 
         formState.endDate && 
         formState.totalHours && 
         new Date(formState.endDate) > new Date(formState.startDate) &&
         parseFloat(formState.totalHours) > 0
})

// Methods
const fetchPayPeriods = async () => {
  try {
    isLoading.value = true
    const response = await $fetch(`/api/pay-periods?userId=${userId}`)
    payPeriods.value = response || []
  } catch (error) {
    console.error('Failed to fetch pay periods:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load pay periods',
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (event: FormSubmitEvent<PayPeriodSchema>) => {
  try {
    isSubmitting.value = true
    
    const response = await $fetch('/api/pay-periods', {
      method: 'POST',
      body: {
        startDate: event.data.startDate,
        endDate: event.data.endDate,
        totalHours: parseFloat(event.data.totalHours),
        userId
      }
    })

    toast.add({
      title: 'Success',
      description: 'Pay period created successfully',
      color: 'green'
    })

    resetForm()
    await fetchPayPeriods()
  } catch (error: any) {
    console.error('Failed to create pay period:', error)
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to create pay period',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleError = (event: FormErrorEvent) => {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const resetForm = () => {
  formState.startDate = ''
  formState.endDate = ''
  formState.totalHours = ''
}

const deletePeriod = async (id: string) => {
  const period = payPeriods.value.find(p => p.id === id)
  if (!period) return

  try {
    period.deleting = true
    
    await $fetch(`/api/pay-periods/${id}`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Success',
      description: 'Pay period deleted successfully',
      color: 'green'
    })

    await fetchPayPeriods()
  } catch (error: any) {
    console.error('Failed to delete pay period:', error)
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to delete pay period',
      color: 'red'
    })
  } finally {
    period.deleting = false
  }
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const calculateDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Auto-set end date when start date changes
watch(() => formState.startDate, (newStartDate) => {
  if (newStartDate && !formState.endDate) {
    const start = new Date(newStartDate)
    const end = new Date(start)
    end.setDate(start.getDate() + 13) // Default 2-week period
    formState.endDate = end.toISOString().split('T')[0]
  }
})

// Load initial data
onMounted(() => {
  fetchPayPeriods()
})
</script>
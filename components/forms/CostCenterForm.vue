<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-plus-circle" class="w-5 h-5 text-primary-500" />
        <h3 class="text-lg font-semibold">Add New Cost Center</h3>
      </div>
    </template>

    <UForm 
      ref="formRef"
      :schema="schema" 
      :state="state" 
      class="space-y-6" 
      @submit="onSubmit"
      @error="onError"
    >
      <div class="grid gap-4 md:grid-cols-3">
        <UFormField 
          label="Division" 
          name="division"
          required
          help="3-digit division code"
        >
          <UInput 
            v-model="state.division" 
            type="number"
            placeholder="e.g. 123"
            min="0"
            max="999"
            :ui="{ wrapper: 'w-full' }"
          />
        </UFormField>

        <UFormField 
          label="Funding" 
          name="funding"
          required
          help="3-digit funding code"
        >
          <UInput 
            v-model="state.funding" 
            type="number"
            placeholder="e.g. 456"
            min="0"
            max="999"
            :ui="{ wrapper: 'w-full' }"
          />
        </UFormField>

        <UFormField 
          label="Program" 
          name="program"
          required
          help="3-digit program code"
        >
          <UInput 
            v-model="state.program" 
            type="number"
            placeholder="e.g. 789"
            min="0"
            max="999"
            :ui="{ wrapper: 'w-full' }"
          />
        </UFormField>
      </div>

      <UFormField 
        label="Allocation Percentage" 
        name="percentage"
        required
        help="Percentage of time allocated to this cost center"
      >
        <div class="flex items-center gap-2">
          <UInput 
            v-model="state.percentage" 
            type="number"
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
            class="flex-1"
          />
          <span class="text-gray-500 text-sm">%</span>
        </div>
      </UFormField>

      <div class="flex items-center gap-3 pt-4">
        <UButton 
          type="submit" 
          color="primary"
          :loading="loading"
          icon="i-lucide-plus"
        >
          Add Cost Center
        </UButton>
        
        <UButton 
          type="button"
          variant="outline"
          @click="resetForm"
          :disabled="loading"
        >
          Clear
        </UButton>

        <div v-if="state.division && state.funding && state.program" class="ml-auto">
          <UBadge variant="subtle" color="gray">
            {{ `${String(state.division).padStart(3, '0')}-${String(state.funding).padStart(3, '0')}-${String(state.program).padStart(3, '0')}` }}
          </UBadge>
        </div>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import Joi from 'joi'
import type { FormSubmitEvent } from '@nuxt/ui'

// Define the form state type
interface CostCenterFormState {
  division: number | undefined
  funding: number | undefined  
  program: number | undefined
  percentage: number | undefined
}

// Validation schema using Joi
const schema = Joi.object({
  division: Joi.number()
    .integer()
    .min(0)
    .max(999)
    .required()
    .messages({
      'number.base': 'Division must be a number',
      'number.min': 'Division must be between 0 and 999',
      'number.max': 'Division must be between 0 and 999',
      'any.required': 'Division is required'
    }),
  funding: Joi.number()
    .integer()
    .min(0)
    .max(999) 
    .required()
    .messages({
      'number.base': 'Funding must be a number',
      'number.min': 'Funding must be between 0 and 999',
      'number.max': 'Funding must be between 0 and 999',
      'any.required': 'Funding is required'
    }),
  program: Joi.number()
    .integer()
    .min(0)
    .max(999)
    .required()
    .messages({
      'number.base': 'Program must be a number',
      'number.min': 'Program must be between 0 and 999', 
      'number.max': 'Program must be between 0 and 999',
      'any.required': 'Program is required'
    }),
  percentage: Joi.number()
    .min(0.01)
    .max(100)
    .precision(2)
    .required()
    .messages({
      'number.base': 'Percentage must be a number',
      'number.min': 'Percentage must be greater than 0',
      'number.max': 'Percentage cannot exceed 100%',
      'any.required': 'Percentage is required'
    })
})

// Form state
const state = reactive<CostCenterFormState>({
  division: undefined,
  funding: undefined,
  program: undefined,
  percentage: undefined
})

// Form ref and loading state
const formRef = ref()
const loading = ref(false)

// Toast for notifications
const toast = useToast()

// Emits
const emit = defineEmits<{
  submit: [costCenter: { division: number; funding: number; program: number; percentage: number }]
  error: [error: any]
}>()

// Form submission handler
async function onSubmit(event: FormSubmitEvent<CostCenterFormState>) {
  if (!event.data.division || !event.data.funding || !event.data.program || !event.data.percentage) {
    return
  }

  loading.value = true
  
  try {
    const costCenterData = {
      division: event.data.division,
      funding: event.data.funding,
      program: event.data.program,
      percentage: event.data.percentage
    }

    // Emit the submit event to parent component
    emit('submit', costCenterData)
    
    // Reset form on successful submission
    resetForm()
    
    toast.add({
      title: 'Success',
      description: 'Cost center added successfully',
      color: 'success'
    })
    
  } catch (error) {
    console.error('Error submitting cost center:', error)
    emit('error', error)
    
    toast.add({
      title: 'Error',
      description: 'Failed to add cost center. Please try again.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Error handler
function onError(event: any) {
  console.error('Form validation error:', event)
}

// Reset form
function resetForm() {
  state.division = undefined
  state.funding = undefined  
  state.program = undefined
  state.percentage = undefined
  
  // Clear form validation errors
  if (formRef.value) {
    formRef.value.clear()
  }
}

// Expose methods for parent component
defineExpose({
  resetForm
})
</script>
<template>
  <UModal v-model="isOpen" :prevent-close="loading">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon 
            :name="isEditing ? 'i-lucide-edit-3' : 'i-lucide-plus-circle'"
            class="w-5 h-5 text-primary-500" 
          />
          <h3 class="text-lg font-semibold">
            {{ isEditing ? 'Edit Time Entry' : 'Add Time Entry' }}
          </h3>
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
        <!-- Date Display -->
        <div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-500" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ formatDisplayDate(date) }}
          </span>
        </div>

        <!-- Time Fields -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField 
            label="Start Time" 
            name="startTime"
            required
            help="24-hour format (HH:MM)"
          >
            <UInput 
              v-model="state.startTime"
              type="time"
              placeholder="09:00"
              :ui="{ wrapper: 'w-full' }"
            />
          </UFormField>

          <UFormField 
            label="End Time" 
            name="endTime"
            required
            help="24-hour format (HH:MM)"
          >
            <UInput 
              v-model="state.endTime"
              type="time"
              placeholder="17:00"
              :ui="{ wrapper: 'w-full' }"
            />
          </UFormField>
        </div>

        <!-- Calculated Hours Display -->
        <div v-if="calculatedHours > 0" class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <UIcon name="i-lucide-calculator" class="w-4 h-4 text-blue-500" />
          <span class="text-sm text-blue-700 dark:text-blue-300">
            <span class="font-medium">Duration:</span> {{ formatHours(calculatedHours) }} hours
          </span>
        </div>

        <!-- Cost Center Selection -->
        <UFormField 
          label="Cost Center" 
          name="costCenterId"
          required
          help="Select the cost center for this time entry"
        >
          <USelectMenu
            v-model="state.costCenterId"
            :options="costCenterOptions"
            placeholder="Select cost center..."
            searchable
            searchable-placeholder="Search cost centers..."
            :ui="{ wrapper: 'w-full' }"
          >
            <template #label>
              <span v-if="selectedCostCenter">
                {{ formatCostCenter(selectedCostCenter) }}
              </span>
            </template>
            
            <template #option="{ option }">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-2">
                  <UBadge variant="subtle" size="xs">
                    {{ option.code }}
                  </UBadge>
                  <span class="text-sm">{{ option.percentage }}%</span>
                </div>
              </div>
            </template>
          </USelectMenu>
        </UFormField>

        <!-- Validation Messages -->
        <div v-if="validationErrors.length > 0" class="space-y-2">
          <div 
            v-for="error in validationErrors"
            :key="error"
            class="flex items-center gap-2 p-2 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          >
            <UIcon name="i-lucide-alert-triangle" class="w-4 h-4" />
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Existing Entries Warning -->
        <div v-if="hasExistingEntries" class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div class="flex items-start gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-amber-500 mt-0.5" />
            <div class="text-sm text-amber-700 dark:text-amber-300">
              <p class="font-medium mb-1">Existing entries for this date:</p>
              <div class="space-y-1">
                <div 
                  v-for="existingEntry in existingEntries"
                  :key="existingEntry.id"
                  class="flex items-center justify-between text-xs"
                >
                  <span>{{ existingEntry.startTime }} - {{ existingEntry.endTime }}</span>
                  <span class="text-amber-600 dark:text-amber-400">
                    {{ formatHours(existingEntry.calculatedHours) }}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UForm>

      <template #footer>
        <div class="flex items-center justify-between">
          <!-- Delete Button (only for editing) -->
          <div>
            <UButton 
              v-if="isEditing && entry"
              color="red"
              variant="ghost"
              icon="i-lucide-trash-2"
              :loading="deleting"
              @click="confirmDelete"
            >
              Delete
            </UButton>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <UButton 
              variant="outline"
              @click="closeModal"
              :disabled="loading || deleting"
            >
              Cancel
            </UButton>
            
            <UButton 
              type="submit"
              color="primary"
              :icon="isEditing ? 'i-lucide-save' : 'i-lucide-plus'"
              :loading="loading"
              :disabled="!isFormValid || deleting"
              @click="onSubmit"
            >
              {{ isEditing ? 'Save Changes' : 'Add Entry' }}
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import Joi from 'joi'
import type { TimeEntry, CostCenter, TimeEntryFormData } from '@/types'
import { calculateHours, isValidTimeRange, formatHours } from '@/utils/time'

// Props
interface Props {
  modelValue: boolean
  entry?: TimeEntry | null
  date?: string
  costCenters: CostCenter[]
}

const props = withDefaults(defineProps<Props>(), {
  entry: null,
  date: '',
  costCenters: () => []
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: TimeEntryFormData]
  delete: [entryId: string]
}>()

// Form state interface
interface TimeEntryFormState {
  startTime: string
  endTime: string
  costCenterId: string
}

// Computed model value
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// State
const state = reactive<TimeEntryFormState>({
  startTime: '',
  endTime: '',
  costCenterId: ''
})

const formRef = ref()
const loading = ref(false)
const deleting = ref(false)
const validationErrors = ref<string[]>([])

// Computed properties
const isEditing = computed(() => !!props.entry)

const calculatedHours = computed(() => {
  if (!state.startTime || !state.endTime) return 0
  if (!isValidTimeRange(state.startTime, state.endTime)) return 0
  return calculateHours(state.startTime, state.endTime)
})

const costCenterOptions = computed(() => {
  return props.costCenters.map(cc => ({
    value: cc.id,
    label: `${cc.division}-${cc.funding}-${cc.program}`,
    code: `${cc.division}-${cc.funding}-${cc.program}`,
    percentage: cc.percentage,
    ...cc
  }))
})

const selectedCostCenter = computed(() => {
  return props.costCenters.find(cc => cc.id === state.costCenterId)
})

const existingEntries = computed(() => {
  // This would come from parent component or composable
  // For now, returning empty array - would need to be passed as prop
  return []
})

const hasExistingEntries = computed(() => {
  return existingEntries.value.length > 0
})

const isFormValid = computed(() => {
  return state.startTime && 
         state.endTime && 
         state.costCenterId && 
         calculatedHours.value > 0 &&
         validationErrors.value.length === 0
})

// Validation schema
const schema = Joi.object({
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM format',
      'any.required': 'Start time is required'
    }),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      'string.pattern.base': 'End time must be in HH:MM format',
      'any.required': 'End time is required'
    }),
  costCenterId: Joi.string()
    .required()
    .messages({
      'any.required': 'Please select a cost center'
    })
})

// Helper functions
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatCostCenter = (costCenter: CostCenter): string => {
  return `${costCenter.division}-${costCenter.funding}-${costCenter.program} (${costCenter.percentage}%)`
}

// Validation
const validateForm = (): string[] => {
  const errors: string[] = []
  
  // Time range validation
  if (state.startTime && state.endTime) {
    if (!isValidTimeRange(state.startTime, state.endTime)) {
      if (state.startTime >= state.endTime) {
        errors.push('End time must be after start time')
      } else {
        errors.push('Invalid time format')
      }
    }
  }
  
  // Duration validation
  if (calculatedHours.value > 24) {
    errors.push('Time entry cannot exceed 24 hours')
  }
  
  if (calculatedHours.value < 0.25) {
    errors.push('Time entry must be at least 15 minutes')
  }
  
  return errors
}

// Watch for form changes to validate
watchEffect(() => {
  validationErrors.value = validateForm()
})

// Initialize form when modal opens or entry changes
watch([() => props.modelValue, () => props.entry], () => {
  if (props.modelValue) {
    initializeForm()
  }
})

// Initialize form data
const initializeForm = () => {
  if (props.entry) {
    // Edit mode - populate with existing data
    state.startTime = props.entry.startTime
    state.endTime = props.entry.endTime
    state.costCenterId = props.entry.costCenterId
  } else {
    // Add mode - reset form
    state.startTime = ''
    state.endTime = ''
    state.costCenterId = ''
  }
  
  validationErrors.value = []
  
  if (formRef.value) {
    formRef.value.clear()
  }
}

// Event handlers
const onSubmit = async (event?: any) => {
  // Prevent default if called from template
  if (event?.preventDefault) {
    event.preventDefault()
  }

  // Validate form
  const errors = validateForm()
  if (errors.length > 0) {
    validationErrors.value = errors
    return
  }

  loading.value = true
  
  try {
    const formData: TimeEntryFormData = {
      date: props.date,
      startTime: state.startTime,
      endTime: state.endTime,
      costCenterId: state.costCenterId
    }

    emit('submit', formData)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}

const onError = (event: any) => {
  console.error('Form validation error:', event)
}

const closeModal = () => {
  if (loading.value || deleting.value) return
  emit('update:modelValue', false)
  
  // Reset form after modal closes
  nextTick(() => {
    state.startTime = ''
    state.endTime = ''
    state.costCenterId = ''
    validationErrors.value = []
  })
}

const confirmDelete = async () => {
  if (!props.entry) return
  
  deleting.value = true
  try {
    emit('delete', props.entry.id)
  } finally {
    deleting.value = false
  }
}

// Initialize form when component mounts and modal is already open
onMounted(() => {
  if (props.modelValue) {
    initializeForm()
  }
})
</script>
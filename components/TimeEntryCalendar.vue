<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar-days" class="w-5 h-5 text-primary-500" />
          <h3 class="text-lg font-semibold">Time Entry Calendar</h3>
        </div>
        
        <div v-if="selectedPayPeriod" class="flex items-center gap-2 text-sm text-gray-500">
          <UBadge variant="subtle" color="blue">
            {{ formatPeriodDates(selectedPayPeriod) }}
          </UBadge>
          <span class="text-xs">{{ selectedPayPeriod.totalHours }}h total</span>
        </div>
      </div>
    </template>

    <!-- Pay Period Selection -->
    <div v-if="!selectedPayPeriod" class="p-6 text-center">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-lucide-calendar-x" class="w-12 h-12 text-gray-400" />
        <div class="space-y-2">
          <h4 class="text-lg font-medium text-gray-900 dark:text-white">No Pay Period Selected</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Please select a pay period to start tracking your time entries.
          </p>
        </div>
        <UButton 
          color="primary"
          icon="i-lucide-plus"
          @click="$emit('createPayPeriod')"
        >
          Create Pay Period
        </UButton>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div v-else class="space-y-6">
      <!-- Calendar Header -->
      <div class="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="min-h-[120px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          :class="{
            'bg-gray-50 dark:bg-gray-800/50': !isPayPeriodDate(day.date),
            'bg-white dark:bg-gray-900': isPayPeriodDate(day.date),
            'ring-2 ring-primary-500 ring-inset': day.date === selectedDate
          }"
        >
          <!-- Date Header -->
          <div 
            class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700"
            :class="{
              'bg-gray-50 dark:bg-gray-800': !isPayPeriodDate(day.date),
              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800': isPayPeriodDate(day.date)
            }"
            @click="isPayPeriodDate(day.date) && selectDate(day.date)"
          >
            <span 
              class="text-sm font-medium"
              :class="{
                'text-gray-400 dark:text-gray-500': !isPayPeriodDate(day.date),
                'text-gray-900 dark:text-white': isPayPeriodDate(day.date),
                'text-primary-600 dark:text-primary-400': day.date === selectedDate
              }"
            >
              {{ formatDayNumber(day.date) }}
            </span>
            
            <div v-if="day.dayEntry" class="flex items-center gap-1">
              <span class="text-xs text-gray-500">{{ formatDisplayHours(day.dayEntry.totalHours) }}h</span>
              <div 
                class="w-2 h-2 rounded-full"
                :class="{
                  'bg-green-500': day.dayEntry.totalHours >= 8,
                  'bg-yellow-500': day.dayEntry.totalHours >= 4 && day.dayEntry.totalHours < 8,
                  'bg-red-500': day.dayEntry.totalHours < 4 && day.dayEntry.totalHours > 0,
                  'bg-gray-300': day.dayEntry.totalHours === 0
                }"
              />
            </div>
          </div>

          <!-- Time Entries List -->
          <div v-if="isPayPeriodDate(day.date)" class="p-1 space-y-1 max-h-[80px] overflow-y-auto">
            <div
              v-for="entry in day.dayEntry?.entries || []"
              :key="entry.id"
              class="group flex items-center justify-between p-1 rounded text-xs bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 cursor-pointer transition-colors"
              @click="editEntry(entry)"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1 text-primary-700 dark:text-primary-300">
                  <span class="font-medium">{{ entry.startTime }}-{{ entry.endTime }}</span>
                  <span class="text-primary-500 dark:text-primary-400">({{ formatDisplayHours(entry.calculatedHours) }}h)</span>
                </div>
                <div class="text-gray-500 dark:text-gray-400 truncate">
                  CC: {{ getCostCenterDisplay(entry.costCenterId) }}
                </div>
              </div>
              <UButton
                variant="ghost"
                size="xs"
                icon="i-lucide-x"
                class="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                @click.stop="confirmDelete(entry)"
              />
            </div>
            
            <!-- Add Entry Button -->
            <UButton
              v-if="isPayPeriodDate(day.date)"
              variant="ghost"
              size="xs"
              icon="i-lucide-plus"
              class="w-full justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-dashed border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              @click="addEntry(day.date)"
            >
              Add Entry
            </UButton>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <UCard class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Logged</p>
              <p class="text-xl font-bold text-blue-700 dark:text-blue-300">{{ formatDisplayHours(totalLoggedHours) }}h</p>
            </div>
          </div>
        </UCard>

        <UCard class="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <UIcon name="i-lucide-target" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm text-green-600 dark:text-green-400 font-medium">Expected</p>
              <p class="text-xl font-bold text-green-700 dark:text-green-300">{{ selectedPayPeriod.totalHours }}h</p>
            </div>
          </div>
        </UCard>

        <UCard class="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">Progress</p>
              <p class="text-xl font-bold text-amber-700 dark:text-amber-300">{{ progressPercentage }}%</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Time Entry Modal -->
    <TimeEntryModal
      v-model="showEntryModal"
      :entry="selectedEntry"
      :date="selectedDate"
      :cost-centers="costCenters"
      @submit="handleEntrySubmit"
      @delete="handleEntryDelete"
    />

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trash-2" class="w-5 h-5 text-red-500" />
            <h3 class="text-lg font-semibold">Delete Time Entry</h3>
          </div>
        </template>
        
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this time entry? This action cannot be undone.
          </p>
          
          <div v-if="entryToDelete" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="text-sm">
              <span class="font-medium">{{ entryToDelete.startTime }} - {{ entryToDelete.endTime }}</span>
              <span class="text-gray-500 ml-2">({{ formatDisplayHours(entryToDelete.calculatedHours) }} hours)</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              Cost Center: {{ getCostCenterDisplay(entryToDelete.costCenterId) }}
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="flex items-center gap-3">
            <UButton
              variant="outline"
              @click="showDeleteModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              icon="i-lucide-trash-2"
              :loading="deleting"
              @click="handleConfirmedDelete"
            >
              Delete Entry
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import type { PayPeriod, CostCenter, TimeEntry, TimeEntryFormData } from '@/types'

// Props
interface Props {
  selectedPayPeriod?: PayPeriod | null
  costCenters: CostCenter[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedPayPeriod: null,
  costCenters: () => []
})

// Emits
const emit = defineEmits<{
  createPayPeriod: []
}>()

// State
const selectedDate = ref<string>('')
const selectedEntry = ref<TimeEntry | null>(null)
const showEntryModal = ref(false)
const showDeleteModal = ref(false)
const entryToDelete = ref<TimeEntry | null>(null)
const deleting = ref(false)

// Time entries composable
const {
  entries,
  loading,
  error,
  entriesByDate,
  getCalendarDays,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  formatDisplayHours
} = useTimeEntries(props.selectedPayPeriod?.id)

// Toast notifications
const toast = useToast()

// Computed properties
const calendarDays = computed(() => {
  if (!props.selectedPayPeriod) return []
  return getCalendarDays(props.selectedPayPeriod)
})

const totalLoggedHours = computed(() => {
  return entries.value.reduce((total, entry) => total + entry.calculatedHours, 0)
})

const progressPercentage = computed(() => {
  if (!props.selectedPayPeriod || props.selectedPayPeriod.totalHours === 0) return 0
  return Math.round((totalLoggedHours.value / props.selectedPayPeriod.totalHours) * 100)
})

// Helper functions
const formatPeriodDates = (payPeriod: PayPeriod): string => {
  const startDate = new Date(payPeriod.startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
  const endDate = new Date(payPeriod.endDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
  return `${startDate} - ${endDate}`
}

const formatDayNumber = (dateString: string): string => {
  return new Date(dateString).getDate().toString()
}

const isPayPeriodDate = (dateString: string): boolean => {
  if (!props.selectedPayPeriod) return false
  const date = new Date(dateString)
  const startDate = new Date(props.selectedPayPeriod.startDate)
  const endDate = new Date(props.selectedPayPeriod.endDate)
  return date >= startDate && date <= endDate
}

const getCostCenterDisplay = (costCenterId: string): string => {
  const costCenter = props.costCenters.find(cc => cc.id === costCenterId)
  if (!costCenter) return 'Unknown'
  return `${costCenter.division}-${costCenter.funding}-${costCenter.program}`
}

// Event handlers
const selectDate = (date: string) => {
  selectedDate.value = date
}

const addEntry = (date: string) => {
  selectedDate.value = date
  selectedEntry.value = null
  showEntryModal.value = true
}

const editEntry = (entry: TimeEntry) => {
  selectedDate.value = new Date(entry.date).toISOString().split('T')[0]
  selectedEntry.value = entry
  showEntryModal.value = true
}

const confirmDelete = (entry: TimeEntry) => {
  entryToDelete.value = entry
  showDeleteModal.value = true
}

const handleEntrySubmit = async (formData: TimeEntryFormData) => {
  try {
    let success = false
    
    if (selectedEntry.value) {
      // Update existing entry
      success = await updateTimeEntry(selectedEntry.value.id, formData)
      if (success) {
        toast.add({
          title: 'Success',
          description: 'Time entry updated successfully',
          color: 'success'
        })
      }
    } else {
      // Create new entry
      success = await createTimeEntry(formData)
      if (success) {
        toast.add({
          title: 'Success', 
          description: 'Time entry created successfully',
          color: 'success'
        })
      }
    }
    
    if (success) {
      showEntryModal.value = false
      selectedEntry.value = null
    } else if (error.value) {
      toast.add({
        title: 'Error',
        description: error.value,
        color: 'error'
      })
    }
  } catch (err) {
    console.error('Error handling entry submission:', err)
    toast.add({
      title: 'Error',
      description: 'An unexpected error occurred',
      color: 'error'
    })
  }
}

const handleEntryDelete = async (entryId: string) => {
  const success = await deleteTimeEntry(entryId)
  if (success) {
    toast.add({
      title: 'Success',
      description: 'Time entry deleted successfully',
      color: 'success'
    })
    showEntryModal.value = false
    selectedEntry.value = null
  } else if (error.value) {
    toast.add({
      title: 'Error',
      description: error.value,
      color: 'error'
    })
  }
}

const handleConfirmedDelete = async () => {
  if (!entryToDelete.value) return
  
  deleting.value = true
  try {
    const success = await deleteTimeEntry(entryToDelete.value.id)
    if (success) {
      toast.add({
        title: 'Success',
        description: 'Time entry deleted successfully',
        color: 'success'
      })
      showDeleteModal.value = false
      entryToDelete.value = null
    } else if (error.value) {
      toast.add({
        title: 'Error',
        description: error.value,
        color: 'error'
      })
    }
  } finally {
    deleting.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  selectedDate.value = ''
  selectedEntry.value = null
  showEntryModal.value = false
  showDeleteModal.value = false
  entryToDelete.value = null
})
</script>
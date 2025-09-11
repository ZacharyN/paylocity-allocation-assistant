<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-list" class="w-5 h-5 text-primary-500" />
          <h3 class="text-lg font-semibold">Current Cost Centers</h3>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-sm text-gray-500">
            Total Allocation: 
            <span 
              class="font-semibold ml-1"
              :class="{
                'text-green-600': totalPercentage === 100,
                'text-orange-600': totalPercentage > 0 && totalPercentage < 100,
                'text-red-600': totalPercentage > 100
              }"
            >
              {{ totalPercentage.toFixed(1) }}%
            </span>
          </div>
          <UBadge 
            v-if="totalPercentage === 100" 
            color="success" 
            variant="soft"
          >
            ✓ Complete
          </UBadge>
          <UBadge 
            v-else-if="totalPercentage > 100" 
            color="error" 
            variant="soft"
          >
            ⚠ Over 100%
          </UBadge>
          <UBadge 
            v-else 
            color="warning" 
            variant="soft"
          >
            {{ (100 - totalPercentage).toFixed(1) }}% remaining
          </UBadge>
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
      <p class="text-gray-500">Loading cost centers...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="costCenters.length === 0" class="p-8 text-center text-gray-500">
      <UIcon name="i-lucide-plus-circle" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-lg mb-2">No cost centers configured yet</p>
      <p class="text-sm">Add your first cost center above to get started</p>
    </div>

    <!-- Cost Centers Table -->
    <div v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Cost Center</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Division</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Funding</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Program</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Percentage</th>
              <th class="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="costCenter in costCenters" 
              :key="costCenter.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <!-- Cost Center Code -->
              <td class="py-4 px-4">
                <UBadge variant="outline" color="gray">
                  {{ formatCostCenterCode(costCenter) }}
                </UBadge>
              </td>
              
              <!-- Division -->
              <td class="py-4 px-4">
                <span class="text-sm font-mono">{{ String(costCenter.division).padStart(3, '0') }}</span>
              </td>
              
              <!-- Funding -->
              <td class="py-4 px-4">
                <span class="text-sm font-mono">{{ String(costCenter.funding).padStart(3, '0') }}</span>
              </td>
              
              <!-- Program -->
              <td class="py-4 px-4">
                <span class="text-sm font-mono">{{ String(costCenter.program).padStart(3, '0') }}</span>
              </td>
              
              <!-- Percentage (Editable) -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <div v-if="editingId === costCenter.id" class="flex items-center gap-2">
                    <UInput 
                      v-model="editingPercentage"
                      type="number"
                      size="sm"
                      min="0"
                      max="100"
                      step="0.01"
                      class="w-20"
                      @keyup.enter="savePercentage(costCenter.id)"
                      @keyup.escape="cancelEdit"
                    />
                    <span class="text-xs text-gray-500">%</span>
                    <div class="flex gap-1">
                      <UButton 
                        icon="i-lucide-check"
                        size="xs"
                        color="success"
                        variant="ghost"
                        @click="savePercentage(costCenter.id)"
                      />
                      <UButton 
                        icon="i-lucide-x"
                        size="xs"
                        color="error"
                        variant="ghost"
                        @click="cancelEdit"
                      />
                    </div>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <span class="font-medium">{{ costCenter.percentage }}%</span>
                    <UButton 
                      icon="i-lucide-pencil"
                      size="xs"
                      variant="ghost"
                      @click="startEdit(costCenter.id, costCenter.percentage)"
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="flex-1 ml-2">
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-300"
                        :class="{
                          'bg-green-500': costCenter.percentage <= 100,
                          'bg-red-500': costCenter.percentage > 100
                        }"
                        :style="{ width: `${Math.min(costCenter.percentage, 100)}%` }"
                      />
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Actions -->
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-2">
                  <UButton 
                    icon="i-lucide-trash-2"
                    size="xs"
                    color="error"
                    variant="ghost"
                    @click="deleteCostCenter(costCenter.id)"
                    :loading="deletingIds.includes(costCenter.id)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Validation Warning -->
    <div v-if="costCenters.length > 0 && totalPercentage !== 100" class="mt-4 p-4 rounded-lg border">
      <div v-if="totalPercentage > 100" class="flex items-center gap-2 text-red-700 dark:text-red-400">
        <UIcon name="i-lucide-alert-triangle" class="w-4 h-4" />
        <span class="text-sm font-medium">Total allocation exceeds 100%</span>
      </div>
      <div v-else class="flex items-center gap-2 text-orange-700 dark:text-orange-400">
        <UIcon name="i-lucide-info" class="w-4 h-4" />
        <span class="text-sm font-medium">Total allocation must equal 100% to proceed</span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { CostCenter } from '~/types'

// Props
interface Props {
  userId?: string
  refresh?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  userId: 'default-user',
  refresh: false
})

// Reactive state
const costCenters = ref<CostCenter[]>([])
const loading = ref(false)
const editingId = ref<string | null>(null)
const editingPercentage = ref<number>(0)
const deletingIds = ref<string[]>([])

// Toast for notifications
const toast = useToast()

// Computed properties
const totalPercentage = computed(() => {
  return costCenters.value.reduce((total, cc) => total + cc.percentage, 0)
})

// Emits
const emit = defineEmits<{
  update: [costCenters: CostCenter[]]
  percentageChange: [total: number]
}>()

// Watchers
watch(totalPercentage, (newTotal) => {
  emit('percentageChange', newTotal)
})

watch(() => props.refresh, () => {
  if (props.refresh) {
    fetchCostCenters()
  }
})

// Methods
function formatCostCenterCode(costCenter: CostCenter): string {
  return `${String(costCenter.division).padStart(3, '0')}-${String(costCenter.funding).padStart(3, '0')}-${String(costCenter.program).padStart(3, '0')}`
}

async function fetchCostCenters() {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch(`/api/cost-centers?userId=${props.userId}`)
    
    // Mock data for now
    const mockData: CostCenter[] = [
      {
        id: '1',
        division: 123,
        funding: 456,
        program: 789,
        percentage: 60,
        userId: props.userId
      },
      {
        id: '2', 
        division: 123,
        funding: 456,
        program: 790,
        percentage: 30,
        userId: props.userId
      }
    ]
    
    costCenters.value = mockData
    emit('update', costCenters.value)
    
  } catch (error) {
    console.error('Error fetching cost centers:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load cost centers',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

function startEdit(id: string, currentPercentage: number) {
  editingId.value = id
  editingPercentage.value = currentPercentage
}

function cancelEdit() {
  editingId.value = null
  editingPercentage.value = 0
}

async function savePercentage(id: string) {
  if (editingPercentage.value < 0 || editingPercentage.value > 100) {
    toast.add({
      title: 'Invalid Percentage',
      description: 'Percentage must be between 0 and 100',
      color: 'error'
    })
    return
  }
  
  try {
    // TODO: Replace with actual API call
    // await $fetch(`/api/cost-centers/${id}`, {
    //   method: 'PUT',
    //   body: { percentage: editingPercentage.value }
    // })
    
    // Update local state
    const costCenter = costCenters.value.find(cc => cc.id === id)
    if (costCenter) {
      costCenter.percentage = editingPercentage.value
      emit('update', costCenters.value)
    }
    
    cancelEdit()
    
    toast.add({
      title: 'Updated',
      description: 'Percentage updated successfully',
      color: 'success'
    })
    
  } catch (error) {
    console.error('Error updating percentage:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update percentage',
      color: 'error'
    })
  }
}

async function deleteCostCenter(id: string) {
  if (!confirm('Are you sure you want to delete this cost center?')) {
    return
  }
  
  deletingIds.value.push(id)
  
  try {
    // TODO: Replace with actual API call
    // await $fetch(`/api/cost-centers/${id}`, {
    //   method: 'DELETE'
    // })
    
    // Remove from local state
    costCenters.value = costCenters.value.filter(cc => cc.id !== id)
    emit('update', costCenters.value)
    
    toast.add({
      title: 'Deleted',
      description: 'Cost center deleted successfully',
      color: 'success'
    })
    
  } catch (error) {
    console.error('Error deleting cost center:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to delete cost center',
      color: 'error'
    })
  } finally {
    deletingIds.value = deletingIds.value.filter(deletingId => deletingId !== id)
  }
}

// Add new cost center (called from parent)
function addCostCenter(costCenter: Omit<CostCenter, 'id' | 'userId'>) {
  const newCostCenter: CostCenter = {
    id: Date.now().toString(), // Temporary ID
    userId: props.userId,
    ...costCenter
  }
  
  costCenters.value.push(newCostCenter)
  emit('update', costCenters.value)
}

// Lifecycle
onMounted(() => {
  fetchCostCenters()
})

// Expose methods for parent component
defineExpose({
  addCostCenter,
  fetchCostCenters
})
</script>

<style scoped>
tr:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
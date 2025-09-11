<template>
  <UContainer>
    <div class="py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Cost Center Setup
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Configure your cost centers and allocation percentages
        </p>
      </div>

      <!-- Cost Center Form -->
      <div class="mb-8">
        <CostCenterForm @submit="handleCostCenterSubmit" @error="handleCostCenterError" />
      </div>

      <!-- Cost Center List -->
      <div class="mb-8">
        <CostCenterList 
          ref="costCenterListRef"
          :user-id="userId"
          :refresh="refreshList"
          @update="handleCostCenterUpdate"
          @percentage-change="handlePercentageChange"
        />
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <UButton 
          to="/"
          variant="outline"
          icon="i-lucide-arrow-left"
        >
          Back to Home
        </UButton>
        <UButton 
          color="primary"
          :disabled="!canProceed"
          icon="i-lucide-arrow-right"
          trailing
          :title="canProceed ? 'Continue to Pay Periods' : 'Total allocation must equal 100% to proceed'"
        >
          Continue to Pay Periods
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { CostCenter } from '~/types'

useSeoMeta({
  title: 'Cost Center Setup - Paylocity Allocation Assistant',
  description: 'Configure your cost centers and allocation percentages'
})

// Reactive state
const toast = useToast()
const userId = ref('default-user') // TODO: Replace with actual user ID from auth
const costCenterListRef = ref()
const refreshList = ref(false)
const totalPercentage = ref(0)
const canProceed = computed(() => totalPercentage.value === 100)

// Handle cost center form submission
async function handleCostCenterSubmit(costCenterData: { 
  division: number
  funding: number  
  program: number
  percentage: number 
}) {
  try {
    // TODO: Replace with actual API call to save cost center
    // const response = await $fetch('/api/cost-centers', {
    //   method: 'POST',
    //   body: {
    //     ...costCenterData,
    //     userId: userId.value
    //   }
    // })
    
    console.log('Cost center data:', costCenterData)
    
    // Add to the list component
    if (costCenterListRef.value) {
      costCenterListRef.value.addCostCenter(costCenterData)
    }
    
  } catch (error) {
    console.error('Failed to create cost center:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to create cost center. Please try again.',
      color: 'error'
    })
  }
}

// Handle cost center form errors
function handleCostCenterError(error: any) {
  console.error('Cost center form error:', error)
  toast.add({
    title: 'Form Error',
    description: 'Please check your form inputs and try again.',
    color: 'error'
  })
}

// Handle cost center list updates
function handleCostCenterUpdate(costCenters: CostCenter[]) {
  console.log('Cost centers updated:', costCenters)
  // Additional handling if needed
}

// Handle percentage changes from the list
function handlePercentageChange(total: number) {
  totalPercentage.value = total
}
</script>
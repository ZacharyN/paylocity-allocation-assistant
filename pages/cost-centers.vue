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

      <!-- Cost Center Form will be inserted here -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Add New Cost Center</h2>
        <!-- Form component placeholder -->
        <UCard>
          <div class="p-4 text-center text-gray-500">
            Cost Center Form Component (Coming Soon)
          </div>
        </UCard>
      </div>

      <!-- Cost Center List will be inserted here -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Current Cost Centers</h2>
          <div class="text-sm text-gray-500">
            Total Allocation: <span class="font-semibold">0%</span>
          </div>
        </div>
        <!-- List component placeholder -->
        <UCard>
          <div class="p-8 text-center text-gray-500">
            <UIcon name="i-lucide-plus-circle" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p class="text-lg mb-2">No cost centers configured yet</p>
            <p class="text-sm">Add your first cost center above to get started</p>
          </div>
        </UCard>
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
          disabled
          icon="i-lucide-arrow-right"
          trailing
        >
          Continue to Pay Periods
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Cost Center Setup - Paylocity Allocation Assistant',
  description: 'Configure your cost centers and allocation percentages'
})
</script>
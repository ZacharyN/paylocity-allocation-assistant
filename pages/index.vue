<template>
  <UContainer>
    <div class="py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Paylocity Allocation Assistant
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Validate your time entries against predetermined cost center allocations in real-time
        </p>
      </div>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <UCard 
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateTo('/cost-centers')"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-settings" class="text-primary-500 w-6 h-6" />
              <h3 class="text-lg font-semibold">Cost Centers</h3>
            </div>
          </template>
          <p class="text-gray-600 dark:text-gray-400">
            Set up and manage your cost center allocations
          </p>
        </UCard>

        <UCard class="opacity-50">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-calendar" class="text-gray-400 w-6 h-6" />
              <h3 class="text-lg font-semibold text-gray-400">Pay Periods</h3>
            </div>
          </template>
          <p class="text-gray-400">
            Configure pay period settings (Coming Soon)
          </p>
        </UCard>

        <UCard class="opacity-50">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-clock" class="text-gray-400 w-6 h-6" />
              <h3 class="text-lg font-semibold text-gray-400">Time Entry</h3>
            </div>
          </template>
          <p class="text-gray-400">
            Track your daily time allocations (Coming Soon)
          </p>
        </UCard>

        <UCard class="opacity-50">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-bar-chart-3" class="text-gray-400 w-6 h-6" />
              <h3 class="text-lg font-semibold text-gray-400">Dashboard</h3>
            </div>
          </template>
          <p class="text-gray-400">
            View allocation summaries and reports (Coming Soon)
          </p>
        </UCard>
      </div>

      <div class="text-center">
        <UButton 
          to="/cost-centers"
          color="primary"
          size="lg"
          icon="i-lucide-arrow-right"
          trailing
        >
          Get Started with Cost Centers
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Paylocity Allocation Assistant',
  description: 'Validate your time entries against predetermined cost center allocations in real-time'
})
</script>
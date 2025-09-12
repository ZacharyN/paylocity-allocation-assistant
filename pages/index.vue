<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
      <!-- Animated Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-transparent to-brand-900/30 animate-pulse"></div>
      
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <!-- Floating Orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"></div>
        <div class="absolute top-40 right-20 w-24 h-24 bg-accent-400/10 rounded-full blur-xl animate-float-delayed"></div>
        <div class="absolute bottom-32 left-1/4 w-40 h-40 bg-brand-400/5 rounded-full blur-xl animate-float-slow"></div>
      </div>
      
      <UContainer class="relative z-10 py-24 lg:py-32">
        <div class="max-w-4xl mx-auto text-center text-white">
          <!-- Brand Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-brand-100 text-sm font-medium mb-6">
            <UIcon name="i-lucide-shield-check" class="w-4 h-4 mr-2" />
            Trusted by Nebraska Children
          </div>
          
          <!-- Hero Title -->
          <h1 class="text-4xl font-bold mb-6 lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-brand-50 to-white bg-clip-text text-transparent animate-pulse">
            Paylocity Allocation Assistant
          </h1>
          
          <!-- Hero Subtitle -->
          <p class="text-xl lg:text-2xl text-brand-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            Validate your time entries against predetermined cost center allocations in real-time. 
            <span class="text-white font-semibold">Streamline your payroll process</span> with intelligent automation.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <UButton 
              to="/cost-centers"
              size="xl" 
              color="white" 
              variant="solid"
              icon="i-lucide-rocket"
              class="font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-ring"
            >
              Get Started Free
            </UButton>
            <UButton 
              size="xl" 
              color="white" 
              variant="outline"
              icon="i-lucide-play-circle"
              class="font-semibold border-white/30 hover:bg-white/10 backdrop-blur-sm focus-ring"
            >
              Watch Demo
            </UButton>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-1">99.9%</div>
              <div class="text-brand-200 text-sm">Accuracy Rate</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-1">2 min</div>
              <div class="text-brand-200 text-sm">Setup Time</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-white mb-1">50%</div>
              <div class="text-brand-200 text-sm">Time Saved</div>
            </div>
          </div>
        </div>
      </UContainer>
      
      <!-- Wave Divider -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-20 lg:h-30">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" class="dark:fill-gray-900"/>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 lg:py-32">
      <UContainer>
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to 
            <span class="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Comprehensive tools designed specifically for Nebraska Children's payroll allocation requirements
          </p>
        </div>
        
        <!-- Feature Cards -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <!-- Cost Centers - Active -->
          <UCard 
            class="group hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-500 cursor-pointer transform hover:-translate-y-3 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden"
            @click="navigateTo('/cost-centers')"
          >
            <!-- Shimmer Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            
            <div class="relative p-6">
              <!-- Status Badge -->
              <div class="absolute top-4 right-4 z-10">
                <UBadge color="green" variant="soft" size="xs">Available</UBadge>
              </div>
              
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UIcon name="i-lucide-settings" class="text-white w-8 h-8" />
              </div>
              
              <!-- Content -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 transition-colors">
                Cost Centers
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Set up and manage your cost center allocations with precision and ease
              </p>
              
              <!-- Feature List -->
              <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li class="flex items-center">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mr-2" />
                  Real-time validation
                </li>
                <li class="flex items-center">
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 mr-2" />
                  Percentage tracking
                </li>
              </ul>
            </div>
          </UCard>

          <!-- Pay Periods - Coming Soon -->
          <UCard class="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
            <div class="relative p-6">
              <!-- Coming Soon Badge -->
              <div class="absolute top-4 right-4">
                <UBadge color="amber" variant="soft" size="xs">Coming Soon</UBadge>
              </div>
              
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-lucide-calendar" class="text-white w-8 h-8" />
              </div>
              
              <!-- Content -->
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-3">
                Pay Periods
              </h3>
              <p class="text-gray-500 dark:text-gray-500 mb-4 leading-relaxed">
                Configure pay period settings and manage timeframes
              </p>
              
              <!-- Feature List -->
              <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li class="flex items-center">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
                  Date range management
                </li>
                <li class="flex items-center">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
                  Hour calculations
                </li>
              </ul>
            </div>
          </UCard>

          <!-- Time Entry - Coming Soon -->
          <UCard class="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
            <div class="relative p-6">
              <!-- Coming Soon Badge -->
              <div class="absolute top-4 right-4">
                <UBadge color="amber" variant="soft" size="xs">Coming Soon</UBadge>
              </div>
              
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-lucide-clock" class="text-white w-8 h-8" />
              </div>
              
              <!-- Content -->
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-3">
                Time Entry
              </h3>
              <p class="text-gray-500 dark:text-gray-500 mb-4 leading-relaxed">
                Track your daily time allocations with intuitive interfaces
              </p>
              
              <!-- Feature List -->
              <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li class="flex items-center">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
                  Calendar grid view
                </li>
                <li class="flex items-center">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
                  Overlap detection
                </li>
              </ul>
            </div>
          </UCard>

          <!-- Dashboard - Coming Soon -->
          <UCard class="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
            <div class="relative p-6">
              <!-- Coming Soon Badge -->
              <div class="absolute top-4 right-4">
                <UBadge color="amber" variant="soft" size="xs">Coming Soon</UBadge>
              </div>
              
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-lucide-bar-chart-3" class="text-white w-8 h-8" />
              </div>
              
              <!-- Content -->
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-3">
                Analytics Dashboard
              </h3>
              <p class="text-gray-500 dark:text-gray-500 mb-4 leading-relaxed">
                View allocation summaries and comprehensive reports
              </p>
              
              <!-- Feature List -->
              <ul class="space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <li class="flex items-center">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
                  Visual progress tracking
                </li>
                <li class="flex items-center">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
                  Export capabilities
                </li>
              </ul>
            </div>
          </UCard>
        </div>
        
        <!-- Main CTA -->
        <div class="text-center mt-16">
          <div class="inline-flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl shadow-2xl">
            <div class="text-left">
              <h3 class="text-xl font-bold text-white mb-2">Ready to get started?</h3>
              <p class="text-brand-100">Set up your first cost center in under 2 minutes</p>
            </div>
            <UButton 
              to="/cost-centers"
              size="xl" 
              color="white" 
              variant="solid"
              icon="i-lucide-arrow-right"
              trailing
              class="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap focus-ring"
            >
              Start Cost Center Setup
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Paylocity Allocation Assistant',
  description: 'Validate your time entries against predetermined cost center allocations in real-time'
})
</script>
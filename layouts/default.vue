<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <UButton 
              to="/"
              variant="ghost"
              class="text-lg font-semibold"
            >
              <UIcon name="i-lucide-calculator" class="w-6 h-6 mr-2" />
              Allocation Assistant
            </UButton>
          </div>
          
          <nav class="hidden md:flex items-center gap-1">
            <UButton
              to="/"
              variant="ghost"
              :class="$route.path === '/' ? 'bg-gray-100 dark:bg-gray-700' : ''"
            >
              Home
            </UButton>
            <UButton
              to="/cost-centers"
              variant="ghost"
              :class="$route.path === '/cost-centers' ? 'bg-gray-100 dark:bg-gray-700' : ''"
            >
              Cost Centers
            </UButton>
          </nav>

          <!-- Mobile menu button -->
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            class="md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </UContainer>
    </header>

    <!-- Mobile Navigation -->
    <div 
      v-if="mobileMenuOpen"
      class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <UContainer>
        <nav class="py-4 space-y-2">
          <UButton
            to="/"
            variant="ghost"
            class="w-full justify-start"
            @click="mobileMenuOpen = false"
          >
            Home
          </UButton>
          <UButton
            to="/cost-centers"
            variant="ghost"
            class="w-full justify-start"
            @click="mobileMenuOpen = false"
          >
            Cost Centers
          </UButton>
        </nav>
      </UContainer>
    </div>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <UContainer>
        <div class="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} Nebraska Children. All rights reserved.</p>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>
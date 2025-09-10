# Brand Standards Guide - Nuxt 4 + Tailwind CSS + Nuxt UI

## Overview

**Brand Name:** [Your Brand Name]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [Brand/Design Team]

This document outlines the visual and design standards for [Brand Name] using Nuxt 4, Tailwind CSS, and Nuxt UI components. These guidelines ensure consistency across all digital products and applications.

**Tech Stack:**
- Nuxt 4
- Tailwind CSS
- Nuxt UI
- TypeScript (recommended)

## Brand Identity

### Mission Statement
[Your brand's mission statement and core values]

### Brand Personality
- **Tone:** Professional, approachable, innovative
- **Voice:** Clear, confident, helpful
- **Values:** Trust, quality, innovation, accessibility

## Tailwind Configuration

### Custom Theme Extension

Add this to your `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Primary brand color
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Secondary/accent color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
}
```

### Nuxt UI Color Mode Configuration

In your `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    primary: 'brand',
    gray: 'slate',
    colors: ['brand', 'accent'],
    strategy: 'merge',
  },
})
```

## Visual Identity

### Logo Usage

#### Logo Components
```vue
<!-- Primary Logo Component -->
<template>
  <div class="flex items-center">
    <img 
      :src="logoSrc" 
      :alt="`${brandName} logo`"
      :class="logoClasses"
    >
    <span 
      v-if="showText" 
      class="ml-3 text-xl font-bold text-gray-900 dark:text-white"
    >
      {{ brandName }}
    </span>
  </div>
</template>
```

#### Logo Tailwind Classes
- **Large:** `h-12 w-auto` (48px height)
- **Medium:** `h-8 w-auto` (32px height) - Default
- **Small:** `h-6 w-auto` (24px height)
- **Icon only:** `h-8 w-8` (32x32px)

### Color System

#### Primary Brand Colors (Tailwind Classes)
```typescript
// Use these Tailwind classes throughout your components
const brandColors = {
  // Backgrounds
  primary: 'bg-brand-500',
  primaryHover: 'hover:bg-brand-600',
  primaryLight: 'bg-brand-50',
  
  // Text
  primaryText: 'text-brand-500',
  primaryTextHover: 'hover:text-brand-600',
  
  // Borders
  primaryBorder: 'border-brand-500',
  
  // Accent colors
  accent: 'bg-accent-500',
  accentHover: 'hover:bg-accent-600',
  accentText: 'text-accent-500',
}
```

#### Status Colors (Using Nuxt UI defaults)
```typescript
const statusColors = {
  success: 'text-green-500 bg-green-50 border-green-200',
  warning: 'text-amber-500 bg-amber-50 border-amber-200',
  error: 'text-red-500 bg-red-50 border-red-200',
  info: 'text-blue-500 bg-blue-50 border-blue-200',
}
```

### Typography Classes

#### Heading Styles
```typescript
const headingClasses = {
  h1: 'text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl',
  h2: 'text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl',
  h3: 'text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl',
  h4: 'text-xl font-semibold text-gray-900 dark:text-white lg:text-2xl',
  h5: 'text-lg font-semibold text-gray-900 dark:text-white',
  h6: 'text-base font-semibold text-gray-900 dark:text-white',
}
```

#### Body Text Styles
```typescript
const textClasses = {
  body: 'text-base text-gray-600 dark:text-gray-300 leading-relaxed',
  bodyLarge: 'text-lg text-gray-600 dark:text-gray-300 leading-relaxed',
  small: 'text-sm text-gray-500 dark:text-gray-400',
  caption: 'text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide',
  lead: 'text-xl text-gray-600 dark:text-gray-300 leading-relaxed',
}
```

## Nuxt UI Component Customization

### Button Variants

```vue
<template>
  <!-- Primary CTA Button -->
  <UButton 
    color="brand" 
    variant="solid" 
    size="lg"
    class="font-semibold"
  >
    Get Started
  </UButton>

  <!-- Secondary Button -->
  <UButton 
    color="brand" 
    variant="outline" 
    size="md"
  >
    Learn More
  </UButton>

  <!-- Ghost Button -->
  <UButton 
    color="brand" 
    variant="ghost" 
    size="sm"
  >
    Cancel
  </UButton>
</template>
```

### Form Components

```vue
<template>
  <!-- Input Field -->
  <UFormGroup 
    label="Email Address" 
    :ui="{ label: { base: 'font-medium text-gray-700 dark:text-gray-200' } }"
  >
    <UInput 
      placeholder="Enter your email"
      :ui="{ 
        base: 'focus:ring-brand-500 focus:border-brand-500',
        rounded: 'rounded-lg'
      }"
    />
  </UFormGroup>

  <!-- Select Dropdown -->
  <UFormGroup label="Category">
    <USelect 
      :options="options"
      :ui="{ 
        base: 'focus:ring-brand-500 focus:border-brand-500' 
      }"
    />
  </UFormGroup>
</template>
```

### Card Components

```vue
<template>
  <!-- Standard Card -->
  <UCard 
    :ui="{ 
      base: 'bg-white dark:bg-gray-800 shadow-lg border-0',
      rounded: 'rounded-xl',
      body: { padding: 'p-6' }
    }"
  >
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Card Title
      </h3>
    </template>
    
    <p class="text-gray-600 dark:text-gray-300">
      Card content goes here...
    </p>
  </UCard>
</template>
```

### Navigation Components

```vue
<template>
  <!-- Header Navigation -->
  <UContainer class="flex items-center justify-between py-4">
    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center">
      <img src="/logo.svg" alt="Brand Logo" class="h-8 w-auto">
    </NuxtLink>

    <!-- Navigation Menu -->
    <nav class="hidden md:flex items-center space-x-8">
      <UButton 
        v-for="item in navItems" 
        :key="item.label"
        :to="item.href"
        variant="ghost"
        color="gray"
        class="font-medium"
      >
        {{ item.label }}
      </UButton>
    </nav>

    <!-- Mobile Menu Toggle -->
    <UButton 
      icon="i-heroicons-bars-3" 
      variant="ghost" 
      class="md:hidden"
      @click="toggleMobileMenu"
    />
  </UContainer>
</template>
```

## Layout Standards

### Container Classes
```typescript
const containerClasses = {
  // Page containers
  page: 'min-h-screen bg-gray-50 dark:bg-gray-900',
  content: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Section spacing
  section: 'py-12 lg:py-16',
  sectionLarge: 'py-16 lg:py-24',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
}
```

### Responsive Breakpoints (Tailwind defaults)
- **sm:** 640px and up
- **md:** 768px and up  
- **lg:** 1024px and up
- **xl:** 1280px and up
- **2xl:** 1536px and up

## Component Patterns

### Hero Section
```vue
<template>
  <section class="bg-gradient-to-r from-brand-600 to-brand-700 text-white">
    <UContainer class="py-24 lg:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold mb-6 lg:text-6xl">
          {{ heroTitle }}
        </h1>
        <p class="text-xl mb-8 text-brand-100 lg:text-2xl">
          {{ heroSubtitle }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton size="xl" color="white" variant="solid">
            Get Started
          </UButton>
          <UButton size="xl" color="white" variant="outline">
            Learn More
          </UButton>
        </div>
      </div>
    </UContainer>
  </section>
</template>
```

### Feature Cards Grid
```vue
<template>
  <section class="py-16 bg-white dark:bg-gray-900">
    <UContainer>
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Everything you need to succeed
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UCard 
          v-for="feature in features" 
          :key="feature.id"
          class="text-center group hover:shadow-xl transition-shadow duration-300"
        >
          <UIcon 
            :name="feature.icon" 
            class="h-12 w-12 text-brand-500 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ feature.description }}
          </p>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>
```

## Dark Mode Support

### Dark Mode Classes
Always include dark mode variants:

```typescript
const darkModeClasses = {
  // Backgrounds
  pageBg: 'bg-white dark:bg-gray-900',
  cardBg: 'bg-white dark:bg-gray-800',
  
  // Text
  heading: 'text-gray-900 dark:text-white',
  body: 'text-gray-600 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
  
  // Borders
  border: 'border-gray-200 dark:border-gray-700',
}
```

## Animation & Transitions

### Standard Transitions
```typescript
const transitions = {
  // Hover effects
  buttonHover: 'transition-colors duration-200',
  cardHover: 'transition-shadow duration-300',
  
  // Page transitions
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  
  // Interactive states
  transform: 'transition-transform duration-200 hover:scale-105',
}
```

## Accessibility Standards

### Focus States
```vue
<template>
  <!-- Ensure all interactive elements have proper focus states -->
  <button class="focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
    Click me
  </button>
</template>
```

### ARIA Labels
Always include proper ARIA labels for screen readers:

```vue
<template>
  <UButton 
    icon="i-heroicons-x-mark" 
    variant="ghost"
    :aria-label="$t('close')"
  />
</template>
```

## Implementation Checklist

### Nuxt UI Setup
- [ ] Install Nuxt UI: `npm install @nuxt/ui`
- [ ] Add to `nuxt.config.ts`: `modules: ['@nuxt/ui']`
- [ ] Configure `app.config.ts` with brand colors
- [ ] Extend Tailwind config with custom theme

### Component Standards
- [ ] Use Nuxt UI components as base
- [ ] Apply consistent color scheme (`brand` and `accent`)
- [ ] Include dark mode support
- [ ] Add proper accessibility attributes
- [ ] Use semantic HTML structure

### Performance
- [ ] Optimize images with `<NuxtImg>`
- [ ] Use proper lazy loading
- [ ] Minimize custom CSS (leverage Tailwind)
- [ ] Enable Nuxt's auto-imports

## Code Examples

### Page Layout Template
```vue
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="pb-16">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>
```

### Composable for Brand Theme
```typescript
// composables/useBrandTheme.ts
export const useBrandTheme = () => {
  const brandClasses = {
    button: {
      primary: 'bg-brand-500 hover:bg-brand-600 text-white',
      secondary: 'border-brand-500 text-brand-500 hover:bg-brand-50',
    },
    text: {
      heading: 'text-gray-900 dark:text-white font-bold',
      body: 'text-gray-600 dark:text-gray-300',
    }
  }
  
  return {
    brandClasses
  }
}
```

## Resources

### Design Tokens
- [Tailwind Config File](./tailwind.config.ts)
- [App Config File](./app.config.ts)
- [Component Library](./components/)

### Documentation
- [Nuxt UI Documentation](https://ui.nuxt.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Nuxt 4 Documentation](https://nuxt.com/)

### Tools
- [Tailwind Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Nuxt DevTools](https://devtools.nuxt.com/)
- [Headless UI Icons](https://heroicons.com/)


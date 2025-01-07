<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Hi, Welcome back 👋</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Here's what's happening with your admin dashboard.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-white/80 p-8 shadow-sm transition hover:shadow-md dark:from-gray-800 dark:to-gray-800/80"
      >
        <!-- Background Icon -->
        <div class="absolute -right-6 -top-6 opacity-[0.08]">
          <Icon :name="stat.icon" class="h-32 w-32" />
        </div>

        <!-- Content -->
        <div class="relative">
          <div class="flex items-center gap-4">
            <div :class="stat.iconClass" class="flex h-12 w-12 items-center justify-center rounded-xl">
              <Icon :name="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <span v-if="stat.change" :class="stat.change > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
              {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
            </span>
          </div>
          <h3 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</h3>
          <p class="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Display Usage Chart -->
      <div class="rounded-xl bg-gradient-to-br from-white to-white/80 p-6 shadow-sm dark:from-gray-800 dark:to-gray-800/80">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Display Usage</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Display slots usage by organization</p>
          </div>
          <select
            v-model="displayChartPeriod"
            class="rounded-lg border-gray-300 bg-white text-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </select>
        </div>
        <!-- Chart Component -->
        <div class="h-[320px]">
          <!-- Add your chart component here -->
        </div>
      </div>

      <!-- Organization Growth Chart -->
      <div class="rounded-xl bg-gradient-to-br from-white to-white/80 p-6 shadow-sm dark:from-gray-800 dark:to-gray-800/80">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Organization Growth</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">New organizations over time</p>
          </div>
          <select
            v-model="growthChartPeriod"
            class="rounded-lg border-gray-300 bg-white text-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </select>
        </div>
        <!-- Chart Component -->
        <div class="h-[320px]">
          <!-- Add your chart component here -->
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="rounded-xl bg-gradient-to-br from-white to-white/80 p-6 shadow-sm dark:from-gray-800 dark:to-gray-800/80">
      <div class="mb-6">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Latest actions across the platform</p>
      </div>
      <div class="space-y-6">
        <div
          v-for="(activity, index) in recentActivity"
          :key="index"
          class="flex items-start gap-4 rounded-lg p-4 transition hover:bg-black/5 dark:hover:bg-white/5"
        >
          <div :class="activity.iconClass" class="flex h-10 w-10 items-center justify-center rounded-lg">
            <Icon :name="activity.icon" class="h-5 w-5 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.message }}</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const displayChartPeriod = ref('week')
const growthChartPeriod = ref('week')

const stats = ref([
  {
    label: 'Total Organizations',
    value: '24',
    change: 12,
    icon: 'heroicons:building-office',
    iconClass: 'bg-blue-600'
  },
  {
    label: 'Active Users',
    value: '147',
    change: 8,
    icon: 'heroicons:users',
    iconClass: 'bg-green-600'
  },
  {
    label: 'Total Displays',
    value: '89',
    change: -3,
    icon: 'heroicons:tv',
    iconClass: 'bg-amber-600'
  },
  {
    label: 'Display Usage',
    value: '76%',
    change: 5,
    icon: 'heroicons:chart-bar',
    iconClass: 'bg-purple-600'
  }
])

const recentActivity = ref([
  {
    icon: 'heroicons:building-office',
    iconClass: 'bg-blue-600',
    message: 'New organization "Tech Corp" created',
    time: '2 hours ago'
  },
  {
    icon: 'heroicons:users',
    iconClass: 'bg-green-600',
    message: 'John Doe joined Tech Corp',
    time: '4 hours ago'
  },
  {
    icon: 'heroicons:tv',
    iconClass: 'bg-amber-600',
    message: 'New display added to Main Office',
    time: '6 hours ago'
  },
  {
    icon: 'heroicons:credit-card',
    iconClass: 'bg-purple-600',
    message: 'Tech Corp upgraded to Pro plan',
    time: '8 hours ago'
  }
])
</script> 
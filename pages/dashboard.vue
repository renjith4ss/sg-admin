<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="p-6 bg-white rounded-lg shadow">
        <h3 class="mb-4 text-lg font-medium">Display Usage</h3>
        <!-- Add your chart component here -->
      </div>
      
      <div class="p-6 bg-white rounded-lg shadow">
        <h3 class="mb-4 text-lg font-medium">Organization Growth</h3>
        <!-- Add your chart component here -->
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="p-6 bg-white rounded-lg shadow">
      <h3 class="mb-4 text-lg font-medium">Recent Activity</h3>
      <!-- Add your activity list component here -->
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = ref([
  {
    label: 'Total Organizations',
    value: '24',
    icon: 'i-heroicons-building-office'
  },
  {
    label: 'Active Users',
    value: '147',
    icon: 'i-heroicons-users'
  },
  {
    label: 'Total Displays',
    value: '89',
    icon: 'i-heroicons-tv'
  },
  {
    label: 'Display Usage',
    value: '76%',
    icon: 'i-heroicons-chart-bar'
  }
])
</script> 
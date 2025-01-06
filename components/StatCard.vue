<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <div class="flex items-center">
      <div class="p-3 bg-blue-100 rounded-lg">
        <Icon :name="icon" class="w-6 h-6 text-blue-600" />
      </div>
      <div class="ml-4">
        <h4 class="text-sm font-medium text-gray-500">{{ label }}</h4>
        <p class="text-2xl font-semibold">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  icon: string
}>()
</script> 
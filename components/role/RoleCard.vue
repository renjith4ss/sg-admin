<template>
  <div class="rounded-lg border bg-background shadow-md">
    <div class="flex items-center justify-between p-4">
      <h3 class="text-lg font-semibold">{{ role.name }}</h3>
    </div>
    <div class="p-4">
      <p class="text-sm text-gray-500">{{ role.description }}</p>
    </div>
    <div class="p-4">
      <p class="text-sm text-gray-500">{{ role.permissions.length }} permissions</p>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { Role } from '~/types/roles';

defineProps<{
  role: Role
}>()
</script>


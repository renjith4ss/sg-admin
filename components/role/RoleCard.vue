<template>
  <div class="relative rounded-lg border bg-background shadow-md">
    <Icon v-if="role.protected" name="heroicons:shield-check" class="h-3.5 w-3.5 absolute top-2 right-2 text-red-500" />
    <div class="flex items-center justify-between p-4">
      <h3 class="text-lg font-semibold">{{ role.name }}</h3>
    </div>
    <div class="p-4 py-0">
      <p class="text-sm text-gray-500">{{ role.description }}</p>
    </div>
    <div class="p-4">
      <p class="text-sm text-gray-500">
        {{ role.permissions.length }} permissions
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from "~/types/roles";

defineProps<{
  role: Role;
}>();
</script>

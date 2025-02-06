<template>
  <div
    class="group relative overflow-hidden rounded-xl border bg-gray-50 dark:bg-gray-800 border-gray-200 transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-900 cursor-pointer"
    @click="$emit('click', tenant)"
  >
    <!-- Card Header -->
    <div class="relative space-y-3 p-6 bg-white dark:bg-gray-800/50">
      <div class="flex items-center justify-between">
        <div class="flex items-start gap-3">
          <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
            <img v-if="tenant.logo" :src="tenant.logo" alt="Tenant Logo" class="h-5 w-5" />
            <Icon
              v-else
              name="heroicons:building-office-2"
              class="h-5 w-5 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ tenantName }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ tenant.address }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ ownerName }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ tenant.email }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ tenant.phone }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ tenant.type }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tenant } from '~/types/tenants'
import { useTenant } from '~/composables/useTenant'

interface Props {
  tenant: Tenant
}

const props = defineProps<Props>()
defineEmits<{
  click: [tenant: Tenant]
}>()
const { getOwnerName, getTenantName } = useTenant()

const ownerName = computed(() => {
  return getOwnerName(props.tenant)
})

const tenantName = computed(() => {
  return getTenantName(props.tenant)
})
</script> 
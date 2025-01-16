<template>
  <div
    class="group relative overflow-hidden rounded-xl border bg-gray-50 dark:bg-gray-800 border-gray-200 transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-900 cursor-pointer"
    @click="$emit('click', plan)"
  >
    <!-- Status Badge -->
    <div class="absolute right-3 bottom-3 z-10 flex gap-2">
      <Badge
        v-if="plan.isSpecial"
        variant="secondary"
        class="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
      >
        Special
      </Badge>
      <Badge v-if="plan.deleted" variant="destructive" class="text-xs">
        Deleted
      </Badge>
    </div>

    <!-- Card Header -->
    <div class="relative space-y-3 p-6 bg-white dark:bg-gray-800/50">
      <div class="flex items-center justify-between">
        <div class="flex items-start gap-3">
          <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
            <Icon
              :name="plan.isAddon ? 'heroicons:puzzle-piece' : 'heroicons:document-text'"
              class="h-5 w-5 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ plan.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ plan.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="space-y-3 rounded-b-xl p-6 pb-10">
      <!-- Pricing -->
      <div v-if="isYearly" class="space-y-2">
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-semibold text-gray-900 dark:text-white">
            ${{ plan.yearlyPrice }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">/year</span>
          <span
            v-if="plan.yearlyDiscount > 0"
            class="text-sm text-green-600 dark:text-green-400"
          >
            {{ plan.yearlyDiscount }}% off
          </span>
        </div>
      </div>
      <div v-else class="space-y-2">
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-semibold text-gray-900 dark:text-white">
            ${{ plan.monthlyPrice }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">/month</span>
          <span
            v-if="plan.monthlyDiscount > 0"
            class="text-sm text-green-600 dark:text-green-400"
          >
            {{ plan.monthlyDiscount }}% off
          </span>
        </div>
      </div>

      <!-- Features for regular plans only -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 rounded-lg p-1.5">
          <Icon
            name="heroicons:users"
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
          />
          <p class="font-semibold text-gray-900 dark:text-white">
            {{ plan.maxMembers || "0" }}
          </p>
        </div>
        <div class="flex items-center gap-2 rounded-lg p-1.5">
          <Icon
            name="heroicons:circle-stack"
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
          />
          <p class="font-semibold text-gray-900 dark:text-white">
            {{ formatStorage(plan.storage) }}
          </p>
        </div>
        <div class="flex items-center gap-2 rounded-lg p-1.5">
          <Icon
            name="heroicons:computer-desktop"
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
          />
          <p class="font-semibold text-gray-900 dark:text-white">
            {{ plan.displayCount || "0" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plan } from '~/types/plans'

interface Props {
  plan: Plan
  isYearly: boolean
}

defineProps<Props>()
defineEmits<{
  click: [plan: Plan]
}>()

const formatStorage = (storage: number) => {
  if (!storage) return '0MB'
  return storage >= 1024 ? `${storage / 1024}GB` : `${storage}MB`
}
</script> 
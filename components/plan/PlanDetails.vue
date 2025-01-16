<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3">
          <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
            <Icon
              :name="plan.isAddon ? 'heroicons:puzzle-piece' : 'heroicons:document-text'"
              class="h-5 w-5 text-blue-600 dark:text-blue-400"
            />
          </div>
          {{ plan.name }}
        </DialogTitle>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Status Badges -->
        <div v-if="plan.isSpecial || plan.deleted" class="flex gap-2">
          <Badge
            v-if="plan.isSpecial"
            variant="secondary"
            class="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
          >
            Special
          </Badge>
          <Badge
            v-if="plan.deleted"
            variant="destructive"
            class="text-xs"
          >
            Deleted
          </Badge>
        </div>

        <!-- Description -->
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
          <p class="mt-1 text-gray-900 dark:text-white">{{ plan.description }}</p>
        </div>

        <!-- Pricing -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Price</h4>
            <div class="mt-1 flex items-baseline gap-1">
              <span class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ plan.currency }}{{ plan.monthlyPrice }}
              </span>
              <span
                v-if="plan.monthlyDiscount > 0"
                class="text-sm text-green-600 dark:text-green-400"
              >
                -{{ plan.monthlyDiscount }}%
              </span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Yearly Price</h4>
            <div class="mt-1 flex items-baseline gap-1">
              <span class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ plan.currency }}{{ plan.yearlyPrice }}
              </span>
              <span
                v-if="plan.yearlyDiscount > 0"
                class="text-sm text-green-600 dark:text-green-400"
              >
                -{{ plan.yearlyDiscount }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Plan Metrics -->
        <div v-if="!plan.isAddon" class="grid grid-cols-3 gap-4 border-t pt-6">
          <div>
            <div class="flex items-center gap-2">
              <Icon
                name="heroicons:users"
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
              />
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Members</h4>
            </div>
            <p class="mt-1 text-gray-900 dark:text-white">{{ plan.maxMembers || '0' }}</p>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <Icon
                name="heroicons:circle-stack"
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
              />
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</h4>
            </div>
            <p class="mt-1 text-gray-900 dark:text-white">{{ formatStorage(plan.storage) }}</p>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <Icon
                name="heroicons:computer-desktop"
                class="h-4 w-4 text-gray-500 dark:text-gray-400"
              />
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Displays</h4>
            </div>
            <p class="mt-1 text-gray-900 dark:text-white">{{ plan.displayCount || '0' }}</p>
          </div>
        </div>

        <!-- Features -->
        <div v-if="plan.features?.length" class="border-t pt-6">
          <h4 class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Features</h4>
          <ul class="space-y-3">
            <li 
              v-for="(feature, index) in plan.features" 
              :key="index"
              class="flex items-center gap-2 text-gray-900 dark:text-white"
            >
              <Icon 
                name="heroicons:check" 
                class="h-4 w-4 text-green-500 dark:text-green-400" 
              />
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- Additional Info -->
        <div class="border-t pt-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Trial Period</h4>
              <p class="mt-1 text-gray-900 dark:text-white">
                {{ plan.trialPeriodDays ? `${plan.trialPeriodDays} days` : 'No trial' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <div class="mt-6 flex justify-end gap-3">
          <Button
            v-if="plan.deleted"
            variant="default"
            class="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
            @click="showRestoreAlert = true"
          >
            Restore
          </Button>
          <template v-else>
            <Button
              variant="destructive"
              @click="showDeleteAlert = true"
            >
              Delete
            </Button>
            <Button
              @click="$emit('edit')"
            >
              Edit
            </Button>
          </template>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Delete Confirmation Alert -->
  <AlertDialog :open="showDeleteAlert" @update:open="showDeleteAlert = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the plan
          "{{ plan.name }}" and remove it from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="showDeleteAlert = false">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction 
          @click="handleDelete"
          class="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700"
        >
          Delete Plan
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <!-- Restore Confirmation Alert -->
  <AlertDialog :open="showRestoreAlert" @update:open="showRestoreAlert = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Restore Plan</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to restore "{{ plan.name }}"? This will make the plan active again.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="showRestoreAlert = false">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction 
          @click="handleRestore"
          class="bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700"
        >
          Restore Plan
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import type { Plan } from '~/types/plans'

interface Props {
  isOpen: boolean
  plan: Plan
}

defineProps<Props>()
const emit = defineEmits(['update:open', 'edit', 'delete', 'restore'])

const showDeleteAlert = ref(false)
const showRestoreAlert = ref(false)

const handleDelete = () => {
  showDeleteAlert.value = false
  emit('delete')
}

const handleRestore = () => {
  showRestoreAlert.value = false
  emit('restore')
}

const formatStorage = (storage: number) => {
  if (!storage) return '0MB'
  return storage >= 1024 ? `${storage / 1024}GB` : `${storage}MB`
}
</script> 
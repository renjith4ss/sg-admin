<template>
    <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="flex items-center gap-3">
            <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
              <img v-if="tenant.logo" :src="tenant.logo" alt="Tenant Logo" class="h-5 w-5" />
              <Icon v-else name="heroicons:building-office-2-solid"
                class="h-5 w-5 text-blue-600 dark:text-blue-400"
              />
            </div>
            {{ tenantName }}
          </DialogTitle>
        </DialogHeader>
  
        <div class="space-y-6">
          <!-- Description -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </h4>
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ tenant.address }}
            </p>
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ ownerName }}
            </p>
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ tenant.email }}
            </p>
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ tenant.phone }}
            </p>
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ tenant.type }}
            </p>
          </div>
        </div>
  
        <DialogFooter>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="destructive" @click="showDeleteAlert = true">
              Delete
            </Button>
            <Button @click="$emit('edit')"> Edit </Button>
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
            This action cannot be undone. This will permanently delete the tenant
            "{{ tenant.name }}" and remove it from our servers.
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
            Delete Tenant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </template>
  
  <script setup lang="ts">
  import type { Tenant } from "~/types/tenants";
  
  interface Props {
    isOpen: boolean;
    tenant: Tenant;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(["update:open", "edit", "delete"]);
  
  const showDeleteAlert = ref(false);
  
  const handleDelete = () => {
    showDeleteAlert.value = false;
    emit("delete");
  };
const { getOwnerName, getTenantName } = useTenant()

const ownerName = computed(() => {
  return getOwnerName(props.tenant)
})

const tenantName = computed(() => {
  return getTenantName(props.tenant)
})
  </script>
  
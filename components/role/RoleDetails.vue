<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3">
          <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
            <Icon name="heroicons:academic-cap-20-solid"
              class="h-5 w-5 text-blue-600 dark:text-blue-400"
            />
          </div>
          {{ role.name }}
        </DialogTitle>
        <div v-if="role.protected" class="mt-2">
          <Badge variant="destructive" class="gap-1">
            <Icon name="heroicons:shield-check" class="h-3.5 w-3.5" />
            Protected Role
          </Badge>
        </div>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Description -->
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Description
          </h4>
          <p class="mt-1 text-gray-900 dark:text-white">
            {{ role.description }}
          </p>
        </div>

        <!-- Permissions -->
        <div v-if="role.permissions?.length" class="border-t pt-6">
          <h4 class="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            Permissions
          </h4>
          <ul class="space-y-3">
            <li
              v-for="(permission, index) in role.permissions"
              :key="index"
              class="flex items-center gap-2 text-gray-900 dark:text-white"
            >
              <Icon
                name="heroicons:check"
                class="h-4 w-4 text-green-500 dark:text-green-400"
              />
              {{ permission }}
            </li>
          </ul>
        </div>
      </div>

      <DialogFooter>
        <div v-if="!role.protected" class="mt-6 flex justify-end gap-3">
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
          This action cannot be undone. This will permanently delete the role
          "{{ role.name }}" and remove it from our servers.
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
          Delete Role
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import type { Role } from "~/types/roles";

interface Props {
  isOpen: boolean;
  role: Role;
}

defineProps<Props>();
const emit = defineEmits(["update:open", "edit", "delete"]);

const showDeleteAlert = ref(false);

const handleDelete = () => {
  showDeleteAlert.value = false;
  emit("delete");
};
</script>

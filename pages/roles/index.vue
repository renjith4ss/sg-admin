<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage roles
        </p>
      </div>
      <Button @click="handleCreateRole" class="gap-2">
        <Icon name="heroicons:plus" class="h-5 w-5" />
        New Role
      </Button>
    </div>

    <!-- Search and Filters -->
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="relative flex-1">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="h-5 w-5 text-gray-400"
          />
        </div>
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Search plans..."
          class="pl-10"
        />
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="toggleViewMode">
          <Icon
            :name="
              isGridView ? 'heroicons:list-bullet' : 'heroicons:squares-2x2'
            "
            class="h-4 w-4"
          />
        </Button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="isGridView" class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="roles.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Roles
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <RoleCard
            v-for="role in roles"
            :key="role.id"
            :role="role"
            @click="showRoleDetails(role)"
          />
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="roles.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Roles
        </h2>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead class="w-[80px]"> Members </TableHead>
                <TableHead class="w-[80px]"> Storage </TableHead>
                <TableHead class="w-[80px]"> Displays </TableHead>
                <TableHead class="w-[80px]"> Actions </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="role in roles"
                :key="role.id"
                class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                @click="showRoleDetails(role)"
              >
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ role.name }}</span>
                  </div>
                </TableCell>
                <TableCell>{{ role.description }}</TableCell>
                <TableCell>
                  {{ role.permissions }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="roles.length === 0"
        class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
        >
          <Icon
            name="heroicons:academic-cap"
            class="h-6 w-6 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No roles available
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new role
        </p>
        <Button @click="handleCreateRole" class="mt-6 gap-2">
          <Icon name="heroicons:plus" class="h-5 w-5" />
          New Role
        </Button>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      :open="showCreateDialog"
      @update:open="(value: boolean) => handleDialogClose(value)"
    >
      <DialogContent class="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>
            {{
              isEditing
                ? "Edit Role"
                : "Create New Role"
            }}
          </DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit">
          <div class="flex gap-8">
            <!-- Left Column - Role Details -->
            <div class="flex-1 space-y-4 min-w-[500px]">

              <div>
                <Label for="name">Name</Label>
                <Input id="name" v-model="formData.name" type="text" required />
              </div>

              <div>
                <Label for="description">Description</Label>
                <Textarea
                  id="description"
                  v-model="formData.description"
                  rows="3"
                  required
                />
              </div>
            </div>

            <!-- Right Column - Features -->
            <div class="flex-1 min-w-[400px]">
              <div class="sticky top-0">
                <Label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Permissions</Label
                >
                <div
                  class="mt-2 h-[600px] space-y-2 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    v-for="(permission, index) in formData.permissions"
                    :key="index"
                    class="flex gap-2"
                  >
                    <Checkbox v-model="formData.permissions[index]" />
                    <Label>{{ permission }}</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              @click="showCreateDialog = false"
            >
              Cancel
            </Button>
            <Button type="submit" :disabled="isSubmitting || !hasChanges">
              {{ isSubmitting ? "Saving..." : isEditing ? "Update" : "Create" }}
            </Button>
          </div>

          <div
            v-if="formError"
            class="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/50"
          >
            <p
              class="text-sm text-red-600 dark:text-red-200 whitespace-pre-line"
            >
              {{ formError }}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Plan Details Dialog -->
    <RoleDetails
      v-if="selectedRoleForDetails"
      :isOpen="showDetailsDialog"
      :role="selectedRoleForDetails"
      @update:open="showDetailsDialog = $event"
      @edit="() => {
        showDetailsDialog = false
        editRole(selectedRoleForDetails!)
      }"
      @delete="() => {
        showDetailsDialog = false
        confirmDelete(selectedRoleForDetails!)
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '#components';
import RoleCard from '~/components/roles/RoleCard.vue';
import RoleForm from '~/components/roles/RoleForm.vue';
import { Button } from '~/components/ui/button';
import { useDialog } from '~/composables/useDialog';
import { useRoles } from "~/composables/useRoles";
import type { Permission } from "~/types/permissions";
import type { Role } from "~/types/roles";

const {
  roles,
  isLoading,
  error,
  fetchRoles,
  createRole,
  updateRole,
  deleteRole
} = useRoles();

const dialog = useDialog()

// State
const searchQuery = ref("");
const showDeletedPlans = ref(false);
const showCreateDialog = ref(false);
const selectedRole = ref<Role | null>(null);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const showDetailsDialog = ref(false);
const selectedRoleForDetails = ref<Role | null>(null);

// Form state
const formData = reactive({
  name: "",
  description: "",
  permissions: [] as Permission[],
  created: "",
  updated: "",
});

// Computed
const filteredRoles = computed(() => {
  let filtered = roles.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (role: Role) =>
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const isEditing = computed(() => !!selectedRole.value);

const hasChanges = computed(() => {
  const role = selectedRole.value;
  if (!role) return true; // Always true for new roles

  // Compare features array - check length and content
  const cleanPermissions = formData.permissions.filter(f => f.trim());
  const cleanOriginalPermissions = role.permissions.filter(f => f.trim());
  
  const permissionsChanged = 
    cleanPermissions.length !== cleanOriginalPermissions.length || 
    cleanPermissions.some((f, i) => f !== cleanOriginalPermissions[i]);

  // Compare other fields
  const otherFieldsChanged = Object.keys(formData).some(key => {
    if (key === 'permissions') return false;
    const formValue = formData[key as keyof typeof formData];
    const originalValue = role[key as keyof Role];
    return formValue !== originalValue;
  });

  return permissionsChanged || otherFieldsChanged;
});


// Methods
const resetForm = () => {
  Object.assign(formData, {
    name: "",
    description: "",
    permissions: [],
    created: "",
    updated: "",
  });
  formError.value = null;
};

const handleCreateRole = () => {
  selectedRole.value = null;
  resetForm();
  showCreateDialog.value = true;
};

const editRole = (role: Role) => {
  selectedRole.value = role;
  Object.assign(formData, {
    ...role,
    permissions: [...role.permissions]
  });
  showCreateDialog.value = true;
};

const handleSubmit = async () => {
  formError.value = null;
  isSubmitting.value = true;

  try {
    if (selectedRole.value) {
      // Get only the changed fields for update
      const changedFields = Object.keys(formData).reduce((acc, key) => {
        const formValue = formData[key as keyof typeof formData];
        const originalValue = selectedRole.value![key as keyof Role];
        
        // Special handling for features array
        if (key === 'permissions') {
          const cleanPermissions = formData.permissions.filter(f => f.trim());
          const cleanOriginalPermissions = selectedRole.value!.permissions.filter(f => f.trim());
          if (JSON.stringify(cleanPermissions) !== JSON.stringify(cleanOriginalPermissions)) {
            acc[key as keyof Role] = cleanPermissions;
          }
          return acc;
        }

        // Compare other fields directly
        if (formValue !== originalValue) {
          acc[key as keyof Role] = formValue;
        }
        return acc;
      }, {} as Record<keyof Role, any>);

      if (Object.keys(changedFields).length > 0) {
        await updateRole(selectedRole.value.id, changedFields);
      }
    } else {
      await createRole(formData);
    }
    showCreateDialog.value = false;
    resetForm();
  } catch (err: any) {
    formError.value = err.message || "Failed to save role";
    console.error("Failed to save role:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async (role: Role) => {
  try {
    isSubmitting.value = true;
    await deleteRole(role.id);
  } catch (err: any) {
    formError.value = err.message || "Failed to delete role";
    console.error("Failed to delete role:", err);
  } finally {
    isSubmitting.value = false;
  }
};


const handleDialogClose = (value: boolean) => {
  if (!value) {
    showCreateDialog.value = false;
    selectedRole.value = null;
    resetForm();
  }
};

// Initial load
onMounted(async () => {
  await fetchRoles();
});

definePageMeta({
  middleware: ["auth"],
});

// Add new state
const isGridView = ref(true);

// Add new method
const toggleViewMode = () => {
  isGridView.value = !isGridView.value;
};

const showRoleDetails = (role: Role) => {
  selectedRoleForDetails.value = role;
  showDetailsDialog.value = true;
};

const columns = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    id: 'actions',
    cell: ({ row }: { row: { original: Role } }) => {
      const role = row.original

      const handleEdit = () => {
        dialog.create({
          title: 'Edit Role',
          content: () => h(RoleForm, {
            mode: 'edit',
            initialData: role,
            onSubmit: async (data) => {
              await updateRole(role.id, data)
              dialog.close()
            },
            onCancel: () => dialog.close()
          })
        })
      }

      const handleDelete = async () => {
        if (await confirm('Are you sure you want to delete this role?')) {
          await deleteRole(role.id)
        }
      }

      return h('div', { class: 'flex gap-2' }, [
        h(Button, {
          variant: 'ghost',
          size: 'icon',
          onClick: handleEdit
        }, () => h(Icon, { name: 'heroicons:pencil-square' })),
        h(Button, {
          variant: 'ghost',
          size: 'icon',
          onClick: handleDelete
        }, () => h(Icon, { name: 'heroicons:trash' }))
      ])
    }
  }
]
</script>

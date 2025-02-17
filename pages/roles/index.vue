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

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>

    <!-- Grid View -->
    <div v-else-if="isGridView" class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="safeRoles.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Roles
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <RoleCard
            v-for="role in safeRoles"
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
      <div v-if="safeRoles.length > 0">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="role in safeRoles"
                :key="role.id"
                class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                @click="showRoleDetails(role)"
              >
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ role.name }}</span>
                    <Icon v-if="role.protected" name="heroicons:shield-check" class="h-3.5 w-3.5 text-red-500" />
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
        v-if="safeRoles.length === 0"
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
                  class="mt-2 h-[600px] space-y-4 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <!-- Select All Checkbox -->
                  <div class="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <Checkbox 
                      :checked="isAllSelected" 
                      @update:checked="toggleSelectAll"
                      id="select-all"
                    />
                    <Label for="select-all" class="font-medium">Select All Permissions</Label>
                  </div>

                  <!-- Individual Permissions -->
                  <div
                    v-for="permission in availablePermissions"
                    :key="permission"
                    class="flex items-center gap-2"
                  >
                    <Checkbox 
                      :checked="formData.permissions.includes(permission)"
                      @update:checked="(checked: boolean) => togglePermission(permission, checked)"
                      :id="permission"
                    />
                    <Label :for="permission">{{ permission }}</Label>
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
import RoleCard from '~/components/role/RoleCard.vue';
import { Button } from '~/components/ui/button';
import { useRolesQuery } from '~/composables/useRolesQuery';
import type { Permission } from "~/types/permissions";
import type { Role, RoleFormState } from "~/types/roles";

// View state
const isGridView = ref(true)
const searchQuery = ref('')
const toggleViewMode = () => isGridView.value = !isGridView.value

// Queries and mutations
const { useRoles, useCreateRole, useUpdateRole, useDeleteRole } = useRolesQuery()
const { data: roles, isLoading } = useRoles()
const createRoleMutation = useCreateRole()
const updateRoleMutation = useUpdateRole()
const deleteRoleMutation = useDeleteRole()

// Dialog state
const showCreateDialog = ref(false)
const showDetailsDialog = ref(false)
const selectedRoleForDetails = ref<Role | null>(null)
const isEditing = ref(false)
const formError = ref('')
const isSubmitting = ref(false)

// Form state
const initialFormData: RoleFormState = {
  name: '',
  description: '',
  permissions: [] as Permission[],
  protected: false
}
const formData = ref({ ...initialFormData })
const originalFormData = ref({ ...initialFormData })

// Computed for safe roles access
const safeRoles = computed(() => roles.value || [])

const authStore = useAuthStore()
// Permissions
const availablePermissions = computed<Permission[]>(() => authStore.currentUser?.permissions || [])


const hasChanges = computed(() => {
  const role = originalFormData.value;
  if (!role) return true; // Always true for new roles
  // Compare features array - check length and content
  const cleanPermissions = formData.value.permissions.filter(f => f.trim());
  const cleanOriginalPermissions = role.permissions.filter(f => f.trim());
  
  const permissionsChanged = 
    cleanPermissions.length !== cleanOriginalPermissions.length || 
    cleanPermissions.some((f, i) => f !== cleanOriginalPermissions[i]);

  // Compare other fields
  const otherFieldsChanged = Object.keys(formData.value).some(key => {
    if (key === 'permissions') return false;
    const formValue = formData.value[key as keyof RoleFormState];
    const originalValue = role[key as keyof RoleFormState];
    return formValue !== originalValue;
  });

  return permissionsChanged || otherFieldsChanged;
});

const isAllSelected = computed(() => {
  return availablePermissions.value.every(permission => formData.value.permissions.includes(permission))
})

// Methods
const resetForm = () => {
  formData.value = { ...initialFormData }
  originalFormData.value = JSON.parse(JSON.stringify(initialFormData))
  isEditing.value = false
  formError.value = ''
}

const handleCreateRole = () => {
  resetForm()
  showCreateDialog.value = true
}

const editRole = (role: Role) => {
  formData.value = {
    name: role.name,
    description: role.description || '',
    permissions: [...role.permissions],
    protected: role.protected
  }
  originalFormData.value = JSON.parse(JSON.stringify(formData.value))
  isEditing.value = true
  showCreateDialog.value = true
}

const handleDialogClose = (value: boolean) => {
  if (!value) {
    resetForm()
  }
  showCreateDialog.value = value
}

const showRoleDetails = (role: Role) => {
  selectedRoleForDetails.value = role
  showDetailsDialog.value = true
}

const toggleSelectAll = (checked: boolean) => {
  formData.value.permissions = checked ? [...availablePermissions.value] : []
}

const togglePermission = (permission: Permission, checked: boolean) => {
  if (checked) {
    formData.value.permissions.push(permission)
  } else {
    const index = formData.value.permissions.indexOf(permission)
    if (index > -1) {
      formData.value.permissions.splice(index, 1)
    }
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    formError.value = ''

    if (isEditing.value && selectedRoleForDetails.value) {
      await updateRoleMutation.mutateAsync({
        id: selectedRoleForDetails.value.id,
        data: formData.value
      })
    } else {
      await createRoleMutation.mutateAsync(formData.value)
    }

    showCreateDialog.value = false
    resetForm()
  } catch (error: any) {
    formError.value = error.message || 'An error occurred while saving the role'
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async (role: Role) => {
  if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
    try {
      await deleteRoleMutation.mutateAsync(role.id)
    } catch (error: any) {
      alert(error.message || 'An error occurred while deleting the role')
    }
  }
}

// Load initial data
onMounted(async () => {
  try {
    await useRoles()
  } catch (error: any) {
    console.error('Failed to load roles:', error)
  }
})
</script>

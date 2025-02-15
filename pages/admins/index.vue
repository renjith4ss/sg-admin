<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admins</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage admin users
        </p>
      </div>
      <Button @click="handleCreateAdmin" class="gap-2">
        <Icon name="heroicons:plus" class="h-5 w-5" />
        New Admin
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
          placeholder="Search admins..."
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
      <div v-if="safeAdmins.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Admins
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="admin in safeAdmins"
            :key="admin.id"
            class="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <img 
                  v-if="admin.photo"
                  :src="admin.photo" 
                  :alt="admin.name || admin.email"
                  class="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <!-- if no photo, show default avatar -->
                <div v-else class="flex flex-shrink-0 h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <Icon name="heroicons:user" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ admin.name || admin.email }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ admin.email }}</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="role in admin.roles" :key="role.id" variant="secondary">
                    {{ role.name }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Status: <span :class="admin.active ? 'text-green-600' : 'text-red-600'">
                    {{ admin.active ? 'Active' : 'Inactive' }}
                  </span>
                </p>
              </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="editAdmin(admin)">
                <Icon name="heroicons:pencil-square" class="h-4 w-4" />
              </Button>
              <Button 
                v-if="!isCurrentUser(admin)"
                variant="destructive" 
                size="sm" 
                @click="confirmDelete(admin)"
              >
                <Icon name="heroicons:trash" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-8">
      <div v-if="safeAdmins.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Admins
        </h2>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="admin in safeAdmins"
                :key="admin.id"
              >
                <TableCell>
                  <div class="flex items-center gap-3">
                    <img 
                      v-if="admin.photo"
                      :src="admin.photo" 
                      :alt="admin.name || admin.email"
                      class="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                    <!-- if no photo, show default avatar -->
                    <div v-else class="flex flex-shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                      <Icon name="heroicons:user" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>

                    <span class="font-medium">{{ admin.name || admin.email }}</span>
                  </div>
                </TableCell>
                <TableCell>{{ admin.email }}</TableCell>
                <TableCell>
                  <div class="flex flex-wrap gap-1">
                    <Badge v-for="role in admin.roles" :key="role.id" variant="secondary">
                      {{ role.name }}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge :variant="admin.active ? 'default' : 'destructive'">
                    {{ admin.active ? 'Active' : 'Inactive' }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" @click="editAdmin(admin)">
                      <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                    </Button>
                    <Button 
                      v-if="!isCurrentUser(admin)"
                      variant="destructive" 
                      size="sm" 
                      @click="confirmDelete(admin)"
                    >
                      <Icon name="heroicons:trash" class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="safeAdmins.length === 0"
        class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
        >
          <Icon
            name="heroicons:users"
            class="h-6 w-6 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No admins available
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new admin
        </p>
        <Button @click="handleCreateAdmin" class="mt-6 gap-2">
          <Icon name="heroicons:plus" class="h-5 w-5" />
          New Admin
        </Button>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      :open="showCreateDialog"
      @update:open="(value: boolean) => handleDialogClose(value)"
    >
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {{ isEditing ? "Edit Admin" : "Create New Admin" }}
          </DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-4">
            <div>
              <Label for="name">Name</Label>
              <Input id="name" v-model="formData.name" type="text" required />
            </div>

            <div>
              <Label for="email">Email</Label>
              <Input id="email" v-model="formData.email" type="email" required />
            </div>

            <div v-if="!isEditing">
              <Label for="password">Password</Label>
              <Input id="password" v-model="formData.password" type="password" required />
            </div>

            <div v-if="!isEditing">
              <Label for="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" v-model="formData.confirmPassword" type="password" required />
            </div>

            <div>
              <Label for="photo">Photo URL</Label>
              <Input id="photo" v-model="formData.photo" type="url" />
            </div>

            <div>
              <Label>Roles</Label>
              <div class="mt-2 space-y-2">
                <div
                  v-for="role in availableRoles"
                  :key="role.id"
                  class="flex items-center gap-2"
                >
                  <Checkbox 
                    :checked="formData.roles.some(r => r.id === role.id)"
                    @update:checked="(checked: boolean) => toggleRole(role, checked)"
                    :id="role.id"
                  />
                  <Label :for="role.id">{{ role.name }}</Label>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox 
                v-model="formData.active"
                id="active"
              />
              <Label for="active">Active</Label>
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
            <p class="text-sm text-red-600 dark:text-red-200 whitespace-pre-line">
              {{ formError }}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      :open="showDeleteDialog"
      @update:open="(value) => {
        showDeleteDialog = value
        if (!value) adminToDelete = null
      }"
    >
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the admin "{{ adminToDelete?.name || adminToDelete?.email }}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div class="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            @click="showDeleteDialog = false"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="handleDelete"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import { Button } from '~/components/ui/button'
import { useAdminsQuery } from '~/composables/useAdminsQuery'
import { useRolesQuery } from '~/composables/useRolesQuery'
import { useAuthStore } from '~/stores/auth'
import type { AdminUser, AdminUserForm } from '~/types/admins'
import type { Role } from '~/types/roles'

// View state
const isGridView = ref(true)
const searchQuery = ref('')
const toggleViewMode = () => isGridView.value = !isGridView.value

// Queries and mutations
const { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin } = useAdminsQuery()
const { useRoles } = useRolesQuery()
const { data: admins, isLoading: isLoadingAdmins, refetch: refetchAdmins } = useAdmins()
const { data: roles, isLoading: isLoadingRoles, refetch: refetchRoles } = useRoles()
const createAdminMutation = useCreateAdmin()
const updateAdminMutation = useUpdateAdmin()
const deleteAdminMutation = useDeleteAdmin()

// Dialog state
const showCreateDialog = ref(false)
const isEditing = ref(false)
const formError = ref('')
const isSubmitting = ref(false)
const showDeleteDialog = ref(false)
const adminToDelete = ref<AdminUser | null>(null)

// Form state
const initialFormData: AdminUserForm & { password?: string; confirmPassword?: string } = {
  name: '',
  email: '',
  photo: undefined,
  roles: [] as Role[],
  active: true,
  password: '',
  confirmPassword: ''
}
const formData = ref({ ...initialFormData })
const originalFormData = ref({ ...initialFormData })

// Computed
const safeAdmins = computed(() => admins.value || [])
const availableRoles = computed(() => roles.value || [])

const hasChanges = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalFormData.value)
})

// Computed for loading state
const isLoading = computed(() => isLoadingAdmins.value || isLoadingRoles.value)

// Get current user from auth store
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

// Add helper method to check if admin is current user
const isCurrentUser = (admin: AdminUser) => {
  return currentUser.value?.id === admin.id
}

// Methods
const resetForm = () => {
  formData.value = { ...initialFormData }
  originalFormData.value = JSON.parse(JSON.stringify(initialFormData))
  isEditing.value = false
  formError.value = ''
}

const handleCreateAdmin = () => {
  resetForm()
  showCreateDialog.value = true
}

const editAdmin = (admin: AdminUserForm) => {
  formData.value = {
    name: admin.name,
    email: admin.email,
    photo: admin.photo,
    roles: [...admin.roles],
    active: admin.active
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

const toggleRole = (role: Role, checked: boolean) => {
  if (checked) {
    formData.value.roles.push(role)
  } else {
    formData.value.roles = formData.value.roles.filter(r => r.id !== role.id)
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    formError.value = ''

    // Password validation for new admins
    if (!isEditing.value) {
      if (!formData.value.password) {
        formError.value = 'Password is required'
        return
      }
      if (formData.value.password !== formData.value.confirmPassword) {
        formError.value = 'Passwords do not match'
        return
      }
    }

    if (isEditing.value) {
      const adminToUpdate = safeAdmins.value.find(admin => 
        admin.email === originalFormData.value.email
      )
      if (adminToUpdate) {
        // Remove password fields for update
        const { password, confirmPassword, ...updateData } = formData.value
        await updateAdminMutation.mutateAsync({
          id: adminToUpdate.id,
          data: updateData
        })
      }
    } else {
      // Remove confirmPassword field for create
      const { confirmPassword, ...createData } = formData.value
      await createAdminMutation.mutateAsync(createData)
    }

    showCreateDialog.value = false
    resetForm()
  } catch (error: any) {
    formError.value = error.message || 'An error occurred while saving the admin'
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (admin: AdminUser) => {
  adminToDelete.value = admin
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!adminToDelete.value) return

  try {
    await deleteAdminMutation.mutateAsync(adminToDelete.value.id)
    showDeleteDialog.value = false
    adminToDelete.value = null
  } catch (error: any) {
    alert(error.message || 'An error occurred while deleting the admin')
  }
}
</script>


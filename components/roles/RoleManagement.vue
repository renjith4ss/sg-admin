<template>
  <div class="space-y-6">
    <div class="flex justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Role Management</h2>
      <Button @click="showCreateDialog = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Role
      </Button>
    </div>

    <Tabs defaultValue="roles" class="w-full">
      <TabsList>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="roles">
        <DataTable :columns="roleColumns" :data="roles">
          <template #permissions="{ row }">
            <div class="flex flex-wrap gap-1">
              <Badge 
                v-for="permission in row.permissions" 
                :key="permission"
                variant="secondary"
              >
                {{ permission }}
              </Badge>
            </div>
          </template>
          <template #actions="{ row }">
            <DropdownMenu>
              <DropdownMenuTrigger as="Button" variant="ghost" class="h-8 w-8 p-0">
                <MoreHorizontalIcon class="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="editRole(row)">Edit</DropdownMenuItem>
                <DropdownMenuItem @click="managePermissions(row)">
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  class="text-destructive" 
                  @click="deleteRole(row)"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </template>
        </DataTable>
      </TabsContent>

      <TabsContent value="permissions">
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div 
                v-for="role in roles" 
                :key="role.id" 
                class="flex items-start space-x-4"
              >
                <div class="w-32">{{ role.name }}</div>
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="permission in availablePermissions" 
                    :key="permission"
                    class="flex items-center space-x-2"
                  >
                    <Checkbox 
                      :id="`${role.id}-${permission}`"
                      :checked="hasPermission(role, permission)"
                      @change="togglePermission(role, permission)"
                    />
                    <Label :for="`${role.id}-${permission}`">
                      {{ permission }}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Create/Edit Role Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit' : 'Create' }} Role</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="saveRole">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Role Name</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div class="space-y-2">
              <Label>Permissions</Label>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="permission in availablePermissions" 
                  :key="permission"
                  class="flex items-center space-x-2"
                >
                  <Checkbox 
                    :id="`new-${permission}`"
                    v-model="form.permissions"
                    :value="permission"
                  />
                  <Label :for="`new-${permission}`">{{ permission }}</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter class="mt-4">
            <Button type="submit">{{ isEditing ? 'Update' : 'Create' }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { CustomRole } from '~/types'

const roles = ref<CustomRole[]>([])
const showCreateDialog = ref(false)
const isEditing = ref(false)

const availablePermissions = [
  'view:displays',
  'create:displays',
  'edit:displays',
  'delete:displays',
  'manage:users',
  'manage:roles',
  'manage:billing',
]

const form = ref({
  name: '',
  permissions: [] as string[],
})

const roleColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => row.original,
  },
  {
    id: 'actions',
    cell: ({ row }) => row.original,
  },
]

const hasPermission = (role: CustomRole, permission: string) => {
  return role.permissions.includes(permission)
}

const togglePermission = (role: CustomRole, permission: string) => {
  // Implement permission toggle logic
}

// Add your role management methods here
</script> 
<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Users</h2>
      <Button @click="showInviteDialog = true">
        <UserPlusIcon class="w-4 h-4 mr-2" />
        Invite User
      </Button>
    </div>

    <DataTable :columns="columns" :data="users">
      <template #organizationRoles="{ row }">
        <div class="flex flex-wrap gap-1">
          <Badge 
            v-for="membership in row.organizationMemberships" 
            :key="membership.organizationId"
          >
            {{ getOrganizationRole(membership) }}
          </Badge>
        </div>
      </template>
      <template #actions="{ row }">
        <DropdownMenu>
          <DropdownMenuTrigger as="Button" variant="ghost" class="h-8 w-8 p-0">
            <MoreHorizontalIcon class="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="editUser(row)">Edit</DropdownMenuItem>
            <DropdownMenuItem @click="manageRoles(row)">Manage Roles</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-destructive" @click="deleteUser(row)">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </DataTable>

    <!-- User Invite Dialog -->
    <Dialog v-model:open="showInviteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="inviteUser">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="form.email" required />
            </div>
            <div class="space-y-2">
              <Label for="organization">Organization</Label>
              <Select v-model="form.organizationId">
                <option v-for="org in organizations" :key="org.id" :value="org.id">
                  {{ org.name }}
                </option>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="role">Role</Label>
              <Select v-model="form.roleId">
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </Select>
            </div>
          </div>
          <DialogFooter class="mt-4">
            <Button type="submit">Send Invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { User, Organization } from '~/types'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'organizationRoles',
    header: 'Organizations & Roles',
    cell: ({ row }) => row.original,
  },
  {
    id: 'actions',
    cell: ({ row }) => row.original,
  },
]

const users = ref<User[]>([])
const organizations = ref<Organization[]>([])
const showInviteDialog = ref(false)
const form = ref({
  email: '',
  organizationId: '',
  roleId: '',
})

// Add your user management methods here
</script> 
<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Organizations</h2>
      <Button @click="showCreateDialog = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Organization
      </Button>
    </div>

    <DataTable :columns="columns" :data="organizations">
      <template #actions="{ row }">
        <DropdownMenu>
          <DropdownMenuTrigger as="Button" variant="ghost" class="h-8 w-8 p-0">
            <MoreHorizontalIcon class="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="editOrganization(row)">Edit</DropdownMenuItem>
            <DropdownMenuItem @click="manageUsers(row)">Manage Users</DropdownMenuItem>
            <DropdownMenuItem @click="manageRoles(row)">Manage Roles</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-destructive" @click="deleteOrganization(row)">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </DataTable>

    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="createOrganization">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div class="space-y-2">
              <Label for="plan">Subscription Plan</Label>
              <Select v-model="form.planType">
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
              </Select>
            </div>
          </div>
          <DialogFooter class="mt-4">
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '~/types'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'subscriptionPlan.type',
    header: 'Plan',
  },
  {
    accessorKey: 'displaySlots',
    header: 'Display Slots',
  },
  {
    id: 'actions',
    cell: ({ row }) => row.original,
  },
]

const organizations = ref<Organization[]>([])
const showCreateDialog = ref(false)
const form = ref({
  name: '',
  planType: 'free',
})

// Add your organization management methods here
</script> 
<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Organizations</h1>
      <Button @click="dialog = true">
        <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
        Add Organization
      </Button>
    </div>

    <Card class="w-full">
      <Table
        :columns="columns"
        :rows="organizationStore.organizations"
        :loading="organizationStore.isLoading"
      >
        <template #cell-owner="{ row }">
          {{ typeof row.owner === 'object' ? row.owner.email : row.owner }}
        </template>

        <template #cell-status="{ row }">
          <Badge :variant="row.status === 'active' ? 'default' : 'destructive'">
            {{ row.status }}
          </Badge>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="handleEdit(row)">
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" @click="handleDelete(row)">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>

    <Dialog :open="dialog" @close="handleDialogClose">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {{ selectedOrganization ? 'Edit' : 'Create' }} Organization
          </DialogTitle>
        </DialogHeader>
        <OrganizationForm
          :organization="selectedOrganization"
          @close="handleDialogClose"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import { useOrganizationsStore } from '~/stores/organization'
import type { Organization } from '~/types/organization'

const organizationStore = useOrganizationsStore()
const dialog = ref(false)
const selectedOrganization = ref<Organization | null>(null)

const columns = [
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'owner',
    label: 'Owner'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

onMounted(() => {
  organizationStore.fetchOrganizations()
})

const handleEdit = (organization: Organization) => {
  selectedOrganization.value = organization
  dialog.value = true
}

const handleDelete = async (organization: Organization) => {
  if (confirm('Are you sure you want to delete this organization?')) {
    await organizationStore.deleteOrganization(organization.id)
  }
}

const handleDialogClose = () => {
  selectedOrganization.value = null
  dialog.value = false
}
</script>
<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Displays</h2>
      <Button @click="showCreateDialog = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Display
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Display Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart :data="displayUsageData">
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="used" fill="#3b82f6" />
            <Bar dataKey="total" fill="#93c5fd" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <DataTable :columns="columns" :data="displays">
      <template #status="{ row }">
        <Badge :variant="row.status === 'active' ? 'success' : 'secondary'">
          {{ row.status }}
        </Badge>
      </template>
      <template #actions="{ row }">
        <DropdownMenu>
          <DropdownMenuTrigger as="Button" variant="ghost" class="h-8 w-8 p-0">
            <MoreHorizontalIcon class="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="editDisplay(row)">Edit</DropdownMenuItem>
            <DropdownMenuItem @click="manageContent(row)">Manage Content</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-destructive" @click="deleteDisplay(row)">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Display } from '~/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'organization.name',
    header: 'Organization',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    cell: ({ row }) => row.original,
  },
]

const displays = ref<Display[]>([])
const displayUsageData = ref([
  { name: 'Org A', used: 4, total: 5 },
  { name: 'Org B', used: 2, total: 3 },
  // Add more data...
])

// Add your display management methods here
</script> 
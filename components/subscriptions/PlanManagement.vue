<template>
  <div class="space-y-6">
    <div class="flex justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Subscription Plans</h2>
      <Button @click="showCreateDialog = true">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Plan
      </Button>
    </div>

    <!-- Plan Cards -->
    <div class="grid gap-6 md:grid-cols-3">
      <Card v-for="plan in plans" :key="plan.type">
        <CardHeader>
          <CardTitle class="flex justify-between">
            {{ plan.type }}
            <Badge>{{ formatPrice(plan.price) }}/mo</Badge>
          </CardTitle>
          <CardDescription>
            Includes {{ plan.displaySlots }} display slots
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="space-y-1">
            <div class="flex items-center">
              <CheckIcon class="w-4 h-4 mr-2 text-green-500" />
              {{ plan.displaySlots }} Display Slots
            </div>
            <div class="flex items-center">
              <CheckIcon class="w-4 h-4 mr-2 text-green-500" />
              Additional displays at {{ formatPrice(plan.additionalDisplayPrice) }}/display
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-2">
          <Button variant="outline" @click="editPlan(plan)">Edit</Button>
          <Button variant="destructive" @click="deletePlan(plan)">Delete</Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Create/Edit Plan Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit' : 'Create' }} Plan</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="savePlan">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="type">Plan Type</Label>
              <Input id="type" v-model="form.type" required />
            </div>
            <div class="space-y-2">
              <Label for="price">Monthly Price ($)</Label>
              <Input id="price" type="number" v-model="form.price" required />
            </div>
            <div class="space-y-2">
              <Label for="displaySlots">Display Slots</Label>
              <Input id="displaySlots" type="number" v-model="form.displaySlots" required />
            </div>
            <div class="space-y-2">
              <Label for="additionalPrice">Additional Display Price ($)</Label>
              <Input id="additionalPrice" type="number" v-model="form.additionalDisplayPrice" required />
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
import type { SubscriptionPlan } from '~/types'

const plans = ref<SubscriptionPlan[]>([])
const showCreateDialog = ref(false)
const isEditing = ref(false)
const form = ref({
  type: '',
  price: 0,
  displaySlots: 1,
  additionalDisplayPrice: 5,
})

const formatPrice = (price: number) => `$${price.toFixed(2)}`

// Add your plan management methods here
</script> 
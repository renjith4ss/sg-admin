<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Plans</h1>
          <Badge
            v-if="showDeletedPlans"
            variant="destructive"
            class="text-xs"
          >
            Showing Deleted Plans
          </Badge>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage subscription plans</p>
      </div>
      <Button @click="createNewPlan" class="gap-2">
        <Icon name="heroicons:plus" class="h-5 w-5" />
        {{ activeTab === 'addon' ? 'New Add-on' : 'New Plan' }}
      </Button>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
        </div>
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Search plans..."
          class="pl-10"
        />
      </div>
      <Button
        variant="outline"
        :class="showDeletedPlans ? 'bg-amber-100 dark:bg-amber-900/50' : ''"
        @click="showDeletedPlans = !showDeletedPlans"
      >
        <Icon
          :name="showDeletedPlans ? 'heroicons:archive-box-x-mark' : 'heroicons:archive-box'"
          class="mr-2 h-4 w-4"
        />
        {{ showDeletedPlans ? 'Hide Deleted Plans' : 'Show Deleted Plans' }}
      </Button>
    </div>

    <!-- Add before the table -->
    <div class="mb-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="() => { activeTab = tab.value }"
            :class="[
              activeTab === tab.value
                ? 'border-amber-500 text-amber-600 dark:text-amber-500'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Plans Table -->
    <div v-if="!isLoading && filteredPlans.length === 0" class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
        <Icon name="heroicons:tag" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No plans available</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating a new {{ activeTab === 'tenant' ? 'tenant' : 'display' }} plan.
      </p>
      <Button @click="createNewPlan" class="mt-6 gap-2">
        <Icon name="heroicons:plus" class="h-5 w-5" />
        New Plan
      </Button>
    </div>

    <!-- Show table only when there are plans -->
    <div v-else class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                {{ header.label }}
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading" class="animate-pulse bg-gray-50 dark:bg-gray-900/50">
              <td
                v-for="header in tableHeaders"
                :key="header.key"
                class="whitespace-nowrap px-6 py-4"
              >
                <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
            </tr>
            <tr
              v-else
              v-for="plan in filteredPlans"
              :key="plan.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ plan.name }}</div>
                  <span
                    v-if="plan.is_special"
                    class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  >
                    Special
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ plan.description }}</div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ plan.currency }} {{ plan.monthlyPrice }}
                  <span v-if="plan.monthlyDiscount > 0" class="ml-1 text-xs text-green-600">
                    (-{{ plan.monthlyDiscount }}%)
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ plan.currency }} {{ plan.yearlyPrice }}
                  <span v-if="plan.yearlyDiscount > 0" class="ml-1 text-xs text-green-600">
                    (-{{ plan.yearlyDiscount }}%)
                  </span>
                </div>
              </td>
              <template v-if="activeTab === 'tenant'">
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ plan.maxMembers || '-' }}</div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ formatStorage(plan.storage) }}</div>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ plan.displayCount || '-' }}</div>
                </td>
              </template>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <template v-if="!plan.deleted">
                  <Button
                    variant="ghost"
                    @click="editPlan(plan)"
                    class="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-400"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    @click="confirmDelete(plan)"
                    class="ml-4 text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
                  >
                    Delete
                  </Button>
                </template>
                <template v-else>
                  <Button
                    variant="ghost"
                    @click="confirmRestore(plan)"
                    class="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400"
                  >
                    Restore
                  </Button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog 
      :open="showCreateDialog" 
      @update:open="(value) => handleDialogClose('create', value)"
    >
      <DialogContent class="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>
            {{ isEditing 
              ? (selectedPlan?.isAddon ? 'Edit Add-on' : 'Edit Plan')
              : (formData.isAddon ? 'Create New Add-on' : 'Create New Plan') 
            }}
          </DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit">
          <div class="flex gap-8">
            <!-- Left Column - Plan Details -->
            <div class="flex-1 space-y-4 min-w-[500px]">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Is Add-on Plan?</label>
                <Switch
                  :checked="formData.isAddon"
                  @update:checked="formData.isAddon = $event"
                >
                  <span class="sr-only">Is Add-on Plan</span>
                </Switch>
              </div>

              <div>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                />
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

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="monthlyPrice">Monthly Price</Label>
                  <div class="relative mt-1 rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="monthlyPrice"
                      v-model.number="formData.monthlyPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label for="monthlyDiscount">Monthly Discount (%)</Label>
                  <Input
                    id="monthlyDiscount"
                    v-model.number="formData.monthlyDiscount"
                    type="number"
                    min="0"
                    max="100"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="yearlyPrice">Yearly Price</Label>
                  <div class="relative mt-1 rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="yearlyPrice"
                      v-model.number="formData.yearlyPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label for="yearlyDiscount">Yearly Discount (%)</Label>
                  <Input
                    id="yearlyDiscount"
                    v-model.number="formData.yearlyDiscount"
                    type="number"
                    min="0"
                    max="100"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="trialPeriodDays">Trial Period (Days)</Label>
                  <Input
                    id="trialPeriodDays"
                    v-model.number="formData.trialPeriodDays"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <Label for="currency">Currency</Label>
                  <Input
                    id="currency"
                    v-model="formData.currency"
                    type="text"
                    maxlength="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <Label for="maxMembers">Max Members</Label>
                  <Input
                    id="maxMembers"
                    v-model.number="maxMembersValue"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <Label for="storage">Storage (MB)</Label>
                  <Input
                    id="storage"
                    v-model.number="storageValue"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <Label for="displayCount">Display Count</Label>
                  <Input
                    id="displayCount"
                    v-model.number="displayCountValue"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-sm font-medium text-gray-700 dark:text-gray-300">Special Plan</Label>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Special plans are only visible to admins and can be assigned to specific tenants. They won't appear in the client's plan selection.
                    </p>
                  </div>
                  <Switch
                    :checked="formData.is_special"
                    @update:checked="formData.is_special = $event"
                  >
                    <span class="sr-only">Special Plan</span>
                  </Switch>
                </div>
              </div>
            </div>

            <!-- Right Column - Features -->
            <div class="flex-1 min-w-[400px]">
              <div class="sticky top-0">
                <Label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</Label>
                <div class="mt-2 h-[600px] space-y-2 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div v-for="(feature, index) in formData.features" :key="index" class="flex gap-2">
                    <Input
                      v-model="formData.features[index]"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      @click="removeFeature(index)"
                      class="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Icon name="heroicons:x-mark" class="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addFeature"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Icon name="heroicons:plus" class="h-4 w-4" />
                    Add Feature
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              @click="showCreateDialog = false"
              :disabled="isSubmitting"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="isSubmitting || (isEditing && !hasChanges())"
            >
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
            </Button>
          </div>

          <div v-if="formError" class="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/50">
            <p class="text-sm text-red-600 dark:text-red-200 whitespace-pre-line">{{ formError }}</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog 
      :open="showDeleteDialog" 
      @update:open="(value) => handleDialogClose('delete', value)"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Plan</DialogTitle>
        </DialogHeader>
        <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this plan? This action cannot be undone.
        </DialogDescription>
        <div class="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            @click="showDeleteDialog = false"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="handleDelete"
            :disabled="isLoading"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Restore Dialog -->
    <Dialog 
      :open="showRestoreDialog" 
      @update:open="(value) => handleDialogClose('restore', value)"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Plan</DialogTitle>
        </DialogHeader>
        <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to restore this plan? It will become active again.
        </DialogDescription>
        <div class="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            @click="showRestoreDialog = false"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            @click="handleRestore"
            :disabled="isSubmitting"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            {{ isSubmitting ? 'Restoring...' : 'Restore' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Plan, ValidationError, ApiError, PlanTabValue, DialogType, PlanTab } from '~/types/plans'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import {
  Button,
  buttonVariants
} from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Switch } from '~/components/ui/switch'

definePageMeta({
  middleware: ['auth']
})

const plansStore = usePlansStore()
const { plans, isLoading } = storeToRefs(plansStore)

const searchQuery = ref('')
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const showRestoreDialog = ref(false)
const selectedPlan = ref<Plan | null>(null)
const isEditing = ref(false)
const showDeletedPlans = ref(false)
const activeTab = ref<PlanTabValue>('tenant')

const tabs: PlanTab[] = [
  { label: 'Plans', value: 'tenant' },
  { label: 'Add-ons', value: 'addon' }
]

const formData = ref<Omit<Plan, 'id' | 'created' | 'updated'>>({
  name: '',
  description: '',
  yearlyPrice: 0,
  monthlyPrice: 0,
  yearlyDiscount: 0,
  monthlyDiscount: 0,
  trialPeriodDays: 0,
  currency: 'USD',
  features: [],
  is_special: false,
  deleted: false,
  stripeProductId: '',
  stripeMonthlyPriceId: '',
  stripeYearlyPriceId: '',
  isAddon: false,
  displayCount: 0,
  storage: 0,
  maxMembers: 0
})

const tableHeaders = computed(() => {
  const baseHeaders = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'monthlyPrice', label: 'Monthly Price' },
    { key: 'yearlyPrice', label: 'Yearly Price' }
  ]

  if (activeTab.value === 'tenant') {
    return [
      ...baseHeaders,
      { key: 'maxMembers', label: 'Max Members' },
      { key: 'storage', label: 'Storage (GB)' },
      { key: 'displayCount', label: 'Display Count' }
    ]
  }

  return baseHeaders
})

const filteredPlans = computed(() => {
  // First filter by isAddon and deleted status
  const plansByType = plans.value.filter(plan => 
    (activeTab.value === 'addon' ? plan.isAddon : !plan.isAddon) && 
    plan.deleted === showDeletedPlans.value
  )
  
  // Then apply search if query exists
  if (!searchQuery.value) return plansByType

  const query = searchQuery.value.toLowerCase()
  return plansByType.filter(plan =>
    plan.name.toLowerCase().includes(query) ||
    plan.description.toLowerCase().includes(query) ||
    plan.currency.toLowerCase().includes(query) ||
    plan.monthlyPrice.toString().includes(query) ||
    plan.yearlyPrice.toString().includes(query) ||
    plan.features.some(feature => feature.toLowerCase().includes(query))
  )
})

// Load plans on component mount
onMounted(async () => {
  await plansStore.fetchPlans()
})

function resetForm() {
  formData.value = {
    name: '',
    description: '',
    yearlyPrice: 0,
    monthlyPrice: 0,
    yearlyDiscount: 0,
    monthlyDiscount: 0,
    trialPeriodDays: 0,
    currency: 'USD',
    features: [],
    is_special: false,
    deleted: false,
    stripeProductId: '',
    stripeMonthlyPriceId: '',
    stripeYearlyPriceId: '',
    isAddon: activeTab.value === 'addon',
    displayCount: 0,
    storage: 0,
    maxMembers: 0
  }
  isEditing.value = false
  selectedPlan.value = null
}

function editPlan(plan: Plan) {
  isEditing.value = true
  selectedPlan.value = plan
  formData.value = {
    name: plan.name,
    description: plan.description,
    yearlyPrice: plan.yearlyPrice,
    monthlyPrice: plan.monthlyPrice,
    yearlyDiscount: plan.yearlyDiscount,
    monthlyDiscount: plan.monthlyDiscount,
    trialPeriodDays: plan.trialPeriodDays,
    currency: plan.currency || 'USD',
    features: [...plan.features],
    is_special: plan.is_special,
    deleted: plan.deleted,
    stripeProductId: plan.stripeProductId,
    stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
    stripeYearlyPriceId: plan.stripeYearlyPriceId,
    isAddon: plan.isAddon,
    displayCount: plan.displayCount,
    storage: plan.storage,
    maxMembers: plan.maxMembers
  }
  showCreateDialog.value = true
}

function confirmDelete(plan: Plan) {
  selectedPlan.value = plan
  showDeleteDialog.value = true
}

async function handleDelete() {
  const plan = selectedPlan.value
  if (!plan) return

  try {
    isSubmitting.value = true
    await plansStore.updatePlan(plan.id, { ...plan, deleted: true })
    showDeleteDialog.value = false
    selectedPlan.value = null
  } catch (error: any) {
    formError.value = error?.message || 'Failed to delete plan'
  } finally {
    isSubmitting.value = false
  }
}

const isSubmitting = ref(false)
const formError = ref<string | null>(null)

function hasChanges(): boolean {
  const plan = selectedPlan.value
  if (!plan) return true
  return Object.keys(formData.value).some(key => {
    const formValue = formData.value[key as keyof typeof formData.value]
    const originalValue = plan[key as keyof Plan]
    return JSON.stringify(formValue) !== JSON.stringify(originalValue)
  })
}

async function handleSubmit() {
  formError.value = null
  if (isEditing.value && !hasChanges()) {
    showCreateDialog.value = false
    return
  }

  try {
    isSubmitting.value = true
    if (isEditing.value && selectedPlan.value) {
      await plansStore.updatePlan(selectedPlan.value.id, formData.value)
    } else {
      await plansStore.createPlan(formData.value)
    }
    showCreateDialog.value = false
    resetForm()
  } catch (error: any) {
    // Handle validation errors
    if (error.data && error.data.data) {
      const validationErrors = Object.entries(error.data.data)
        .map(([field, err]) => `${field}: ${(err as ValidationError).message}`)
        .join('\n')
      formError.value = `${error.data.message}\n${validationErrors}`
    } else {
      formError.value = error?.message || error?.data?.message || 'Failed to save plan'
    }
  } finally {
    isSubmitting.value = false
  }
}

function addFeature() {
  formData.value.features.push('')
}

function removeFeature(index: number) {
  formData.value.features.splice(index, 1)
}

function formatStorage(mbSize: number | null): string {
  if (mbSize === null) return '-'
  
  const units = ['MB', 'GB', 'TB', 'PB']
  let size = mbSize
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`
}

function createNewPlan() {
  resetForm()
  showCreateDialog.value = true
}

const maxMembersValue = computed({
  get: () => formData.value.maxMembers ?? undefined,
  set: (val) => formData.value.maxMembers = val ?? null
})

const storageValue = computed({
  get: () => formData.value.storage ?? undefined,
  set: (val) => formData.value.storage = val ?? null
})

const displayCountValue = computed({
  get: () => formData.value.displayCount ?? undefined,
  set: (val) => formData.value.displayCount = val ?? null
})

async function confirmRestore(plan: Plan) {
  selectedPlan.value = plan
  showRestoreDialog.value = true
}

async function handleRestore() {
  const plan = selectedPlan.value
  if (!plan) return

  try {
    isSubmitting.value = true
    await plansStore.updatePlan(plan.id, { ...plan, deleted: false })
    showRestoreDialog.value = false
    selectedPlan.value = null
  } catch (error: any) {
    formError.value = error?.message || 'Failed to restore plan'
  } finally {
    isSubmitting.value = false
  }
}

function handleDialogClose(dialog: DialogType, value: boolean) {
  if (!value) {
    formError.value = null
    if (dialog === 'create') {
      resetForm()
    } else {
      selectedPlan.value = null
    }
  }
  
  switch (dialog) {
    case 'create':
      showCreateDialog.value = value
      break
    case 'delete':
      showDeleteDialog.value = value
      break
    case 'restore':
      showRestoreDialog.value = value
      break
  }
}


</script> 
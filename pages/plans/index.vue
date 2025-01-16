<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Plans</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage subscription plans
        </p>
      </div>
      <Button @click="createNewPlan" class="gap-2">
        <Icon name="heroicons:plus" class="h-5 w-5" />
        {{ activeTab === "addon" ? "New Add-on" : "New Plan" }}
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
        <Button
          variant="outline"
          :class="showDeletedPlans ? 'bg-blue-100 dark:bg-blue-900/50' : ''"
          @click="showDeletedPlans = !showDeletedPlans"
        >
          <Icon
            :name="
              showDeletedPlans
                ? 'heroicons:archive-box-x-mark'
                : 'heroicons:archive-box'
            "
            class="mr-2 h-4 w-4"
          />
          {{ showDeletedPlans ? "Hide Deleted Plans" : "Show Deleted Plans" }}
        </Button>
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

    <!-- Tabs -->
    <div class="mb-6">
      <div
        class="border-b border-gray-200 dark:border-gray-700 flex justify-between"
      >
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="
              () => {
                activeTab = tab.value;
              }
            "
            :class="[
              activeTab === tab.value
                ? 'border-blue-500 text-blue-600 dark:text-blue-500'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
        <div class="flex items-center gap-2">
          <label
            for="billing-period"
            class="text-sm font-medium text-gray-500 dark:text-gray-400"
            >Monthly</label
          >
          <Switch
            :checked="isYearlyBilling"
            @update:checked="isYearlyBilling = $event"
            class="relative inline-flex h-6 w-11 items-center rounded-full ui-checked:bg-blue-600 ui-not-checked:bg-gray-200 dark:ui-not-checked:bg-gray-700"
          >
            <span class="sr-only">Toggle billing period</span>
          </Switch>
          <label
            for="billing-period"
            class="text-sm font-medium text-gray-500 dark:text-gray-400"
            >Yearly</label
          >
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="isGridView" class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="activeTab === 'tenant' && regularPlans.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Subscription Plans
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <PlanCard
            v-for="plan in regularPlans"
            :key="plan.id"
            :plan="plan"
            :is-yearly="isYearlyBilling"
            @click="showPlanDetails(plan)"
          />
        </div>
      </div>

      <!-- Add-ons Section -->
      <div v-if="activeTab === 'addon' && addonPlans.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Add-on Plans
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <PlanCard
            v-for="plan in addonPlans"
            :key="plan.id"
            :plan="plan"
            :is-yearly="isYearlyBilling"
            @click="showPlanDetails(plan)"
          />
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="activeTab === 'tenant' && regularPlans.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Subscription Plans
        </h2>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Monthly Price</TableHead>
                <TableHead>Yearly Price</TableHead>
                <TableHead class="w-[80px]"> Members </TableHead>
                <TableHead class="w-[80px]"> Storage </TableHead>
                <TableHead class="w-[80px]"> Displays </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="plan in regularPlans"
                :key="plan.id"
                class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                @click="showPlanDetails(plan)"
              >
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ plan.name }}</span>
                    <Badge
                      v-if="plan.isSpecial"
                      variant="secondary"
                      class="text-xs"
                    >
                      Special
                    </Badge>
                    <Badge
                      v-if="plan.deleted"
                      variant="destructive"
                      class="text-xs"
                    >
                      Deleted
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{{ plan.description }}</TableCell>
                <TableCell>
                  {{ plan.currency }} {{ plan.monthlyPrice }}
                  <span
                    v-if="plan.monthlyDiscount > 0"
                    class="ml-1 text-xs text-green-600"
                  >
                    (-{{ plan.monthlyDiscount }}%)
                  </span>
                </TableCell>
                <TableCell>
                  {{ plan.currency }} {{ plan.yearlyPrice }}
                  <span
                    v-if="plan.yearlyDiscount > 0"
                    class="ml-1 text-xs text-green-600"
                  >
                    (-{{ plan.yearlyDiscount }}%)
                  </span>
                </TableCell>
                <TableCell class="text-center">{{
                  plan.maxMembers || 0
                }}</TableCell>
                <TableCell class="text-center">{{
                  formatStorage(plan.storage)
                }}</TableCell>
                <TableCell class="text-center">{{
                  plan.displayCount || 0
                }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Add-ons Section -->
      <div v-if="activeTab === 'addon' && addonPlans.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Add-on Plans
        </h2>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Monthly Price</TableHead>
                <TableHead>Yearly Price</TableHead>
                <TableHead class="w-[80px]"> Members </TableHead>
                <TableHead class="w-[80px]"> Storage </TableHead>
                <TableHead class="w-[80px]"> Displays </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="plan in addonPlans"
                :key="plan.id"
                class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                @click="showPlanDetails(plan)"
              >
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ plan.name }}</span>
                    <Badge
                      v-if="plan.isSpecial"
                      variant="secondary"
                      class="text-xs"
                    >
                      Special
                    </Badge>
                    <Badge
                      v-if="plan.deleted"
                      variant="destructive"
                      class="text-xs"
                    >
                      Deleted
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{{ plan.description }}</TableCell>
                <TableCell>
                  {{ plan.currency }} {{ plan.monthlyPrice }}
                  <span
                    v-if="plan.monthlyDiscount > 0"
                    class="ml-1 text-xs text-green-600"
                  >
                    (-{{ plan.monthlyDiscount }}%)
                  </span>
                </TableCell>
                <TableCell>
                  {{ plan.currency }} {{ plan.yearlyPrice }}
                  <span
                    v-if="plan.yearlyDiscount > 0"
                    class="ml-1 text-xs text-green-600"
                  >
                    (-{{ plan.yearlyDiscount }}%)
                  </span>
                </TableCell>
                <TableCell class="text-center">{{
                  plan.maxMembers || 0
                }}</TableCell>
                <TableCell class="text-center">{{
                  formatStorage(plan.storage)
                }}</TableCell>
                <TableCell class="text-center">{{
                  plan.displayCount || 0
                }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          (activeTab === 'tenant' && regularPlans.length === 0) ||
          (activeTab === 'addon' && addonPlans.length === 0)
        "
        class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
        >
          <Icon
            name="heroicons:tag"
            class="h-6 w-6 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No plans available
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new
          {{ activeTab === "tenant" ? "subscription" : "add-on" }} plan
        </p>
        <Button @click="createNewPlan" class="mt-6 gap-2">
          <Icon name="heroicons:plus" class="h-5 w-5" />
          {{ activeTab === "addon" ? "New Add-on" : "New Plan" }}
        </Button>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      :open="showCreateDialog"
      @update:open="(value: boolean) => handleDialogClose('create', value)"
    >
      <DialogContent class="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>
            {{
              isEditing
                ? selectedPlan?.isAddon
                  ? "Edit Add-on"
                  : "Edit Plan"
                : formData.isAddon
                ? "Create New Add-on"
                : "Create New Plan"
            }}
          </DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit">
          <div class="flex gap-8">
            <!-- Left Column - Plan Details -->
            <div class="flex-1 space-y-4 min-w-[500px]">
              <div class="flex items-center justify-between">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Is Add-on Plan?</label
                >
                <Switch
                  :checked="formData.isAddon"
                  @update:checked="formData.isAddon = $event"
                >
                  <span class="sr-only">Is Add-on Plan</span>
                </Switch>
              </div>

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

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="monthlyPrice">Monthly Price</Label>
                  <div class="relative mt-1 rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="monthlyPrice"
                      v-model.number="formData.monthlyPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="yearlyPrice">Yearly Price</Label>
                  <div class="relative mt-1 rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="yearlyPrice"
                      v-model.number="formData.yearlyPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <Label for="currency">Currency</Label>
                  <Input
                    id="currency"
                    v-model="formData.currency"
                    type="text"
                    maxlength="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <Label for="storage">Storage (MB)</Label>
                  <Input
                    id="storage"
                    v-model.number="storageValue"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <Label for="displayCount">Display Count</Label>
                  <Input
                    id="displayCount"
                    v-model.number="displayCountValue"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <Label
                      class="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Special Plan</Label
                    >
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Special plans are only visible to admins and can be
                      assigned to specific tenants. They won't appear in the
                      client's plan selection.
                    </p>
                  </div>
                  <Switch
                    :checked="formData.isSpecial"
                    @update:checked="formData.isSpecial = $event"
                  >
                    <span class="sr-only">Special Plan</span>
                  </Switch>
                </div>
              </div>
            </div>

            <!-- Right Column - Features -->
            <div class="flex-1 min-w-[400px]">
              <div class="sticky top-0">
                <Label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Features</Label
                >
                <div
                  class="mt-2 h-[600px] space-y-2 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div
                    v-for="(feature, index) in formData.features"
                    :key="index"
                    class="flex gap-2"
                  >
                    <Input
                      v-model="formData.features[index]"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      @click="removeFeature(index)"
                      class="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Icon name="heroicons:x-mark" class="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addFeature"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
    <PlanDetails
      v-if="selectedPlanForDetails"
      :isOpen="showDetailsDialog"
      :plan="selectedPlanForDetails"
      @update:open="showDetailsDialog = $event"
      @edit="() => {
        showDetailsDialog = false
        editPlan(selectedPlanForDetails!)
      }"
      @delete="() => {
        showDetailsDialog = false
        confirmDelete(selectedPlanForDetails!)
      }"
      @restore="() => {
        showDetailsDialog = false
        confirmRestore(selectedPlanForDetails!)
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { Plan, PlanTab, DialogType } from "~/types/plans";
import { usePlans } from "~/composables/usePlans";

const {
  plans,
  isLoading,
  error,
  activePlans: getActivePlans,
  addonPlans: getAddonPlans,
  regularPlans: getRegularPlans,
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  restorePlan,
} = usePlans();

// State
const searchQuery = ref("");
const showDeletedPlans = ref(false);
const showCreateDialog = ref(false);
const selectedPlan = ref<Plan | null>(null);
const activeTab = ref<"tenant" | "addon">("tenant");
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const isYearlyBilling = ref(false);
const showDetailsDialog = ref(false);
const selectedPlanForDetails = ref<Plan | null>(null);

// Form state
const formData = reactive({
  name: "",
  description: "",
  yearlyPrice: 0,
  monthlyPrice: 0,
  yearlyDiscount: 0,
  monthlyDiscount: 0,
  trialPeriodDays: 0,
  currency: "USD",
  features: [] as string[],
  isSpecial: false,
  deleted: false,
  stripeProductId: "",
  stripeMonthlyPriceId: "",
  stripeYearlyPriceId: "",
  isAddon: false,
  displayCount: 0,
  storage: 0,
  maxMembers: 0,
});

// Computed
const filteredPlans = computed(() => {
  let filtered =
    activeTab.value === "tenant" ? getRegularPlans.value : getAddonPlans.value;

  if (!showDeletedPlans.value) {
    filtered = filtered.filter((plan) => !plan.deleted);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (plan) =>
        plan.name.toLowerCase().includes(query) ||
        plan.description.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const isEditing = computed(() => !!selectedPlan.value);

const hasChanges = computed(() => {
  const plan = selectedPlan.value;
  if (!plan) return true; // Always true for new plans

  // Compare features array - check length and content
  const cleanFeatures = formData.features.filter(f => f.trim());
  const cleanOriginalFeatures = plan.features.filter(f => f.trim());
  
  const featuresChanged = 
    cleanFeatures.length !== cleanOriginalFeatures.length || 
    cleanFeatures.some((f, i) => f !== cleanOriginalFeatures[i]);

  // Compare other fields
  const otherFieldsChanged = Object.keys(formData).some(key => {
    if (key === 'features') return false;
    const formValue = formData[key as keyof typeof formData];
    const originalValue = plan[key as keyof Plan];
    return formValue !== originalValue;
  });

  return featuresChanged || otherFieldsChanged;
});

// Form computed values
const maxMembersValue = computed({
  get: () => formData.maxMembers,
  set: (val: number) => (formData.maxMembers = val),
});

const storageValue = computed({
  get: () => formData.storage,
  set: (val: number) => (formData.storage = val),
});

const displayCountValue = computed({
  get: () => formData.displayCount,
  set: (val: number) => (formData.displayCount = val),
});

// Methods
const resetForm = () => {
  Object.assign(formData, {
    name: "",
    description: "",
    yearlyPrice: 0,
    monthlyPrice: 0,
    yearlyDiscount: 0,
    monthlyDiscount: 0,
    trialPeriodDays: 0,
    currency: "USD",
    features: [],
    isSpecial: false,
    deleted: false,
    stripeProductId: "",
    stripeMonthlyPriceId: "",
    stripeYearlyPriceId: "",
    isAddon: activeTab.value === "addon",
    displayCount: 0,
    storage: 0,
    maxMembers: 0,
  });
  formError.value = null;
};

const createNewPlan = () => {
  selectedPlan.value = null;
  resetForm();
  showCreateDialog.value = true;
};

const editPlan = (plan: Plan) => {
  selectedPlan.value = plan;
  Object.assign(formData, {
    ...plan,
    features: [...plan.features]
  });
  showCreateDialog.value = true;
};

const handleSubmit = async () => {
  formError.value = null;
  isSubmitting.value = true;

  try {
    if (selectedPlan.value) {
      // Get only the changed fields for update
      const changedFields = Object.keys(formData).reduce((acc, key) => {
        const formValue = formData[key as keyof typeof formData];
        const originalValue = selectedPlan.value![key as keyof Plan];
        
        // Special handling for features array
        if (key === 'features') {
          const cleanFeatures = formData.features.filter(f => f.trim());
          const cleanOriginalFeatures = selectedPlan.value!.features.filter(f => f.trim());
          if (JSON.stringify(cleanFeatures) !== JSON.stringify(cleanOriginalFeatures)) {
            acc[key as keyof Plan] = cleanFeatures;
          }
          return acc;
        }

        // Compare other fields directly
        if (formValue !== originalValue) {
          acc[key as keyof Plan] = formValue;
        }
        return acc;
      }, {} as Record<keyof Plan, any>);

      if (Object.keys(changedFields).length > 0) {
        await updatePlan(selectedPlan.value.id, changedFields);
      }
    } else {
      await createPlan(formData);
    }
    showCreateDialog.value = false;
    resetForm();
  } catch (err: any) {
    formError.value = err.message || "Failed to save plan";
    console.error("Failed to save plan:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async (plan: Plan) => {
  try {
    isSubmitting.value = true;
    await deletePlan(plan.id);
  } catch (err: any) {
    formError.value = err.message || "Failed to delete plan";
    console.error("Failed to delete plan:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmRestore = async (plan: Plan) => {
  try {
    isSubmitting.value = true;
    await restorePlan(plan.id);
  } catch (err: any) {
    formError.value = err.message || "Failed to restore plan";
    console.error("Failed to restore plan:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDialogClose = (type: DialogType, value: boolean) => {
  if (!value) {
    showCreateDialog.value = false;
    selectedPlan.value = null;
    resetForm();
  }
};

const addFeature = () => {
  formData.features.push("");
};

const removeFeature = (index: number) => {
  formData.features.splice(index, 1);
};

const formatStorage = (storage: number) => {
  if (!storage) return "0MB";
  return storage >= 1024 ? `${storage / 1024}GB` : `${storage}MB`;
};

// Tabs
const tabs: PlanTab[] = [
  { label: "Tenant Plans", value: "tenant" },
  { label: "Add-ons", value: "addon" },
];

// Initial load
onMounted(async () => {
  await fetchPlans();
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

// Add these computed properties
const regularPlans = computed(() => {
  return filteredPlans.value.filter((plan) => !plan.isAddon);
});

const addonPlans = computed(() => {
  return filteredPlans.value.filter((plan) => plan.isAddon);
});

const showPlanDetails = (plan: Plan) => {
  selectedPlanForDetails.value = plan;
  showDetailsDialog.value = true;
};
</script>

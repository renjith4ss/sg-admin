<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tenants</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage tenants
        </p>
      </div>
      <Button @click="createNewTenant" class="gap-2">
        <Icon name="heroicons:plus" class="h-5 w-5" />
        New Tenant
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

    <!-- Grid View -->
    <div v-if="isGridView" class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="tenants.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Tenants
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <TenantCard
            v-for="tenant in tenants"
            :key="tenant.id"
            :tenant="tenant"
            @click="showTenantDetails(tenant)"
          />
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-8">
      <!-- Regular Plans Section -->
      <div v-if="tenants.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Tenants
        </h2>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="tenant in tenants"
                :key="tenant.id"
                class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                @click="showTenantDetails(tenant)"
              >
                
              <TableCell>
                  <img v-if="tenant.logo" :src="tenant.logo" alt="Tenant Logo" class="h-5 w-5" />
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ tenant.name }}</span>
                  </div>
                </TableCell>
                <TableCell>{{ tenant.address }}</TableCell>
                <TableCell>{{ tenant.owner }}</TableCell>
                <TableCell>{{ tenant.email }}</TableCell>
                <TableCell>{{ tenant.phone }}</TableCell>
                <TableCell>{{ tenant.type }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="tenants.length === 0"
        class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
        >
          <Icon
            name="heroicons:building-office-2-solid"
            class="h-6 w-6 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No tenants available
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new tenant
        </p>
        <Button @click="createNewTenant" class="mt-6 gap-2">
          <Icon name="heroicons:plus" class="h-5 w-5" />
          New Tenant
        </Button>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      :open="showCreateDialog"
      @update:open="(value: boolean) => handleDialogClose(value)"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{
              isEditing
                ? "Edit Tenant"
                : "Create New Tenant"
            }}
          </DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit">
          <div class="flex gap-8">
            <div class="flex-1 space-y-4">

              <div>
                <Label for="name">Name</Label>
                <Input id="name" v-model="formData.name" type="text" required />
              </div>

              <div>
                <Label for="address">Address</Label>
                <Textarea
                  id="address"
                  v-model="formData.address"
                  rows="3"
                  required
                />
              </div>

              <div>
                <Label for="owner">Owner</Label>
                <!-- <Input id="owner" v-model="formData.owner" type="text" required /> -->
              </div>

              <div>
                <Label for="email">Email</Label>
                <Input id="email" v-model="formData.email" type="email" required />
              </div>

              <div>
                <Label for="phone">Phone</Label>
                <Input id="phone" v-model="formData.phone" type="tel" required />
              </div>

              <div>
                <Label for="type">Type</Label>
                <Input id="type" v-model="formData.type" type="text" required />
              </div>

              <div>
                <Label for="logo">Logo</Label>
                <Input id="logo" v-model="formData.logo" type="file" required />
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
    <TenantDetails
      v-if="selectedTenantForDetails"
      :isOpen="showDetailsDialog"
      :tenant="selectedTenantForDetails"
      @update:open="showDetailsDialog = $event"
      @edit="() => {
        showDetailsDialog = false
        editTenant(selectedTenantForDetails!)
      }"
      @delete="() => {
        showDetailsDialog = false
        confirmDelete(selectedTenantForDetails!)
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { Tenant } from "~/types/tenants";
import { useTenants } from "~/composables/useTenants";
import { User } from "lucide-vue-next";

const {
  tenants,
  isLoading,
  error,
  fetchTenants,
  createTenant,
  updateTenant,
  deleteTenant
} = useTenants();

// State
const searchQuery = ref("");
const showCreateDialog = ref(false);
const selectedTenant = ref<Tenant | null>(null);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const showDetailsDialog = ref(false);
const selectedTenantForDetails = ref<Tenant | null>(null);

interface TenantFormData {
  name: string;
  address: string;
  owner: User | null;
  logo: string;
  email: string;
  phone: string;
  type: string;
  deleted: boolean;
}

// Form state
const formData = reactive<TenantFormData>({
  name: "",
  address: "",
  owner: null,
  logo: "",
  email: "",
  phone: "",
  type: "",
  deleted: false,
});

// Computed
const filteredTenants = computed(() => {
  let filtered = tenants.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(query) ||
        tenant.address.toLowerCase().includes(query) ||
        tenant.owner.name.toLowerCase().includes(query) ||
        tenant.email.toLowerCase().includes(query) ||
        tenant.phone.toLowerCase().includes(query) ||
        tenant.type.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const isEditing = computed(() => !!selectedTenant.value);

const hasChanges = computed(() => {
  const tenant = selectedTenant.value;
  if (!tenant) return true; // Always true for new tenants

  const otherFieldsChanged = Object.keys(formData).some(key => {
    const formValue = formData[key as keyof typeof formData];
    const originalValue = tenant[key as keyof Tenant];
    return formValue !== originalValue;
  });

  return otherFieldsChanged;
});


// Methods
const resetForm = () => {
  Object.assign(formData, {
    name: "",
    address: "",
    owner: "",
    logo: "",
    email: "",
    phone: "",
    type: ""
  });
  formError.value = null;
};

const createNewTenant = () => {
  selectedTenant.value = null;
  resetForm();
  showCreateDialog.value = true;
};

const editTenant = (tenant: Tenant) => {
  selectedTenant.value = tenant;
  Object.assign(formData, {
    ...tenant,
  });
  showCreateDialog.value = true;
};

const handleSubmit = async () => {
  formError.value = null;
  isSubmitting.value = true;

  try {
    if (selectedTenant.value) {
      const changedFields = Object.keys(formData).reduce((acc, key) => {
        const formValue = formData[key as keyof typeof formData];
        const originalValue = selectedTenant.value![key as keyof Tenant];
        
        if (formValue !== originalValue) {
          acc[key as keyof Tenant] = formValue;
        }
        return acc;
      }, {} as Record<keyof Tenant, any>);

      if (Object.keys(changedFields).length > 0) {
        await updateTenant(selectedTenant.value.id, changedFields);
      }
    } else {
      await createTenant(formData as unknown as Omit<Tenant, "id" | "created" | "updated">);
    }
    showCreateDialog.value = false;
    resetForm();
  } catch (err: any) {
    formError.value = err.message || "Failed to save tenant";
    console.error("Failed to save tenant:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async (tenant: Tenant) => {
  try {
    isSubmitting.value = true;
    await deleteTenant(tenant.id);
  } catch (err: any) {
    formError.value = err.message || "Failed to delete tenant";
    console.error("Failed to delete tenant:", err);
  } finally {
    isSubmitting.value = false;
  }
};


const handleDialogClose = (value: boolean) => {
  if (!value) {
    showCreateDialog.value = false;
    selectedTenant.value = null;
    resetForm();
  }
};

// Initial load
onMounted(async () => {
  await fetchTenants();
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

const showTenantDetails = (tenant: Tenant) => {
  selectedTenantForDetails.value = tenant;
  showDetailsDialog.value = true;
};
</script>

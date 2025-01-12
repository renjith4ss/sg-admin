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
        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="plan in regularPlans"
            :key="plan.id"
            class="group relative overflow-hidden rounded-xl border bg-gray-50 dark:bg-gray-800 border-gray-200 transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-900"
          >
            <!-- Status Badge -->
            <div class="absolute right-3 top-3 z-10 flex gap-2">
              <Badge
                v-if="plan.isSpecial"
                variant="secondary"
                class="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              >
                Special
              </Badge>
              <Badge v-if="plan.deleted" variant="destructive" class="text-xs">
                Deleted
              </Badge>
            </div>

            <!-- Card Header -->
            <div class="relative space-y-3 p-6 bg-white dark:bg-gray-800/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                    <Icon
                      :name="
                        plan.isAddon
                          ? 'heroicons:puzzle-piece'
                          : 'heroicons:document-text'
                      "
                      class="h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {{ plan.name }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ plan.description }}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <Icon
                        name="heroicons:ellipsis-vertical"
                        class="h-4 w-4"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="editPlan(plan)">
                      <Icon name="heroicons:pencil" class="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="confirmDelete(plan)"
                      class="text-red-600"
                    >
                      <Icon name="heroicons:trash" class="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <!-- Card Content -->
            <div class="space-y-6 rounded-b-xl p-6">
              <!-- Pricing -->
              <div v-if="isYearlyBilling" class="space-y-2">
                <div class="flex items-baseline gap-1">
                  <span
                    class="text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    ${{ plan.yearlyPrice }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    /year
                  </span>
                  <span
                    v-if="plan.yearlyDiscount > 0"
                    class="text-sm text-green-600 dark:text-green-400"
                  >
                    {{ plan.yearlyDiscount }}% off
                  </span>
                </div>
              </div>
              <div v-else class="space-y-2">
                <div class="flex items-baseline gap-1">
                  <span
                    class="text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    ${{ plan.monthlyPrice }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                  <span
                    v-if="plan.monthlyDiscount > 0"
                    class="text-sm text-green-600 dark:text-green-400"
                  >
                    {{ plan.monthlyDiscount }}% off
                  </span>
                </div>
              </div>

              <!-- Features for regular plans only -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 rounded-lg p-1.5">
                  <Icon
                    name="heroicons:users"
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ plan.maxMembers || "Unlimited" }}
                  </p>
                </div>
                <div class="flex items-center gap-2 rounded-lg p-1.5">
                  <Icon
                    name="heroicons:circle-stack"
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ formatStorage(plan.storage) }}
                  </p>
                </div>
                <div class="flex items-center gap-2 rounded-lg p-1.5">
                  <Icon
                    name="heroicons:computer-desktop"
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ plan.displayCount || "Unlimited" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add-ons Section -->
      <div v-if="activeTab === 'addon' && addonPlans.length > 0">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Add-on Plans
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="plan in addonPlans"
            :key="plan.id"
            class="group relative overflow-hidden rounded-xl border bg-gray-50 dark:bg-gray-800 border-gray-200 transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-900"
          >
            <!-- Status Badge -->
            <div class="absolute right-3 top-3 z-10 flex gap-2">
              <Badge
                v-if="plan.isSpecial"
                variant="secondary"
                class="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              >
                Special
              </Badge>
              <Badge v-if="plan.deleted" variant="destructive" class="text-xs">
                Deleted
              </Badge>
            </div>

            <!-- Card Header -->
            <div class="relative space-y-3 p-6 bg-white dark:bg-gray-800/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                    <Icon
                      name="heroicons:puzzle-piece"
                      class="h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {{ plan.name }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ plan.description }}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <Icon
                        name="heroicons:ellipsis-vertical"
                        class="h-4 w-4"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="editPlan(plan)">
                      <Icon name="heroicons:pencil" class="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="confirmDelete(plan)" class="text-red-600">
                      <Icon name="heroicons:trash" class="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <!-- Card Content -->
            <div class="space-y-6 rounded-b-xl p-6">
              <!-- Pricing -->
              <div v-if="isYearlyBilling" class="space-y-2">
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${{ plan.yearlyPrice }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">/year</span>
                  <span
                    v-if="plan.yearlyDiscount > 0"
                    class="text-sm text-green-600 dark:text-green-400"
                  >
                    {{ plan.yearlyDiscount }}% off
                  </span>
                </div>
              </div>
              <div v-else class="space-y-2">
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${{ plan.monthlyPrice }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">/month</span>
                  <span
                    v-if="plan.monthlyDiscount > 0"
                    class="text-sm text-green-600 dark:text-green-400"
                  >
                    {{ plan.monthlyDiscount }}% off
                  </span>
                </div>
              </div>

              <!-- Features for regular plans only -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 rounded-lg p-1.5">
                  <Icon
                    name="heroicons:users"
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ plan.maxMembers || 0 }}
                  </p>
                </div>
                <div class="flex items-center gap-2 rounded-lg p-1.5">
                  <Icon
                    name="heroicons:circle-stack"
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ formatStorage(plan.storage) }}
                  </p>
                </div>
                <div class="flex items-center gap-2 rounded-lg p-1.5">
                  <Icon
                    name="heroicons:computer-desktop"
                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  />
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ plan.displayCount || 0 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                <TableHead class="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="plan in regularPlans" :key="plan.id">
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
                  plan.maxMembers || "∞"
                }}</TableCell>
                <TableCell class="text-center">{{
                  formatStorage(plan.storage)
                }}</TableCell>
                <TableCell class="text-center">{{
                  plan.displayCount || "∞"
                }}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icon
                          name="heroicons:ellipsis-vertical"
                          class="h-5 w-5"
                        />
                        <span class="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="editPlan(plan)">
                        <Icon name="heroicons:pencil" class="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        @click="confirmDelete(plan)"
                        class="text-red-600"
                      >
                        <Icon name="heroicons:trash" class="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
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
                <TableHead class="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="plan in addonPlans" :key="plan.id">
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icon
                          name="heroicons:ellipsis-vertical"
                          class="h-5 w-5"
                        />
                        <span class="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="editPlan(plan)">
                        <Icon name="heroicons:pencil" class="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        @click="confirmDelete(plan)"
                        class="text-red-600"
                      >
                        <Icon name="heroicons:trash" class="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
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
              variant="outline"
              @click="showCreateDialog = false"
              :disabled="isSubmitting"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="isSubmitting || (isEditing && !hasChanges)"
            >
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

    <!-- Delete Confirmation Dialog -->
    <Dialog
      :open="showDeleteDialog"
      @update:open="(value: boolean) => handleDialogClose('delete', value)"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Plan</DialogTitle>
        </DialogHeader>
        <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this plan? This action cannot be
          undone.
        </DialogDescription>
        <div class="mt-4 flex justify-end gap-3">
          <Button variant="outline" @click="showDeleteDialog = false">
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
      @update:open="(value: boolean) => handleDialogClose('restore', value)"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Plan</DialogTitle>
        </DialogHeader>
        <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to restore this plan? It will become active
          again.
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
            {{ isSubmitting ? "Restoring..." : "Restore" }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
} = usePlans();

// State
const searchQuery = ref("");
const showDeletedPlans = ref(false);
const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const showRestoreDialog = ref(false);
const selectedPlan = ref<Plan | null>(null);
const activeTab = ref<"tenant" | "addon">("tenant");
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const isYearlyBilling = ref(false);

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
  if (!plan) return true;
  return Object.keys(formData).some((key) => {
    const formValue = formData[key as keyof typeof formData];
    const originalValue = plan[key as keyof Plan];
    return JSON.stringify(formValue) !== JSON.stringify(originalValue);
  });
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
  Object.assign(formData, plan);
  showCreateDialog.value = true;
};

const handleSubmit = async () => {
  formError.value = null;
  isSubmitting.value = true;

  try {
    if (selectedPlan.value) {
      await updatePlan(selectedPlan.value.id, formData);
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
  if (confirm("Are you sure you want to delete this plan?")) {
    try {
      await deletePlan(plan.id);
    } catch (err: any) {
      console.error("Failed to delete plan:", err);
    }
  }
};

const confirmRestore = async (plan: Plan) => {
  if (confirm("Are you sure you want to restore this plan?")) {
    try {
      await updatePlan(plan.id, { ...plan, deleted: false });
    } catch (err: any) {
      console.error("Failed to restore plan:", err);
    }
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

// Table headers
const tableHeaders = computed(() => {
  const baseHeaders = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "monthlyPrice", label: "Monthly Price" },
    { key: "yearlyPrice", label: "Yearly Price" },
  ];

  if (activeTab.value === "tenant") {
    return [
      ...baseHeaders,
      { key: "maxMembers", label: "Max Members" },
      { key: "storage", label: "Storage" },
      { key: "displayCount", label: "Displays" },
    ];
  }

  return baseHeaders;
});

// Initial load
onMounted(async () => {
  await fetchPlans();
});

definePageMeta({
  middleware: ["auth"],
});

const handleDelete = async () => {
  if (selectedPlan.value) {
    try {
      isSubmitting.value = true;
      await deletePlan(selectedPlan.value.id);
      showDeleteDialog.value = false;
      selectedPlan.value = null;
    } catch (err: any) {
      formError.value = err.message || "Failed to delete plan";
    } finally {
      isSubmitting.value = false;
    }
  }
};

const handleRestore = async () => {
  if (selectedPlan.value) {
    try {
      isSubmitting.value = true;
      await updatePlan(selectedPlan.value.id, {
        ...selectedPlan.value,
        deleted: false,
      });
      showRestoreDialog.value = false;
      selectedPlan.value = null;
    } catch (err: any) {
      formError.value = err.message || "Failed to restore plan";
    } finally {
      isSubmitting.value = false;
    }
  }
};

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
</script>

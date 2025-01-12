<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <Button>
        <Icon name="ph:plus" class="mr-2 h-4 w-4" />
        Add Content
      </Button>
    </div>

    <!-- Stats grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Organizations</CardTitle>
          <Icon name="ph:buildings" class="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">124</div>
          <p class="text-xs text-gray-500">+4 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Users</CardTitle>
          <Icon name="ph:users" class="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">573</div>
          <p class="text-xs text-gray-500">+21 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Displays</CardTitle>
          <Icon name="ph:monitor" class="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">2,845</div>
          <p class="text-xs text-gray-500">+89 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Monthly Revenue</CardTitle>
          <Icon name="ph:currency-circle-dollar" class="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$48,574</div>
          <p class="text-xs text-gray-500">+12.5% from last month</p>
        </CardContent>
      </Card>
    </div>

    <!-- Storage overview -->
    <Card>
      <CardHeader>
        <CardTitle>Storage Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-8">
          <!-- Storage progress -->
          <div>
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <p class="text-sm font-medium">Available Storage</p>
                <p class="text-2xl font-bold">82GB / 128GB</p>
              </div>
              <div class="h-16 w-16">
                <div class="relative h-full w-full">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <p class="text-sm font-bold">65%</p>
                  </div>
                  <svg class="h-full w-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke-width="8"
                      stroke="currentColor"
                      fill="transparent"
                      class="text-gray-100 dark:text-gray-800"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke-width="8"
                      stroke="currentColor"
                      fill="transparent"
                      stroke-dasharray="175.9"
                      stroke-dashoffset="61.565"
                      class="text-blue-500"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Storage breakdown -->
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-red-100 p-2 dark:bg-red-900">
                <Icon name="ph:file-text" class="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p class="text-sm font-medium">Documents</p>
                <p class="text-2xl font-bold">12 GB</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Icon name="ph:image" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="text-sm font-medium">Images</p>
                <p class="text-2xl font-bold">20 GB</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                <Icon name="ph:video-camera" class="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p class="text-sm font-medium">Video, Audio</p>
                <p class="text-2xl font-bold">20 GB</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                <Icon name="ph:folder" class="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p class="text-sm font-medium">Others</p>
                <p class="text-2xl font-bold">38 GB</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Recent activity -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-8">
          <div class="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium">New organization added</p>
              <p class="text-sm text-gray-500">Tech Corp International was added by John Doe</p>
            </div>
            <p class="text-sm text-gray-500">2 hours ago</p>
          </div>
          <div class="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium">Display onboarded</p>
              <p class="text-sm text-gray-500">New display added to Mall Plaza location</p>
            </div>
            <p class="text-sm text-gray-500">5 hours ago</p>
          </div>
          <div class="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div class="flex-1 space-y-1">
              <p class="text-sm font-medium">Subscription upgraded</p>
              <p class="text-sm text-gray-500">Digital Signage Co. upgraded to Enterprise plan</p>
            </div>
            <p class="text-sm text-gray-500">1 day ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script> 
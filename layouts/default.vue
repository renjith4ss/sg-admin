<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold">Showground Admin</h1>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li v-for="item in sidebarItems" :key="item.route">
            <NuxtLink
              :to="item.route"
              class="flex items-center p-2 rounded-lg hover:bg-gray-100"
              active-class="bg-blue-50 text-blue-600"
            >
              <Icon :name="item.icon" class="w-5 h-5 mr-3" />
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto bg-gray-50">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const sidebarItems = [
  {
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    route: '/dashboard'
  },
  {
    label: 'Organizations',
    icon: 'i-heroicons-building-office',
    route: '/organizations'
  },
  {
    label: 'Users',
    icon: 'i-heroicons-users',
    route: '/users'
  },
  {
    label: 'Displays',
    icon: 'i-heroicons-tv',
    route: '/displays'
  },
  {
    label: 'Subscription Plans',
    icon: 'i-heroicons-credit-card',
    route: '/plans'
  }
]
</script> 
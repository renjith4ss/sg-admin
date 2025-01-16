<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-800">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
            <Icon name="ph:gear-fill" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span class="text-lg font-semibold text-gray-900 dark:text-white">Admin Portal</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 px-2 py-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            :class="[
              'group flex items-center rounded-lg px-3 py-2 text-sm font-medium',
              $route.path === item.to
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            ]"
          >
            <Icon
              :name="item.icon"
              :class="[
                'mr-3 h-5 w-5',
                $route.path === item.to
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
              ]"
            />
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Main content -->
    <div class="pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <!-- Search -->
        <div class="flex flex-1 items-center">
          <div class="w-96">
            <div class="relative">
              <Icon
                name="ph:magnifying-glass"
                class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <Input
                type="search"
                placeholder="Search..."
                class="pl-10"
              />
            </div>
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center gap-4">
          <!-- Theme toggle -->
          <ThemeToggle />

          <!-- User menu -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                class="relative h-8 w-8 rounded-full"
              >
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {{ userInitials }}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">{{ user?.name }}</p>
                  <p class="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {{ user?.email }}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <Icon name="ph:sign-out" class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <!-- Page content -->
      <main class="min-h-[calc(100vh-4rem)] p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const router = useRouter()
const { logout } = useAuth()

// Dummy user data - replace with real data later
const user = ref({
  name: 'Admin User',
  email: 'admin@example.com'
})

const userInitials = computed(() => {
  if (!user.value?.name) return 'AU'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

const navigationItems = [
  {
    name: 'Dashboard',
    to: '/',
    icon: 'ph:squares-four'
  },
  {
    name: 'Organizations',
    to: '/organizations',
    icon: 'ph:buildings'
  },
  {
    name: 'Users',
    to: '/users',
    icon: 'ph:users'
  },
  {
    name: 'Displays',
    to: '/displays',
    icon: 'ph:monitor'
  },
  {
    name: 'Plans',
    to: '/plans',
    icon: 'ph:currency-circle-dollar'
  },
  {
    name: 'Invoices',
    to: '/invoices',
    icon: 'ph:receipt'
  }
]

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script> 
<template>
  <div class="relative flex h-screen">
    <!-- Vertical Navigation -->
    <nav
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform dark:bg-gray-800"
      :class="{ '-translate-x-full': !isSidebarOpen }"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center border-b px-6">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Showground Admin</h1>
      </div>

      <!-- Navigation Items -->
      <div class="space-y-2 px-4 py-6">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.route"
          :to="item.route"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          :class="{ 'bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-500': route.path.startsWith(item.route) }"
        >
          <Icon :name="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col lg:pl-64">
      <!-- Top Header -->
      <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 sm:px-6">
        <!-- Mobile Menu Button -->
        <div ref="mobileMenuRef">
          <button
            @click="toggleSidebar"
            class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 lg:hidden"
          >
            <Icon v-if="isSidebarOpen" name="heroicons:x-mark" class="h-6 w-6" />
            <Icon v-else name="heroicons:bars-3" class="h-6 w-6" />
          </button>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <div ref="themeMenuRef">
            <button
              @click="isThemeMenuOpen = !isThemeMenuOpen"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Icon v-if="isDark" name="heroicons:sun" class="h-5 w-5" />
              <Icon v-else name="heroicons:moon" class="h-5 w-5" />
            </button>

            <!-- Theme Menu -->
            <div
              v-if="isThemeMenuOpen"
              class="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg dark:bg-gray-800"
            >
              <button
                @click="setTheme('light')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Light Mode
              </button>
              <button
                @click="setTheme('dark')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Dark Mode
              </button>
              <button
                @click="setTheme('system')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                System
              </button>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <span>Admin</span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg dark:bg-gray-800"
            >
              <button
                @click="handleLogout"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const route = useRoute()
const { logout } = useAuth()
const router = useRouter()

const isSidebarOpen = ref(true)
const isUserMenuOpen = ref(false)
const isDark = computed(() => useColorMode().value === 'dark')

const navigationItems = [
  {
    label: 'Dashboard',
    icon: 'heroicons:home',
    route: '/'
  },
  {
    label: 'Organizations',
    icon: 'heroicons:building-office',
    route: '/organizations'
  },
  {
    label: 'Users',
    icon: 'heroicons:users',
    route: '/users'
  },
  {
    label: 'Displays',
    icon: 'heroicons:tv',
    route: '/displays'
  },
  {
    label: 'Plans',
    icon: 'heroicons:credit-card',
    route: '/plans'
  }
]

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function toggleTheme() {
  const colorMode = useColorMode()
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

async function handleLogout() {
  await logout()
  router.push('/login')
}

const userMenuRef = ref(null)
const mobileMenuRef = ref(null)
const themeMenuRef = ref(null)
const isThemeMenuOpen = ref(false)

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
})

// Close mobile menu when clicking outside on mobile
onClickOutside(mobileMenuRef, () => {
  if (window.innerWidth < 1024) { // lg breakpoint
    isSidebarOpen.value = false
  }
})

// Close theme menu when clicking outside
onClickOutside(themeMenuRef, () => {
  isThemeMenuOpen.value = false
})

function setTheme(theme: 'light' | 'dark' | 'system') {
  const colorMode = useColorMode()
  colorMode.preference = theme
  isThemeMenuOpen.value = false
}
</script> 
<template>
  <div class="relative flex min-h-screen items-center justify-center bg-gray-50 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-8 rounded-xl bg-white px-8 py-12 shadow-2xl dark:bg-gray-800 sm:px-10">
      <div>
        <!-- Logo can be added here -->
        <h1 class="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in</h1>
        <p class="mt-2 text-center text-sm text-gray-400 dark:text-gray-500">
          Enter your credentials to access the admin panel
        </p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Email</label>
            <div class="relative">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div v-if="error" class="rounded-lg bg-red-50 p-4 dark:bg-red-900/50">
          <p class="text-sm text-red-600 dark:text-red-200">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="relative w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-70 dark:shadow-amber-500/30"
        >
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'landing'
})

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  error.value = null
  isLoading.value = true

  try {
    const result = await authStore.login({
      email: email.value,
      password: password.value
    })
    console.log(result)
    if (result) {
      router.push('/')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    isLoading.value = false
  }
}
</script> 
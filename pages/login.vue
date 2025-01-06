<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your credentials to access the admin panel
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
          <p class="text-sm text-red-700 dark:text-red-200">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 dark:ring-offset-gray-800"
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
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    isLoading.value = false
  }
}
</script> 
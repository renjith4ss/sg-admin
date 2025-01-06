<template>
  <div class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-8 w-8 mr-2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        SG Admin
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;This admin dashboard has transformed how we manage our platform, making every task more efficient and intuitive.&rdquo;
          </p>
          <footer class="text-sm">Sofia Davis</footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Admin Login
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <div class="grid gap-6">
          <form @submit.prevent="handleLogin">
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  v-model="email"
                  placeholder="name@example.com"
                  type="email"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  autocomplete="current-password"
                  required
                />
              </div>
              <div v-if="error" class="text-sm text-red-500 dark:text-red-400">
                {{ error }}
              </div>
              <Button type="submit" :disabled="isLoading">
                <template v-if="isLoading">
                  <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </template>
                <template v-else>
                  Sign In
                </template>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-vue-next'

const route = useRoute()
const { login, isLoading, error } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    const redirect = route.query.redirect?.toString() || '/dashboard'
    navigateTo(redirect)
  } catch (error) {
    // Error is handled in the store
  }
}

// Redirect to dashboard if already authenticated
const { isAuthenticated } = useAuth()
if (isAuthenticated.value) {
  navigateTo('/dashboard')
}
</script> 
<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-950 relative">
    <!-- Theme Toggle Button -->
    <div class="absolute top-4 right-4">
      <ThemeToggle buttonClass="rounded-full" />
    </div>

    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-blue-500 dark:bg-blue-600 rounded-2xl overflow-hidden flex max-w-4xl w-full shadow-xl">
        <!-- Left side with quote -->
        <div class="w-1/2 p-12 text-white flex flex-col">
          <div class="flex items-center gap-2 mb-8">
            <div class="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span class="text-2xl">⚙️</span>
            </div>
            <span class="text-2xl font-bold">Admin Portal</span>
          </div>
          <div class="flex-1 flex items-center">
            <div class="space-y-4">
              <h2 class="text-3xl font-bold">Welcome Back!</h2>
              <p class="text-blue-100 dark:text-blue-200">Sign in to access your admin dashboard and manage your resources.</p>
            </div>
          </div>
        </div>

        <!-- Right side with login form -->
        <div class="bg-white dark:bg-gray-900 w-1/2 p-12">
          <div class="flex items-center justify-between mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Sign in</h2>
            <Button
              variant="ghost"
              @click="toggleLoginMethod"
              class="text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950"
            >
              {{ loginMethod === 'password' ? 'Login with OTP' : 'Login with Password' }}
            </Button>
          </div>

          <Form :validation-schema="formSchema" @submit="handleSubmit" class="space-y-6">
            <div v-if="!otpData.showOTP" class="space-y-6">
              <FormField v-slot="{ field, errors }" name="email">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="field"
                      type="email"
                      required
                      :disabled="isLoading"
                      placeholder="admin@example.com"
                      class="dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage v-if="errors" class="text-sm text-red-500">
                    {{ errors }}
                  </FormMessage>
                </FormItem>
              </FormField>

              <div v-if="loginMethod === 'password'" class="space-y-2">
                <FormField v-slot="{ field, errors }" name="password">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        v-bind="field"
                        type="password"
                        required
                        :disabled="isLoading"
                        placeholder="Enter your password"
                        class="dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage v-if="errors" class="text-sm text-red-500">
                      {{ errors }}
                    </FormMessage>
                  </FormItem>
                </FormField>

                <div class="flex items-center justify-end">
                  <Button
                    variant="link"
                    class="text-sm text-blue-500 hover:text-blue-600 p-0 h-auto dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>
            </div>

            <div v-else class="space-y-6">
              <FormField v-slot="{ field, errors }" name="otp">
                <FormItem>
                  <FormLabel class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Verification Code
                    <span v-if="otpData.expiresIn > 0" class="float-right text-gray-500 dark:text-gray-400">
                      Expires in {{ formatTime(otpData.expiresIn) }}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="field"
                      type="text"
                      required
                      :disabled="isLoading"
                      placeholder="Enter verification code"
                      class="dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage v-if="errors" class="text-sm text-red-500">
                    {{ errors }}
                  </FormMessage>
                </FormItem>
              </FormField>

              <Button
                v-if="otpData.expiresIn <= 0"
                variant="link"
                type="button"
                @click="handleRequestOTP"
                :disabled="isLoading"
                class="text-sm text-blue-500 hover:text-blue-600 p-0 h-auto dark:text-blue-400 dark:hover:text-blue-300"
              >
                Resend Code
              </Button>
            </div>

            <Alert
              v-if="error"
              :variant="error.includes('verification code') || error.includes('been sent') ? 'default' : 'destructive'"
              class="mb-6 dark:border-gray-800"
            >
              {{ error }}
            </Alert>

            <Button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              size="lg"
            >
              {{ submitButtonText }}
            </Button>
          </Form>
        </div>
      </div>

    </div>
    <p class="absolute bottom-4 w-full text-center text-gray-500 dark:text-gray-400">
      © {{ new Date().getFullYear() }} lumenex.io. All rights reserved.
    </p>
  </div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

definePageMeta({
  layout: 'landing',
  middleware: [
    function (to) {
      const { isAuthenticated } = useAuth()
      
      // If user is already authenticated, redirect to homepage
      if (isAuthenticated.value) {
        return navigateTo('/')
      }
    }
  ]
})

const formSchema = computed(() => {
  if (loginMethod.value === 'password') {
    return toTypedSchema(z.object({
      email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must not exceed 50 characters'),
    }))
  }
  return toTypedSchema(z.object({
    email: z.string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
  }))
})

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)
const loginMethod = ref<'password' | 'otp'>('password')
const otpData = ref({
  otpId: '',
  mfaId: '' as string | undefined,
  showOTP: false,
  code: '',
  expiresIn: 0
})

const authStore = useAuthStore()
const router = useRouter()
const colorMode = useColorMode()

// Timer for OTP expiration
watch(() => otpData.value.expiresIn, (newValue) => {
  if (newValue > 0) {
    setTimeout(() => {
      otpData.value.expiresIn--
    }, 1000)
  }
})

const submitButtonText = computed(() => {
  if (isLoading.value) return 'Please wait...'
  if (otpData.value.showOTP) return 'Verify Code'
  return loginMethod.value === 'password' ? 'Login with Password' : 'Send Verification Code'
})

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function toggleLoginMethod() {
  loginMethod.value = loginMethod.value === 'password' ? 'otp' : 'password'
  if (loginMethod.value === 'otp' && email.value) {
    handleRequestOTP()
  } else {
    otpData.value = {
      otpId: '',
      mfaId: '',
      showOTP: false,
      code: '',
      expiresIn: 0
    }
  }
  error.value = null
}

async function handleRequestOTP() {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  try {
    isLoading.value = true
    error.value = null
    const result = await authStore.requestOTP(email.value)
    otpData.value = {
      ...otpData.value,
      otpId: result.otpId,
      showOTP: true,
      expiresIn: 300
    }
    error.value = 'Verification code has been sent to your email.'
  } catch (err: any) {
    error.value = err.message || 'Failed to send code'
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit(values: any) {
  if (isLoading.value) return

  try {
    isLoading.value = true
    error.value = null

    if (otpData.value.showOTP) {
      // Handle OTP verification
      await authStore.verifyOTP({
        otpId: otpData.value.otpId,
        code: otpData.value.code,
        mfaId: otpData.value.mfaId
      })
      router.push('/')
      return
    }

    if (loginMethod.value === 'password') {
      const result = await authStore.login({
        email: values.email,
        password: values.password
      })

      // Check if MFA is required
      if (result?.needsMfa) {
        // Request OTP as second factor
        const otpResult = await authStore.requestOTP(values.email)
        otpData.value = {
          otpId: otpResult.otpId,
          mfaId: result.mfaId,
          showOTP: true,
          code: '',
          expiresIn: 300
        }
        error.value = 'Please check your email for the verification code.'
        return
      }
      router.push('/')
    } else {
      // For OTP login method
      await handleRequestOTP()
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to login'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script> 
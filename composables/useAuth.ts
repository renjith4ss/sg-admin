import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { usePocketBase } from '~/services/pocketbase'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { isAuthenticated, isLoading, error, token, isTokenExpired } = storeToRefs(authStore)
  const pb = usePocketBase()
  let refreshInterval: ReturnType<typeof setInterval> | null = null

  const startTokenRefresh = () => {
    // Clear existing interval if any
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }

    // Check token every minute
    refreshInterval = setInterval(async () => {
      if (isTokenExpired.value) {
        try {
          await authStore.refreshToken()
        } catch (err) {
          console.error('Token refresh failed:', err)
          await logout()
        }
      }
    }, 60 * 1000)
  }

  // Set up watchers and cleanup in a component's setup context
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('app:created', () => {
    if (isAuthenticated.value) {
      startTokenRefresh()
    }
    watch(isAuthenticated, (newValue) => {
      if (newValue) {
        startTokenRefresh()
      } else if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    })
  })

  nuxtApp.hook('app:beforeMount', () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })
  
  const login = async (email: string, password: string) => {
    return await authStore.login(email, password)
  }

  const logout = async () => {
    await authStore.logout()
    navigateTo('/login')
  }

  const requestPasswordReset = async (email: string) => {
    return await authStore.requestPasswordReset(email)
  }

  const confirmPasswordReset = async (token: string, password: string) => {
    return await authStore.confirmPasswordReset(token, password)
  }

  const currentUser = computed(() => pb?.currentUser)

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    currentUser,
    token,
    isTokenExpired,

    // Actions
    login,
    logout,
    requestPasswordReset,
    confirmPasswordReset
  }
} 
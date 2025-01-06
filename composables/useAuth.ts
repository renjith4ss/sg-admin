import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { usePocketBase } from '~/services/pocketbase'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { isAuthenticated, isLoading, error } = storeToRefs(authStore)
  const pb = usePocketBase()
  
  const login = async (email: string, password: string) => {
    return await authStore.login(email, password)
  }

  const logout = async () => {
    await authStore.logout()
    navigateTo('/login')
  }

  const currentUser = computed(() => pb?.currentUser)

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    currentUser,

    // Actions
    login,
    logout
  }
} 
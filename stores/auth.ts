import { defineStore } from 'pinia'
import { usePocketBase } from '~/services/pocketbase'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const pb = usePocketBase()
        const authData = await pb?.adminLogin(email, password)
        this.isAuthenticated = true
        return authData
      } catch (err: any) {
        this.error = err.message || 'Failed to login. Please check your credentials.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      const pb = usePocketBase()
      await pb?.logout()
      this.isAuthenticated = false
    }
  }
}) 
import { defineStore } from 'pinia'
import type { Api } from '~/types/api'
import type { AuthState, LoginCredentials, User } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoading: false,
    error: null,
    user: null,
    initialized: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => {
      const $api = useNuxtApp().$api as Api
      return $api.auth.isAuthenticated()
    },
    isInitialized: (state) => state.initialized
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<User | null> {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        const result = await $api.auth.login(credentials)
        if (result) {
          this.user = result
          // Fetch full user profile after login
          await this.refreshSession()
        }
        return this.user
      } catch (err: any) {
        console.error('login error:', err)
        this.error = err.message || 'Failed to login'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        await $api.auth.logout()
        this.user = null
      } catch (err: any) {
        this.error = err.message || 'Failed to logout'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async refreshSession(): Promise<User | null> {
      this.isLoading = true
      this.error = null
      
      try {
        const $api = useNuxtApp().$api as Api
        this.user = await $api.profile.getMe()
        return this.user
      } catch (err: any) {
        console.error('refresh session error:', err)
        this.error = err.message || 'Failed to refresh session'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
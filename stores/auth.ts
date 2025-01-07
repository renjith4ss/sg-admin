import { defineStore } from 'pinia'
import { authApi } from '~/services/api/auth'
import type { User, LoginCredentials, AuthState, PasswordResetConfirmation } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const user = await authApi.login(credentials)
        this.user = user
        return user
      } catch (err: any) {
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
        await authApi.logout()
        this.user = null
      } catch (err: any) {
        this.error = err.message || 'Failed to logout'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async getCurrentUser() {
      this.isLoading = true
      this.error = null
      
      try {
        const user = await authApi.getCurrentUser()
        this.user = user
        return user
      } catch (err: any) {
        this.error = err.message || 'Failed to get current user'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async refreshSession() {
      this.isLoading = true
      this.error = null
      
      try {
        const user = await authApi.refreshSession()
        this.user = user
        return user
      } catch (err: any) {
        this.error = err.message || 'Failed to refresh session'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(data: Partial<User>) {
      if (!this.user) throw new Error('No user logged in')
      
      this.isLoading = true
      this.error = null
      
      try {
        const user = await authApi.updateProfile(this.user.id, data)
        if (user) {
          this.user = user
        }
        return user
      } catch (err: any) {
        this.error = err.message || 'Failed to update profile'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async requestPasswordReset(email: string) {
      this.isLoading = true
      this.error = null
      
      try {
        await authApi.requestPasswordReset(email)
      } catch (err: any) {
        this.error = err.message || 'Failed to request password reset'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async confirmPasswordReset(params: PasswordResetConfirmation) {
      this.isLoading = true
      this.error = null
      
      try {
        await authApi.confirmPasswordReset(params)
      } catch (err: any) {
        this.error = err.message || 'Failed to confirm password reset'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  },

  persist: true
}) 
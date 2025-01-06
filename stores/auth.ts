import { defineStore } from 'pinia'
import { usePocketBase } from '~/services/pocketbase'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null
  tokenExpiry: number | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    tokenExpiry: null
  }),

  getters: {
    isTokenExpired(): boolean {
      if (!this.tokenExpiry) return true
      return Date.now() >= this.tokenExpiry
    }
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const pb = usePocketBase()
        const authData = await pb?.adminLogin(email, password)
        
        if (authData) {
          this.isAuthenticated = true
          this.token = authData.token
          this.tokenExpiry = Date.now() + (30 * 60 * 1000) // 30 minutes
          
          // Store the refresh token in a secure httpOnly cookie
          await $fetch('/api/auth/set-refresh-token', {
            method: 'POST',
            body: { refreshToken: authData.refreshToken }
          })
        }
        
        return authData
      } catch (err: any) {
        this.error = err.message || 'Failed to login. Please check your credentials.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const pb = usePocketBase()
        await pb?.logout()
        
        // Clear refresh token
        await $fetch('/api/auth/clear-refresh-token', { method: 'POST' })
        
        this.resetState()
      } catch (err: any) {
        console.error('Logout error:', err)
        // Still reset state even if there's an error
        this.resetState()
      }
    },

    resetState() {
      this.isAuthenticated = false
      this.token = null
      this.tokenExpiry = null
      this.error = null
    },

    async refreshToken() {
      try {
        const response = await $fetch<{ token: string }>('/api/auth/refresh', {
          method: 'POST',
          headers: {}
        })
        if (response.token) {
          this.token = response.token
          this.tokenExpiry = Date.now() + (30 * 60 * 1000)
          this.isAuthenticated = true
        }
      } catch (err) {
        this.resetState()
        throw err
      }
    },

    async requestPasswordReset(email: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const pb = usePocketBase()
        await pb?.resetPassword(email)
      } catch (err: any) {
        this.error = err.message || 'Failed to send password reset email.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async confirmPasswordReset(token: string, newPassword: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const pb = usePocketBase()
        await pb?.confirmPasswordReset(token, newPassword, newPassword)
      } catch (err: any) {
        this.error = err.message || 'Failed to reset password.'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
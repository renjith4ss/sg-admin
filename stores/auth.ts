import { defineStore } from 'pinia'
import type { RecordModel } from 'pocketbase'
import { authApi } from '~/services/api/auth'
import type { User, LoginCredentials, AuthState, PasswordResetConfirmation, OTPRequest, OTPResponse, MFAResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoading: false,
    error: null,
  }),

  getters: {
    user: () => authApi.getUser(),
    isAuthenticated: () => authApi.isAuthenticated(),
    isTokenExpired: () => authApi.isTokenExpired()
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<User | MFAResponse> {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authApi.login(credentials)
        if ('needsMfa' in result) {
          return result
        }
        return result
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
      } catch (err: any) {
        this.error = err.message || 'Failed to logout'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async refreshSession() {
      this.isLoading = true
      this.error = null
      
      try {
        await authApi.refreshSession()
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
    },

    async requestOTP(email: string): Promise<OTPResponse> {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await authApi.requestOTP(email)
        return result
      } catch (err: any) {
        this.error = err.message || 'Failed to request OTP'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async verifyOTP(params: OTPRequest): Promise<User | null> {
      this.isLoading = true
      this.error = null
      
      try {
        const user = await authApi.verifyOTP(params)
        return user
      } catch (err: any) {
        this.error = err.message || 'Failed to verify OTP'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
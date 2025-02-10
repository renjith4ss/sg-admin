import type { RecordModel } from 'pocketbase'
import type { LoginCredentials, MFAResponse, OTPRequest, OTPResponse, PasswordResetConfirmation, User } from '~/types/auth'
import { usePocketBaseService } from '../pocketbase'
import { profileApi } from './profile'

function mapRecordToUser(record: RecordModel): User {
  return {
    id: record.id,
    email: record.email,
    emailVisibility: record.emailVisibility,
    username: record.username,
    verified: record.verified,
    first_name: record.first_name,
    last_name: record.last_name,
    avatar: record.avatar,
    active: record.active,
    deleted: record.deleted,
    created: record.created,
    updated: record.updated,
    collectionId: record.collectionId,
    collectionName: record.collectionName,
    is_display: record.is_display,
    level: record.level,
    roles: record.roles,
    tenant: record.tenant,
    type: record.type,
    owner: record.owner,
    eroot: record.eroot,
    froot: record.froot,
    needsMfa: record.needsMfa,
    mfaId: record.mfaId,
    permissions: record.permissions
  }
}

export const authApi = {

  isAuthenticated(): boolean {
    const pb = usePocketBaseService()
    return !!(pb?.authStore.isValid && pb?.authStore.token && pb?.authStore.record)
  },

  isTokenExpired() {
    const pb = usePocketBaseService()
    return pb?.authStore.isValid
  },

  async login(credentials: LoginCredentials): Promise<User | MFAResponse> {
    const pb = usePocketBaseService()
    try {
      const authData = await pb.adminLogin(
        credentials.email,
        credentials.password
      )
      const user = mapRecordToUser(authData.record)
      
      // Check if MFA is required
      if (user.needsMfa && user.mfaId) {
        return {
          needsMfa: true,
          mfaId: user.mfaId
        }
      }
      
      return user
    } catch (error: any) {
      if (error.data?.needsMfa && error.data?.mfaId) {
        return {
          needsMfa: true,
          mfaId: error.data.mfaId
        }
      }
      throw error
    }
  },

  async logout() {
    const pb = usePocketBaseService()
    pb?.authStore.clear()
  },

  async getCurrentUser() {
    const pb = usePocketBaseService()
    const user = await profileApi.getMe() || pb?.authStore.record
    return user ? mapRecordToUser(user) : null
  },

  async refreshSession() {
    const pb = usePocketBaseService()
    await pb.refreshAuth()
    const user = await profileApi.getMe() || pb?.authStore.record
    return user ? mapRecordToUser(user) : null
  },

  async updateProfile(userId: string, data: Partial<User>) {
    const pb = usePocketBaseService()
    const record = await pb?.collection('users').update(userId, data)
    return record ? mapRecordToUser(record) : null
  },

  async requestPasswordReset(email: string) {
    const pb = usePocketBaseService()
    await pb?.collection('users').requestPasswordReset(email)
  },

  async confirmPasswordReset(params: PasswordResetConfirmation) {
    const pb = usePocketBaseService()
    await pb?.collection('users').confirmPasswordReset(
      params.token,
      params.password,
      params.passwordConfirm
    )
  },

  async requestOTP(email: string): Promise<OTPResponse> {
    const pb = usePocketBaseService()
    const result = await pb.collection('users').requestOTP(email)
    return {
      otpId: result.otpId,
      expiresIn: 300 // 5 minutes
    }
  },

  async verifyOTP(params: OTPRequest): Promise<User | null> {
    const pb = usePocketBaseService()
    const result = await pb.send('/api/users/verify-otp', {
      method: 'POST',
      body: params
    })
    return result?.record ? mapRecordToUser(result.record) : null
  }
} 
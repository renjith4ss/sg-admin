import type { RecordModel } from 'pocketbase'
import type { User, LoginCredentials, PasswordResetConfirmation } from '~/types/auth'
import { usePocketBase } from '../pocketbase'

function mapRecordToUser(record: RecordModel): User {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    avatar: record.avatar,
    created: record.created,
    updated: record.updated
  }
}

export const authApi = {
  async login(credentials: LoginCredentials) {
    const pb = usePocketBase()
    const authData = await pb?.collection('users').authWithPassword(
      credentials.email,
      credentials.password
    )
    return authData ? mapRecordToUser(authData.record) : null
  },

  async logout() {
    const pb = usePocketBase()
    pb?.authStore.clear()
  },

  async getCurrentUser() {
    const pb = usePocketBase()
    const authData = pb?.authStore.model
    return authData ? mapRecordToUser(authData) : null
  },

  async refreshSession() {
    const pb = usePocketBase()
    const authData = await pb?.collection('users').authRefresh()
    return authData ? mapRecordToUser(authData.record) : null
  },

  async updateProfile(userId: string, data: Partial<User>) {
    const pb = usePocketBase()
    const record = await pb?.collection('users').update(userId, data)
    return record ? mapRecordToUser(record) : null
  },

  async requestPasswordReset(email: string) {
    const pb = usePocketBase()
    await pb?.collection('users').requestPasswordReset(email)
  },

  async confirmPasswordReset(params: PasswordResetConfirmation) {
    const pb = usePocketBase()
    await pb?.collection('users').confirmPasswordReset(
      params.token,
      params.password,
      params.passwordConfirm
    )
  }
} 
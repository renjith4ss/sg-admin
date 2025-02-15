import type PocketBase from 'pocketbase'
import type { RecordModel } from 'pocketbase'
import type { LoginCredentials, User } from '~/types/auth'
import ApiClient from '../client'

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

export class AuthApi extends ApiClient {
  private static instance: AuthApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi(pb)
    }
    return AuthApi.instance
  }

  isAuthenticated(): boolean {
    return this.pb?.authStore.isValid && 
           !!this.pb?.authStore.token && 
           !!this.pb?.authStore.record
  }

  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const authData = await this.pb.collection('_superusers').authWithPassword(
        credentials.email,
        credentials.password
      )

      // Ensure token is saved in PocketBase's auth store
      if (authData?.token) {
        this.pb.authStore.save(authData.token, authData.record)
      }

      return authData.record ? mapRecordToUser(authData.record) : null
    } catch (error: any) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async logout() {
    try {
      this.pb.authStore.clear()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }
}

export const createAuthApi = (pb: PocketBase) => AuthApi.getInstance(pb) 
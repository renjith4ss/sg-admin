import PocketBase from 'pocketbase'
import type { RecordService, RecordModel } from 'pocketbase'

interface AuthResponse {
  token: string
  refreshToken: string
  record: RecordModel
}

export class PocketBaseService {
  private pb: PocketBase
  
  constructor(url: string) {
    this.pb = new PocketBase(url)
  }

  get currentUser() {
    return this.pb.authStore.model
  }

  get authStore() {
    return this.pb.authStore
  }

  collection(name: string): RecordService {
    return this.pb.collection(name)
  }

  async adminLogin(email: string, password: string): Promise<AuthResponse> {
    return await this.pb.admins.authWithPassword(email, password) as AuthResponse
  }

  async refreshAuth() {
    return await this.pb.collection('admins').authRefresh()
  }

  async resetPassword(email: string) {
    return await this.pb.collection('admins').requestPasswordReset(email, {
      emailTemplate: 'password-reset'
    })
  }

  async confirmPasswordReset(token: string, password: string, passwordConfirm: string) {
    return await this.pb.collection('admins').confirmPasswordReset(
      token,
      password,
      passwordConfirm
    )
  }

  logout() {
    this.pb.authStore.clear()
  }
}

let pbInstance: PocketBaseService | null = null

export const usePocketBase = () => {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    pbInstance = new PocketBaseService(config.public.pocketbaseUrl)
  }
  return pbInstance
} 
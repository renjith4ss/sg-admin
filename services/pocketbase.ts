import PocketBase from 'pocketbase'
import type { RecordService, RecordModel, SendOptions } from 'pocketbase'

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
    return this.pb.authStore.record
  }

  get authStore() {
    return this.pb.authStore
  }

  collection(name: string): RecordService {
    return this.pb.collection(name)
  }

  async adminLogin(email: string, password: string): Promise<AuthResponse> {
    return await this.pb.collection('_superusers').authWithPassword(email, password) as AuthResponse
  }

  async refreshAuth() {
    return await this.pb.collection('_superusers').authRefresh()
  }

  async resetPassword(email: string) {
    return await this.pb.collection('_superusers').requestPasswordReset(email, {
      emailTemplate: 'password-reset'
    })
  }

  async confirmPasswordReset(token: string, password: string) {
    return await this.pb.collection('_superusers').confirmPasswordReset(
      token,
      password,
      password
    )
  }

  logout() {
    this.pb.authStore.clear()
  }

  async send(endpoint: string, options: SendOptions) {
    return await this.pb.send(endpoint, options)
  }
}

let pbInstance: PocketBaseService | null = null

export const usePocketBaseService = () => {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    pbInstance = new PocketBaseService(config.public.pocketbaseUrl)
  }
  return pbInstance
} 
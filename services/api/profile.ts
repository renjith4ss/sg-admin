import type { User } from '~/types/auth'
import ApiClient from '../client'

class ProfileApi extends ApiClient {
  private readonly resource = 'profile'

  async getMe(): Promise<User> {
    return this.get(`/me`)
  }
}

export const profileApi = new ProfileApi() 
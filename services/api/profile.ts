import type PocketBase from 'pocketbase'
import type { User } from '~/types/auth'
import ApiClient from '../client'

export class ProfileApi extends ApiClient {
  private static instance: ProfileApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): ProfileApi {
    if (!ProfileApi.instance) {
      ProfileApi.instance = new ProfileApi(pb)
    }
    return ProfileApi.instance
  }

  async getMe(): Promise<User> {
    return this.get(`me`)
  }
}

export const createProfileApi = (pb: PocketBase) => ProfileApi.getInstance(pb) 
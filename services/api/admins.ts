import type PocketBase from 'pocketbase'
import type { AdminUser } from '~/types/admins'
import ApiClient from '../client'
export class AdminsApi extends ApiClient {
  private readonly resource = 'admins'

  private static instance: AdminsApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): AdminsApi {
    if (!AdminsApi.instance) {
      AdminsApi.instance = new AdminsApi(pb)
    }
    return AdminsApi.instance
  }

  async getAll(): Promise<AdminUser[]> {
    return this.get(`${this.resource}`)
  }

  async create(adminData: Omit<AdminUser, 'id' >): Promise<AdminUser | null> {
    return this.post(`${this.resource}`, adminData)
  }

  async update(id: string, adminData: Partial<Omit<AdminUser, 'id'>>): Promise<AdminUser | null> {
    return this.patch(`${this.resource}/${id}`, adminData)
  }

  async deleteOne(id: string): Promise<AdminUser | null> {
    return this.delete(`${this.resource}/${id}`)
  }
}

export const createAdminsApi = (pb: PocketBase) => AdminsApi.getInstance(pb) 
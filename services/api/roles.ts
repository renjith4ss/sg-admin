import type PocketBase from 'pocketbase'
import type { Role } from '~/types/roles'
import ApiClient from '../client'
export class RolesApi extends ApiClient {
  private readonly resource = 'roles'

  private static instance: RolesApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): RolesApi {
    if (!RolesApi.instance) {
      RolesApi.instance = new RolesApi(pb)
    }
    return RolesApi.instance
  }

  async getAll(): Promise<Role[]> {
    return this.get(`${this.resource}`)
  }

  async create(roleData: Omit<Role, 'id' | 'created' | 'updated'>): Promise<Role | null> {
    return this.post(`${this.resource}`, roleData)
  }

  async update(id: string, roleData: Partial<Omit<Role, 'id' | 'created' | 'updated'>>): Promise<Role | null> {
    return this.patch(`${this.resource}/${id}`, roleData)
  }

  async deleteOne(id: string): Promise<Role | null> {
    return this.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Role | null> {
    return this.get(`${this.resource}/${id}`)
  } 
}

export const createRolesApi = (pb: PocketBase) => RolesApi.getInstance(pb) 
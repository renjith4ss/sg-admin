import type { Role } from '~/types/roles'
import ApiClient from '../client'

class RolesApi extends ApiClient {
  private readonly resource = 'roles'

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
    return super.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Role | null> {
    return this.get(`${this.resource}/${id}`)
  } 
}

export const rolesApi = new RolesApi() 
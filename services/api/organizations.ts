import type { Organization } from '~/types/organization'
import ApiClient from '../client'

class OrganizationsApi extends ApiClient {
  private readonly resource = 'organizations'

  async getAll(): Promise<Organization[]> {
    return this.get(`${this.resource}`)
  }

  async create(organizationData: Omit<Organization, 'id' | 'created' | 'updated'>): Promise<Organization | null> {
    return this.post(`${this.resource}`, organizationData)
  }

  async update(id: string, organizationData: Partial<Omit<Organization, 'id' | 'created' | 'updated'>>): Promise<Organization | null> {
    return this.patch(`${this.resource}/${id}`, organizationData)
  }

  async deleteOne(id: string): Promise<Organization | null> {
    return super.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Organization | null> {
    return this.get(`${this.resource}/${id}`)
  }

  async restore(id: string): Promise<Organization | null> {
    return this.patch(`${this.resource}/${id}/restore`)
  }
}

export const organizationsApi = new OrganizationsApi() 
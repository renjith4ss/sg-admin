import type { Tenant, PaginatedResponse, TenantQueryParams } from '~/types/tenants'
import ApiClient from '../client'

class TenantsApi extends ApiClient {
  private readonly resource = 'tenants'

  async getAll(params: TenantQueryParams = {}): Promise<PaginatedResponse<Tenant>> {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.perPage) queryParams.append('perPage', params.perPage.toString())
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.filter) queryParams.append('filter', params.filter)

    const query = queryParams.toString()
    return this.get(`${this.resource}${query ? `?${query}` : ''}`)
  }

  async create(tenantData: Omit<Tenant, 'id' | 'created' | 'updated'>): Promise<Tenant | null> {
    return this.post(`${this.resource}`, tenantData)
  }

  async update(id: string, tenantData: Partial<Omit<Tenant, 'id' | 'created' | 'updated'>>): Promise<Tenant | null> {
    return this.patch(`${this.resource}/${id}`, tenantData)
  }

  async deleteOne(id: string): Promise<Tenant | null> {
    return super.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Tenant | null> {
    return this.get(`${this.resource}/${id}`)
  }
}

export const tenantsApi = new TenantsApi() 
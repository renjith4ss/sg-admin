import type PocketBase from 'pocketbase'
import type { PaginatedResponse, Tenant, TenantQueryParams } from '~/types/tenants'
import ApiClient from '../client'

export class TenantsApi extends ApiClient {
  private readonly resource = 'tenants'
  private static instance: TenantsApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): TenantsApi {
    if (!TenantsApi.instance) {
      TenantsApi.instance = new TenantsApi(pb)
    }
    return TenantsApi.instance
  }

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
    return this.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Tenant | null> {
    return this.get(`${this.resource}/${id}`)
  }
}

export const createTenantsApi = (pb: PocketBase) => TenantsApi.getInstance(pb) 
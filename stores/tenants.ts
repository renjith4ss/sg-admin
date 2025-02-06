import { defineStore } from 'pinia'
import { tenantsApi } from '~/services/api/tenants'
import type { Tenant, TenantsState, TenantQueryParams } from '~/types/tenants'

export const useTenantsStore = defineStore('tenants', {
  state: (): TenantsState => ({
    tenants: [],
    currentTenant: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 10,
      total: 0,
      totalPages: 0
    }
  }),

  getters: {
    getTenantById(state: TenantsState) {
      return (id: string): Tenant | undefined => state.tenants.find((t: Tenant) => t.id === id)
    }
  },

  actions: {
    async fetchTenants(params: TenantQueryParams = {}) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await tenantsApi.getAll({
          page: params.page || this.pagination.page,
          perPage: params.perPage || this.pagination.perPage,
          sort: params.sort,
          filter: params.filter
        })

        this.tenants = response.items
        this.pagination = {
          page: response.page,
          perPage: response.perPage,
          total: response.total,
          totalPages: response.totalPages
        }
        
        return response
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch tenants'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createTenant(tenantData: Omit<Tenant, 'id' | 'created' | 'updated'>) {
      this.isLoading = true
      this.error = null
      
      try {
        const tenant = await tenantsApi.create(tenantData)
        if (tenant) {
          this.tenants.push(tenant)
        }
        return tenant
      } catch (err: any) {
        this.error = err.message || 'Failed to create tenant'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateTenant(id: string, tenantData: Partial<Omit<Tenant, 'id' | 'created' | 'updated'>>) {
      this.isLoading = true
      this.error = null
      
      try {
        const tenant = await tenantsApi.update(id, tenantData)
        if (tenant) {
          const index = this.tenants.findIndex((t: Tenant) => t.id === id)
          if (index !== -1) {
            this.tenants[index] = tenant
          }
        }
        return tenant
      } catch (err: any) {
        this.error = err.message || 'Failed to update tenant'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteTenant(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const tenant = await tenantsApi.deleteOne(id)
        if (tenant) {
          const index = this.tenants.findIndex((t: Tenant) => t.id === id)
          if (index !== -1) {
            this.tenants[index] = tenant
          }
        }
        return tenant
      } catch (err: any) {
        this.error = err.message || 'Failed to delete tenant'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchTenant(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const tenant = await tenantsApi.getOne(id)
        if (tenant) {
          this.currentTenant = tenant
          const index = this.tenants.findIndex((t: Tenant) => t.id === id)
          if (index !== -1) {
            this.tenants[index] = tenant
          } else {
            this.tenants.push(tenant)
          }
        }
        return tenant
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch tenant'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
import { defineStore } from 'pinia'
import { organizationsApi } from '~/services/api/organizations'
import type { Organization, OrganizationsState } from '~/types/organization'

export const useOrganizationsStore = defineStore('organizations', {
  state: (): OrganizationsState => ({
    organizations: [],
    currentOrganization: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0
    },
    searchQuery: '',
    filters: {
      status: [],
      plan: []
    },
    sortBy: {
      field: 'created',
      direction: 'desc'
    }
  }),

  getters: {
    getActiveOrganizations(state: OrganizationsState): Organization[] {
      return state.organizations.filter((o: Organization) => o.status === 'active')
    },
    getInactiveOrganizations(state: OrganizationsState): Organization[] {
      return state.organizations.filter((o: Organization) => o.status === 'inactive')
    },
    getOrganizationById(state: OrganizationsState) {
      return (id: string): Organization | undefined => state.organizations.find((o: Organization) => o.id === id)
    }
  },

  actions: {
    async fetchOrganizations() {
      this.isLoading = true
      this.error = null
      
      try {
        const organizations = await organizationsApi.getAll()
        this.organizations = organizations
        return organizations
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch organizations'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createOrganization(organizationData: Omit<Organization, 'id' | 'created' | 'updated'>) {
      this.isLoading = true
      this.error = null
      
      try {
        const organization = await organizationsApi.create(organizationData)
        if (organization) {
          this.organizations.push(organization)
        }
        return organization
      } catch (err: any) {
        this.error = err.message || 'Failed to create organization'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateOrganization(id: string, organizationData: Partial<Omit<Organization, 'id' | 'created' | 'updated'>>) {
      this.isLoading = true
      this.error = null
      
      try {
        const organization = await organizationsApi.update(id, organizationData)
        if (organization) {
          const index = this.organizations.findIndex((o: Organization) => o.id === id)
          if (index !== -1) {
            this.organizations[index] = organization
          }
        }
        return organization
      } catch (err: any) {
        this.error = err.message || 'Failed to update organization'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteOrganization(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const organization = await organizationsApi.deleteOne(id)
        if (organization) {
          const index = this.organizations.findIndex((o: Organization) => o.id === id)
          if (index !== -1) {
            this.organizations[index] = organization
          }
        }
        return organization
      } catch (err: any) {
        this.error = err.message || 'Failed to delete organization'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrganization(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const organization = await organizationsApi.getOne(id)
        if (organization) {
          this.currentOrganization = organization
          const index = this.organizations.findIndex((o: Organization) => o.id === id)
          if (index !== -1) {
            this.organizations[index] = organization
          } else {
            this.organizations.push(organization)
          }
        }
        return organization
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch organization'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restoreOrganization(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const organization = await organizationsApi.restore(id)
        if (organization) {
          const index = this.organizations.findIndex((o: Organization) => o.id === id)
          if (index !== -1) {
            this.organizations[index] = organization
          }
        }
        return organization
      } catch (err: any) {
        this.error = err.message || 'Failed to restore organization'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
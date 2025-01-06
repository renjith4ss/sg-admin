import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { useRootStore } from './root'
import type { Organization } from '~/utils/validation'
import type { RecordModel } from 'pocketbase'

type OrganizationRecord = Organization & RecordModel

interface OrganizationState {
  organizations: Record<string, OrganizationRecord>
  members: Record<string, any>[]
  currentOrgSubscriptionId: string | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
  }
  searchQuery: string
  filters: {
    status: ('active' | 'suspended' | 'cancelled')[]
    plan: ('free' | 'basic' | 'pro')[]
  }
  sortBy: {
    field: keyof OrganizationRecord
    direction: 'asc' | 'desc'
  }
}

export const useOrganizationStore = defineStore('organization', {
  state: (): OrganizationState => ({
    organizations: {},
    members: [],
    currentOrgSubscriptionId: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 20,
      totalPages: 0,
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
    currentOrganization(this: any, state: OrganizationState): OrganizationRecord | null {
      const rootStore = useRootStore()
      return rootStore.currentOrganizationId 
        ? state.organizations[rootStore.currentOrganizationId]
        : null
    },

    organizationList(state: OrganizationState): OrganizationRecord[] {
      let list = Object.values(state.organizations) as OrganizationRecord[]

      // Apply search
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        list = list.filter((org: OrganizationRecord) => 
          org.name.toLowerCase().includes(query) ||
          org.billingEmail.toLowerCase().includes(query)
        )
      }

      // Apply filters
      if (state.filters.status.length > 0) {
        list = list.filter((org: OrganizationRecord) => state.filters.status.includes(org.status))
      }
      if (state.filters.plan.length > 0) {
        list = list.filter((org: OrganizationRecord) => state.filters.plan.includes(org.subscriptionPlan))
      }

      // Apply sorting
      list.sort((a: OrganizationRecord, b: OrganizationRecord) => {
        const aVal = a[state.sortBy.field]
        const bVal = b[state.sortBy.field]
        const modifier = state.sortBy.direction === 'asc' ? 1 : -1
        if (aVal === bVal) return 0
        return aVal > bVal ? modifier : -modifier
      })

      return list
    },

    organizationCount(state: OrganizationState): number {
      return Object.keys(state.organizations).length
    },

    hasOrganizations(state: OrganizationState): boolean {
      return Object.keys(state.organizations).length > 0
    },

    paginatedOrganizations(this: any): OrganizationRecord[] {
      const list = this.organizationList
      const start = (this.pagination.page - 1) * this.pagination.perPage
      const end = start + this.pagination.perPage
      return list.slice(start, end)
    }
  },

  actions: {
    async fetchOrganizations(page?: number) {
      const api = useApi()
      const rootStore = useRootStore()
      this.isLoading = true
      this.error = null

      if (page) {
        this.pagination.page = page
      }

      try {
        // Build filter string
        const filters = []
        if (this.filters.status.length > 0) {
          filters.push(`status ~ "${this.filters.status.join('||')}"`)
        }
        if (this.filters.plan.length > 0) {
          filters.push(`subscriptionPlan ~ "${this.filters.plan.join('||')}"`)
        }
        if (this.searchQuery) {
          filters.push(`(name ~ "${this.searchQuery}" || billingEmail ~ "${this.searchQuery}")`)
        }

        const response = await api.list<OrganizationRecord>(
          'organizations',
          this.pagination.page,
          this.pagination.perPage,
          filters.join(' && ')
        )
        
        // Update pagination
        this.pagination.totalItems = response.totalItems
        this.pagination.totalPages = Math.ceil(response.totalItems / this.pagination.perPage)
        
        // Convert array to record object
        this.organizations = response.items.reduce((acc, org) => {
          acc[org.id] = org
          return acc
        }, {} as Record<string, OrganizationRecord>)

        // Set up real-time updates if not already set
        if (!this.currentOrgSubscriptionId) {
          this.currentOrgSubscriptionId = await api.subscribe<OrganizationRecord>(
            'organizations',
            {
              callback: (data, event) => {
                if (event === 'create' || event === 'update') {
                  this.organizations[data.record.id] = data.record
                } else if (event === 'delete') {
                  delete this.organizations[data.record.id]
                }
              }
            }
          )
        }

        rootStore.updateLastSync('organizations')
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
      this.pagination.page = 1 // Reset to first page
      const rootStore = useRootStore()
      rootStore.addSearchTerm(query)
    },

    setFilters(filters: Partial<OrganizationState['filters']>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1 // Reset to first page
    },

    setSorting(field: keyof OrganizationRecord, direction: 'asc' | 'desc') {
      this.sortBy = { field, direction }
    },

    setPerPage(perPage: number) {
      this.pagination.perPage = perPage
      this.pagination.page = 1 // Reset to first page
    },

    async createOrganization(data: Partial<Organization>) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        const organization = await api.create<OrganizationRecord>('organizations', data)
        this.organizations[organization.id] = organization
        return organization
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateOrganization(id: string, data: Partial<Organization>) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        const organization = await api.update<OrganizationRecord>('organizations', id, data)
        this.organizations[organization.id] = organization
        return organization
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteOrganization(id: string) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        await api.remove('organizations', id)
        delete this.organizations[id]

        // If this was the current organization, clear it
        const rootStore = useRootStore()
        if (rootStore.currentOrganizationId === id) {
          rootStore.setCurrentOrganization(null)
        }

        return true
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrganizationMembers(organizationId: string) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        const response = await api.list('users', 1, 100, `organizationMemberships.${organizationId}!=null`)
        this.members = response.items
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    cleanup() {
      const api = useApi()
      if (this.currentOrgSubscriptionId) {
        api.unsubscribe(this.currentOrgSubscriptionId)
        this.currentOrgSubscriptionId = null
      }
    }
  }
}) 
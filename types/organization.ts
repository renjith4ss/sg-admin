export type Organization = {
  id: string
  name: string
  description?: string
  owner: string
  status: 'active' | 'inactive'
  created: string
  updated: string
}

export type CreateOrganizationDTO = {
  name: string
  description?: string
  owner: string
  status: 'active' | 'inactive'
}

export type OrganizationsState ={
    organizations: Organization[]
    currentOrganization: Organization | null
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
      field: keyof Organization
      direction: 'asc' | 'desc'
    }
}

export type UpdateOrganizationDTO = Partial<CreateOrganizationDTO> 
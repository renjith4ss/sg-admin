import type { User } from "./user"

export type Tenant = {
  id: string
  name: string
  address: string
  owner: User
  logo: string
  email: string
  phone: string
  type: string
  deleted: boolean
  created: string
  updated: string
}

export type PaginatedResponse<T> = {
  items: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type TenantQueryParams = {
  page?: number
  perPage?: number
  sort?: string
  filter?: string
}

export type TenantsState = {
  tenants: Tenant[]
  currentTenant: Tenant | null
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
} 
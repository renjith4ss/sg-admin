import type { Permission } from "./permissions"

export type Role = {
  id: string
  name: string
  description: string
  permissions: Permission[]
  created: string
  updated: string
}

export type RolesState ={
  roles: Role[]
  currentRole: Role | null
  isLoading: boolean
  error: string | null
}
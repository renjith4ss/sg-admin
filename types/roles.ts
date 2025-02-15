import type { Permission } from "./permissions"

export type Role = {
  id: string
  name: string
  description: string
  permissions: Permission[]
  created: string
  updated: string
  protected: boolean
}

export type RoleFormState ={
  name: string
  description: string
  permissions: Permission[]
  protected: boolean
}


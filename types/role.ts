export type Role = {
  id: string
  name: string
  description: string
  permissions: string[]
  created: string
  updated: string
}

export type CreateRoleInput = {
  name: string
  description: string
  permissions: string[]
}

export type UpdateRoleInput = Partial<CreateRoleInput> 
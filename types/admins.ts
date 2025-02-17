import type { Role } from "./roles"

export type AdminUser = {
  id: string
  name: string
  email: string
  roles: Role[],
  photo?: string,
  active: boolean
}

export type AdminUserForm = Omit<AdminUser, 'id' | 'roles'> & {
  roles: string[]
}

export type AdminsState = {
  admins: AdminUser[],
  currentAdmin: AdminUser | null
}


import type { Permission } from "./permissions"

export interface Organization {
  id: string
  name: string
  subscriptionPlan: SubscriptionPlan
  customRoles: CustomRole[]
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  type: 'free' | 'basic' | 'pro'
  displaySlots: number
  additionalDisplays: number
  price: number
  additionalDisplayPrice: number
}

export interface CustomRole {
  id: string
  name: string
  permissions: Permission[]
}

export interface User {
  id: string
  email: string
  name: string
  organizationMemberships: OrganizationMembership[]
}

export interface OrganizationMembership {
  organizationId: string
  roleId: string
}

export interface Display {
  id: string
  name: string
  organizationId: string
  status: 'active' | 'inactive'
  content: any
} 
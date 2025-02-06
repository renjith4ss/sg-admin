import type { Tenant } from "~/types/tenants"

export const useTenant = () => {
  const getOwnerName = (tenant: Tenant) => {
    return tenant.owner?.name || tenant.owner?.email
  }

  const getTenantName = (tenant: Tenant) => {
    return tenant.name || `${getOwnerName(tenant)}'s Tenant`
  }

  return {
    getTenantName,
    getOwnerName
  }
}
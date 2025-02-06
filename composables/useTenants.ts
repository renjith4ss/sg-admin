import { useTenantsStore } from '~/stores/tenants'
import { storeToRefs } from 'pinia'

export const useTenants = () => {
  const tenantsStore = useTenantsStore()
  const { tenants, currentTenant, isLoading, error } = storeToRefs(tenantsStore)

  return {
    // State
    tenants,
    currentTenant,
    isLoading,
    error,

    // Getters
    getTenantById: tenantsStore.getTenantById,

    // Actions
    fetchTenants: tenantsStore.fetchTenants,
    createTenant: tenantsStore.createTenant,
    updateTenant: tenantsStore.updateTenant,
    deleteTenant: tenantsStore.deleteTenant,
    fetchTenant: tenantsStore.fetchTenant
  }
} 
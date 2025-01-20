import { useRolesStore } from '~/stores/roles'
import { storeToRefs } from 'pinia'

export const useRoles = () => {
  const rolesStore = useRolesStore()
  const { roles, currentRole, isLoading, error } = storeToRefs(rolesStore)

  return {
    // State
    roles,
    currentRole,
    isLoading,
    error,

    // Getters
    getRoleById: rolesStore.getRoleById,

    // Actions
    fetchRoles: rolesStore.fetchRoles,
    createRole: rolesStore.createRole,
    updateRole: rolesStore.updateRole,
    deleteRole: rolesStore.deleteRole,
    fetchRole: rolesStore.fetchRole
  }
} 
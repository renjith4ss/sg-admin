import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Api } from '~/types/api'
import type { Role } from '~/types/roles'

export const useRolesQuery = () => {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()

  // Fetch all roles
  const useRoles = () => useQuery({
    queryKey: ['roles'],
    queryFn: () => ($api as Api).roles.getAll()
  })

  // Fetch single role
  const useRole = (id: string) => useQuery({
    queryKey: ['roles', id],
    queryFn: () => ($api as Api).roles.getOne(id),
    enabled: !!id
  })

  // Create role mutation
  const useCreateRole = () => useMutation({
    mutationFn: (roleData: Omit<Role, 'id' | 'created' | 'updated'>) => 
      ($api as Api).roles.create(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  })

  // Update role mutation
  const useUpdateRole = () => useMutation({
    mutationFn: ({ id, data }: { 
      id: string, 
      data: Partial<Omit<Role, 'id' | 'created' | 'updated'>>
    }) => ($api as Api).roles.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] })
    }
  })

  // Delete role mutation
  const useDeleteRole = () => useMutation({
    mutationFn: (id: string) => ($api as Api).roles.deleteOne(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roles', id] })
    }
  })

  return {
    useRoles,
    useRole,
    useCreateRole,
    useUpdateRole,
    useDeleteRole
  }
} 
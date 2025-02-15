import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { AdminUser } from '~/types/admins'
import type { Api } from '~/types/api'

export const useAdminsQuery = () => {
  const { $api } = useNuxtApp()
  const queryClient = useQueryClient()
  const config = useRuntimeConfig()

  // Fetch all admins
  const useAdmins = () => useQuery<AdminUser[]>({
    queryKey: ['admins'],
    queryFn: () => ($api as Api).admins.getAll(),
    select: (data) => data.map((admin) => ({
      ...admin,
      photo: admin.photo ? new URL(`/api/${admin.photo}`, config.public.pocketbaseUrl).toString() : undefined
    }))
  })

  // Create admin mutation
  const useCreateAdmin = () => useMutation({
    mutationFn: (adminData: Omit<AdminUser, 'id'>) => 
      ($api as Api).admins.create(adminData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })

  // Update admin mutation
  const useUpdateAdmin = () => useMutation({
    mutationFn: ({ id, data }: { 
      id: string, 
      data: Partial<Omit<AdminUser, 'id'>>
    }) => ($api as Api).admins.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })

  // Delete admin mutation
  const useDeleteAdmin = () => useMutation({
    mutationFn: (id: string) => ($api as Api).admins.deleteOne(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
    }
  })

  return {
    useAdmins,
    useCreateAdmin,
    useUpdateAdmin,
    useDeleteAdmin
  }
} 
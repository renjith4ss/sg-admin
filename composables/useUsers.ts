import type { RecordModel } from 'pocketbase'
import type { User } from '~/utils/validation'

type UserRecord = User & RecordModel

export const useUsers = () => {
  const { pb, handleError } = useApi()
  const users = ref<UserRecord[]>([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const records = await pb.collection('users').getFullList<UserRecord>({
        sort: 'created',
        expand: 'organizationMemberships'
      })
      users.value = records
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  const inviteUser = async (email: string, organizationId: string, roleId: string) => {
    try {
      // Create user and send invitation email
      const record = await pb.collection('users').create<UserRecord>({
        email,
        role: 'user',
        status: 'active',
        organizationMemberships: [{
          organizationId,
          roleId
        }]
      })
      users.value.push(record)
      return record
    } catch (error) {
      handleError(error)
    }
  }

  const updateUserRoles = async (userId: string, organizationMemberships: UserRecord['organizationMemberships']) => {
    try {
      const record = await pb.collection('users').update<UserRecord>(userId, {
        organizationMemberships
      })
      const index = users.value.findIndex(user => user.id === userId)
      if (index !== -1) {
        users.value[index] = record
      }
      return record
    } catch (error) {
      handleError(error)
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    inviteUser,
    updateUserRoles
  }
} 
import type { RecordModel } from 'pocketbase'
import type { Organization } from '~/utils/validation'

type OrganizationRecord = Organization & RecordModel

export const useOrganizations = () => {
  const { pb, handleError } = useApi()
  const organizations = ref<OrganizationRecord[]>([])
  const loading = ref(false)

  const fetchOrganizations = async () => {
    loading.value = true
    try {
      const records = await pb.collection('organizations').getFullList<OrganizationRecord>({
        sort: 'created',
        expand: 'subscriptionPlan,customRoles'
      })
      organizations.value = records
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  const createOrganization = async (data: Partial<Organization>) => {
    try {
      const record = await pb.collection('organizations').create<OrganizationRecord>(data)
      organizations.value.push(record)
      return record
    } catch (error) {
      handleError(error)
    }
  }

  const updateOrganization = async (id: string, data: Partial<Organization>) => {
    try {
      const record = await pb.collection('organizations').update<OrganizationRecord>(id, data)
      const index = organizations.value.findIndex(org => org.id === id)
      if (index !== -1) {
        organizations.value[index] = record
      }
      return record
    } catch (error) {
      handleError(error)
    }
  }

  const deleteOrganization = async (id: string) => {
    try {
      await pb.collection('organizations').delete(id)
      organizations.value = organizations.value.filter(org => org.id !== id)
    } catch (error) {
      handleError(error)
    }
  }

  return {
    organizations,
    loading,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
  }
} 
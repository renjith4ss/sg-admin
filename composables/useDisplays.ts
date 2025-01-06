import type { RecordModel } from 'pocketbase'
import type { Display } from '~/utils/validation'

type DisplayRecord = Display & RecordModel

export const useDisplays = () => {
  const { pb, handleError } = useApi()
  const displays = ref<DisplayRecord[]>([])
  const loading = ref(false)

  const fetchDisplays = async (organizationId?: string) => {
    loading.value = true
    try {
      const filter = organizationId ? `organizationId = "${organizationId}"` : ''
      const records = await pb.collection('displays').getFullList<DisplayRecord>({
        sort: 'created',
        filter
      })
      displays.value = records
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  const createDisplay = async (data: Partial<Display>) => {
    try {
      const record = await pb.collection('displays').create<DisplayRecord>(data)
      displays.value.push(record)
      return record
    } catch (error) {
      handleError(error)
    }
  }

  const updateDisplay = async (id: string, data: Partial<Display>) => {
    try {
      const record = await pb.collection('displays').update<DisplayRecord>(id, data)
      const index = displays.value.findIndex(display => display.id === id)
      if (index !== -1) {
        displays.value[index] = record
      }
      return record
    } catch (error) {
      handleError(error)
    }
  }

  return {
    displays,
    loading,
    fetchDisplays,
    createDisplay,
    updateDisplay
  }
} 
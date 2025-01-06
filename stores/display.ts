import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { useRootStore } from './root'
import type { Display } from '~/utils/validation'
import type { RecordModel } from 'pocketbase'

type DisplayRecord = Display & RecordModel

interface DisplayState {
  displays: Record<string, DisplayRecord>
  displaySubscriptionId: string | null
  selectedDisplayId: string | null
  isLoading: boolean
  error: string | null
}

export const useDisplayStore = defineStore('display', {
  state: (): DisplayState => ({
    displays: {},
    displaySubscriptionId: null,
    selectedDisplayId: null,
    isLoading: false,
    error: null
  }),

  getters: {
    displayList: (state) => Object.values(state.displays),
    displayCount: (state) => Object.keys(state.displays).length,
    hasDisplays: (state) => Object.keys(state.displays).length > 0,
    selectedDisplay: (state) => state.selectedDisplayId ? state.displays[state.selectedDisplayId] : null,
    activeDisplays: (state) => Object.values(state.displays).filter((d: DisplayRecord) => d.status === 'active'),
    inactiveDisplays: (state) => Object.values(state.displays).filter((d: DisplayRecord) => d.status === 'inactive'),
    maintenanceDisplays: (state) => Object.values(state.displays).filter((d: DisplayRecord) => d.status === 'maintenance')
  },

  actions: {
    async fetchDisplays() {
      const api = useApi()
      const rootStore = useRootStore()
      if (!rootStore.currentOrganizationId) return

      this.isLoading = true
      this.error = null

      try {
        const response = await api.list<DisplayRecord>(
          'displays',
          1,
          100,
          `organization="${rootStore.currentOrganizationId}"`
        )
        
        // Convert array to record object
        this.displays = response.items.reduce((acc, display) => {
          acc[display.id] = display
          return acc
        }, {} as Record<string, DisplayRecord>)

        // Set up real-time updates
        if (!this.displaySubscriptionId) {
          this.displaySubscriptionId = await api.subscribe<DisplayRecord>(
            'displays',
            {
              callback: (data, event) => {
                if (event === 'create' || event === 'update') {
                  this.displays[data.record.id] = data.record
                } else if (event === 'delete') {
                  delete this.displays[data.record.id]
                }
              },
              filter: `organization="${rootStore.currentOrganizationId}"`
            }
          )
        }

        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createDisplay(data: Partial<Display>) {
      const api = useApi()
      const rootStore = useRootStore()
      if (!rootStore.currentOrganizationId) throw new Error('No organization selected')

      this.isLoading = true
      this.error = null

      try {
        const displayData = {
          ...data,
          organization: rootStore.currentOrganizationId
        }
        const display = await api.create<DisplayRecord>('displays', displayData)
        this.displays[display.id] = display
        return display
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateDisplay(id: string, data: Partial<Display>) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        const display = await api.update<DisplayRecord>('displays', id, data)
        this.displays[display.id] = display
        return display
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteDisplay(id: string) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        await api.remove('displays', id)
        delete this.displays[id]
        if (this.selectedDisplayId === id) {
          this.selectedDisplayId = null
        }
        return true
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setSelectedDisplay(id: string | null) {
      this.selectedDisplayId = id
    },

    cleanup() {
      const api = useApi()
      if (this.displaySubscriptionId) {
        api.unsubscribe(this.displaySubscriptionId)
        this.displaySubscriptionId = null
      }
      this.displays = {}
      this.selectedDisplayId = null
    }
  }
}) 
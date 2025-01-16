import { useToast } from '~/composables/useToast'
import { usePocketBaseService } from '~/services/pocketbase'
import type { RecordModel, RecordSubscription } from 'pocketbase'

export interface ApiError extends Error {
  status?: number
  data?: unknown
}

export type RecordEvent = 'create' | 'update' | 'delete'

export interface SubscriptionOptions<T extends RecordModel = RecordModel> {
  callback: (data: RecordSubscription<T>, event: RecordEvent) => void
  filter?: string
  events?: RecordEvent[]
}

export interface Subscription {
  unsubscribe: () => void
  collection: string
  id: string
}

export const useApi = () => {
  const pb = usePocketBaseService()
  const toast = useToast()
  const subscriptions = ref(new Map<string, Subscription>())

  const handleError = (error: any): ApiError => {
    console.error('API Error:', error)
    
    const apiError: ApiError = new Error(
      error.message || 'An unexpected error occurred'
    )
    
    if (error.status) {
      apiError.status = error.status
    }
    
    if (error.data) {
      apiError.data = error.data
    }

    // Show toast only for user-facing errors
    if (error.status !== 401) { // Don't show for auth errors
      toast.error({
        title: 'Error',
        description: apiError.message
      })
    }

    throw apiError
  }

  const subscribe = async <T extends RecordModel = RecordModel>(
    collection: string,
    options: SubscriptionOptions<T>
  ): Promise<string> => {
    try {
      const events = options.events?.join(',') || '*'
      const unsubscribe = await pb?.collection(collection).subscribe(events, (data: RecordSubscription<T>) => {
        if (options.filter) {
          // Apply filter if provided
          const filterFn = new Function('data', `return ${options.filter}`)
          if (!filterFn(data)) return
        }

        // Determine the event type
        const event: RecordEvent = data.action === 'create' 
          ? 'create' 
          : data.action === 'delete' 
            ? 'delete' 
            : 'update'

        options.callback(data, event)
      })

      // Generate unique subscription ID
      const subscriptionId = `${collection}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Store subscription for cleanup
      if (typeof unsubscribe === 'function') {
        subscriptions.value.set(subscriptionId, {
          unsubscribe,
          collection,
          id: subscriptionId
        })
      }

      return subscriptionId
    } catch (error) {
      handleError(error)
      return ''
    }
  }

  const unsubscribe = (subscriptionId: string) => {
    const subscription = subscriptions.value.get(subscriptionId)
    if (subscription) {
      try {
        subscription.unsubscribe()
        subscriptions.value.delete(subscriptionId)
        return true
      } catch (error) {
        console.error('Error unsubscribing:', error)
        return false
      }
    }
    return false
  }

  const unsubscribeFromCollection = (collection: string) => {
    for (const [id, subscription] of subscriptions.value.entries()) {
      if (subscription.collection === collection) {
        unsubscribe(id)
      }
    }
  }

  const unsubscribeAll = () => {
    for (const [id] of subscriptions.value.entries()) {
      unsubscribe(id)
    }
  }

  // Cleanup subscriptions on component unmount
  onUnmounted(() => {
    unsubscribeAll()
  })

  const validateResponse = <T>(response: T | null): T => {
    if (!response) {
      throw new Error('No response received')
    }
    return response
  }

  const get = async <T extends RecordModel = RecordModel>(collection: string, id: string): Promise<T> => {
    try {
      const response = await pb?.collection(collection).getOne<T>(id)
      return validateResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  const list = async <T extends RecordModel = RecordModel>(
    collection: string,
    page = 1,
    perPage = 20,
    filter = ''
  ) => {
    try {
      const response = await pb?.collection(collection).getList<T>(page, perPage, {
        filter
      })
      return validateResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  const create = async <T extends RecordModel = RecordModel>(collection: string, data: Partial<T>): Promise<T> => {
    try {
      const response = await pb?.collection(collection).create<T>(data)
      return validateResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  const update = async <T extends RecordModel = RecordModel>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T> => {
    try {
      const response = await pb?.collection(collection).update<T>(id, data)
      return validateResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }

  const remove = async (collection: string, id: string): Promise<boolean> => {
    try {
      await pb?.collection(collection).delete(id)
      return true
    } catch (error) {
      throw handleError(error)
    }
  }

  return {
    pb,
    handleError,
    subscribe,
    unsubscribe,
    unsubscribeFromCollection,
    unsubscribeAll,
    get,
    list,
    create,
    update,
    remove
  }
} 
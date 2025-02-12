import { navigateTo } from '#app'
import { usePocketbase } from '~/composables/usePocketbase'

class ApiClient {
  private BASE_ENDPOINT = '/admin/api/v1'

  private handleAuthError() {
    navigateTo('/login')
  }

  protected async get<T>(endpoint: string): Promise<T> {
    try {
      const { send } = usePocketbase()
      const response = await send(`${this.BASE_ENDPOINT}/${endpoint}`, {
        method: 'GET'
      })
      return response as T
    } catch (err: any) {
      if (err.status === 401) {
        this.handleAuthError()
      }
      throw new Error(err.message || `Failed to fetch ${endpoint}`)
    }
  }

  protected async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const { send } = usePocketbase()
      const response = await send(`${this.BASE_ENDPOINT}/${endpoint}`, {
        method: 'POST',
        body
      })
      return response as T
    } catch (err: any) {
      if (err.status === 401) {
        this.handleAuthError()
      }
      throw new Error(err.message || `Failed to create ${endpoint}`)
    }
  }

  protected async patch<T>(endpoint: string, body?: any): Promise<T> {
    try {
      const { send } = usePocketbase()
      const response = await send(`${this.BASE_ENDPOINT}/${endpoint}`, {
        method: 'PATCH',
        body
      })
      return response as T
    } catch (err: any) {
      if (err.status === 401) {
        this.handleAuthError()
      }
      throw new Error(err.message || `Failed to update ${endpoint}`)
    }
  }

  protected async put<T>(endpoint: string, body: any): Promise<T> {
    try {
      const { send } = usePocketbase()
      const response = await send(`${this.BASE_ENDPOINT}/${endpoint}`, {
        method: 'PUT',
        body
      })
      return response as T
    } catch (err: any) {
      if (err.status === 401) {
        this.handleAuthError()
      }
      throw new Error(err.message || `Failed to update ${endpoint}`)
    }
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    try {
      const { send } = usePocketbase()
      const response = await send(`${this.BASE_ENDPOINT}/${endpoint}`, {
        method: 'DELETE'
      })
      return response as T
    } catch (err: any) {
      if (err.status === 401) {
        this.handleAuthError()
      }
      throw new Error(err.message || `Failed to delete ${endpoint}`)
    }
  }
}

export default ApiClient 
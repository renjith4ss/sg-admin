import type { Display } from '~/types/displays'
import ApiClient from '../client'

class DisplaysApi extends ApiClient {
  async getAll(): Promise<Display[]> {
    return this.get('/displays')
  }

  async create(displayData: Omit<Display, 'id' | 'created' | 'updated'>): Promise<Display | null> {
    return this.post('/displays', displayData)
  }

  async update(id: string, displayData: Partial<Omit<Display, 'id' | 'created' | 'updated'>>): Promise<Display | null> {
    return this.patch(`/displays/${id}`, displayData)
  }

  override async delete(id: string): Promise<void> {
    return super.delete(`/displays/${id}`)
  }

  async getOne(id: string): Promise<Display | null> {
    return this.get(`/displays/${id}`)
  }
}

export const displaysApi = new DisplaysApi() 
import type PocketBase from 'pocketbase'
import type { Display } from '~/types/displays'
import ApiClient from '../client'

export class DisplaysApi extends ApiClient {
  private readonly resource = 'displays'
  private static instance: DisplaysApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): DisplaysApi {
    if (!DisplaysApi.instance) {
      DisplaysApi.instance = new DisplaysApi(pb)
    }
    return DisplaysApi.instance
  }

  async getAll(): Promise<Display[]> {
    return this.get(`${this.resource}`)
  }

  async create(displayData: Omit<Display, 'id' | 'created' | 'updated'>): Promise<Display | null> {
    return this.post(`${this.resource}`, displayData)
  }

  async update(id: string, displayData: Partial<Omit<Display, 'id' | 'created' | 'updated'>>): Promise<Display | null> {
    return this.patch(`${this.resource}/${id}`, displayData)
  }

  async deleteOne(id: string): Promise<Display | null> {
    return this.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Display | null> {
    return this.get(`${this.resource}/${id}`)
  }
}

export const createDisplaysApi = (pb: PocketBase) => DisplaysApi.getInstance(pb) 
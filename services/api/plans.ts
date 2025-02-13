import type PocketBase from 'pocketbase'
import type { Plan } from '~/types/plans'
import ApiClient from '../client'
export class PlansApi extends ApiClient {
  private readonly resource = 'plans'
  private static instance: PlansApi | null = null

  private constructor(pb: PocketBase) {
    super(pb)
  }

  public static getInstance(pb: PocketBase): PlansApi {
    if (!PlansApi.instance) {
      PlansApi.instance = new PlansApi(pb)
    }
    return PlansApi.instance
  }

  async getAll(): Promise<Plan[]> {
    return this.get(`${this.resource}`)
  }

  async create(planData: Omit<Plan, 'id' | 'created' | 'updated'>): Promise<Plan | null> {
    return this.post(`${this.resource}`, planData)
  }

  async update(id: string, planData: Partial<Omit<Plan, 'id' | 'created' | 'updated'>>): Promise<Plan | null> {
    return this.patch(`${this.resource}/${id}`, planData)
  }

  async deleteOne(id: string): Promise<Plan | null> {
    return this.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Plan | null> {
    return this.get(`${this.resource}/${id}`)
  }

  async restore(id: string): Promise<Plan | null> {
    return this.patch(`${this.resource}/${id}/restore`)
  }
}

export const createPlansApi = (pb: PocketBase) => PlansApi.getInstance(pb) 
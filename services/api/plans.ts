import type { Plan } from '~/types/plans'
import ApiClient from '../client'

class PlansApi extends ApiClient {
  private readonly resource = 'plans'

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
    return super.delete(`${this.resource}/${id}`)
  }

  async getOne(id: string): Promise<Plan | null> {
    return this.get(`${this.resource}/${id}`)
  }

  async restore(id: string): Promise<Plan | null> {
    return this.patch(`${this.resource}/${id}/restore`)
  }
}

export const plansApi = new PlansApi() 
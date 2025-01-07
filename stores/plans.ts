import { defineStore } from 'pinia'
import type { Plan } from '~/types/plans'
import { plansApi } from '~/services/api/plans'

interface PlansState {
  plans: Plan[]
  isLoading: boolean
  error: string | null
  currentPlan: Plan | null
}

export const usePlansStore = defineStore('plans', {
  state: (): PlansState => ({
    plans: [],
    isLoading: false,
    error: null,
    currentPlan: null
  }),

  actions: {
    async fetchPlans() {
      this.isLoading = true
      this.error = null
      
      try {
        this.plans = await plansApi.getAll()
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch plans'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createPlan(planData: Omit<Plan, 'id' | 'created' | 'updated'>) {
      this.isLoading = true
      this.error = null
      
      try {
        const plan = await plansApi.create(planData)
        if (plan) {
          this.plans.unshift(plan)
        }
        return plan
      } catch (err: any) {
        this.error = err.message || 'Failed to create plan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updatePlan(id: string, planData: Partial<Omit<Plan, 'id' | 'created' | 'updated'>>) {
      this.isLoading = true
      this.error = null
      
      try {
        const plan = await plansApi.update(id, planData)
        if (plan) {
          const index = this.plans.findIndex(p => p.id === id)
          if (index !== -1) {
            this.plans[index] = plan
          }
          if (this.currentPlan?.id === id) {
            this.currentPlan = plan
          }
          return plan
        }
        return null
      } catch (err: any) {
        this.error = err.message || 'Failed to update plan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deletePlan(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        await plansApi.delete(id)
        this.plans = this.plans.filter(p => p.id !== id)
        if (this.currentPlan?.id === id) {
          this.currentPlan = null
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to delete plan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async getPlan(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const plan = await plansApi.getOne(id)
        this.currentPlan = plan
        return plan
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch plan'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
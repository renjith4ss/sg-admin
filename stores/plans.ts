import { defineStore } from 'pinia'
import { plansApi } from '~/services/api/plans'
import type { Plan, PlansState } from '~/types/plans'

export const usePlansStore = defineStore('plans', {
  state: (): PlansState => ({
    plans: [],
    currentPlan: null,
    isLoading: false,
    error: null
  }),

  getters: {
    getActivePlans(state: PlansState): Plan[] {
      return state.plans.filter((p: Plan) => !p.deleted)
    },
    getAddonPlans(state: PlansState): Plan[] {
      return state.plans.filter((p: Plan) => p.isAddon)
    },
    getRegularPlans(state: PlansState): Plan[] {
      return state.plans.filter((p: Plan) => !p.isAddon)
    },
    getPlanById(state: PlansState) {
      return (id: string): Plan | undefined => state.plans.find((p: Plan) => p.id === id)
    }
  },

  actions: {
    async fetchPlans() {
      this.isLoading = true
      this.error = null
      
      try {
        const plans = await plansApi.getAll()
        this.plans = plans
        return plans
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
          this.plans.push(plan)
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
          const index = this.plans.findIndex((p: Plan) => p.id === id)
          if (index !== -1) {
            this.plans[index] = plan
          }
        }
        return plan
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
        const plan = await plansApi.deleteOne(id)
        if (plan) {
          const index = this.plans.findIndex((p: Plan) => p.id === id)
          if (index !== -1) {
            this.plans[index] = plan
          }
        }
        return plan
      } catch (err: any) {
        this.error = err.message || 'Failed to delete plan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchPlan(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const plan = await plansApi.getOne(id)
        if (plan) {
          this.currentPlan = plan
          const index = this.plans.findIndex((p: Plan) => p.id === id)
          if (index !== -1) {
            this.plans[index] = plan
          } else {
            this.plans.push(plan)
          }
        }
        return plan
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch plan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restorePlan(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const plan = await plansApi.restore(id)
        if (plan) {
          const index = this.plans.findIndex((p: Plan) => p.id === id)
          if (index !== -1) {
            this.plans[index] = plan
          }
        }
        return plan
      } catch (err: any) {
        this.error = err.message || 'Failed to restore plan'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
}) 
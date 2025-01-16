import { usePlansStore } from '~/stores/plans'
import { storeToRefs } from 'pinia'
import type { Plan } from '~/types/plans'

export const usePlans = () => {
  const plansStore = usePlansStore()
  const { plans, currentPlan, isLoading, error } = storeToRefs(plansStore)

  return {
    // State
    plans,
    currentPlan,
    isLoading,
    error,

    // Getters
    activePlans: computed(() => plansStore.getActivePlans),
    addonPlans: computed(() => plansStore.getAddonPlans),
    regularPlans: computed(() => plansStore.getRegularPlans),
    getPlanById: plansStore.getPlanById,

    // Actions
    fetchPlans: plansStore.fetchPlans,
    createPlan: plansStore.createPlan,
    updatePlan: plansStore.updatePlan,
    deletePlan: plansStore.deletePlan,
    fetchPlan: plansStore.fetchPlan,
    restorePlan: plansStore.restorePlan
  }
} 
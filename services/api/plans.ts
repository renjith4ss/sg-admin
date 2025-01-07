import type { Plan } from '~/types/plans'
import { usePocketBase } from '../pocketbase'

export const plansApi = {
  async getAll() {
    const pb = usePocketBase()
    const records = await pb?.collection('subscription_plans').getFullList({
      sort: '-created'
    })
    return (records || []).map(mapRecordToPlan)
  },

  async create(planData: Omit<Plan, 'id' | 'created' | 'updated'>) {
    const pb = usePocketBase()
    const record = await pb?.collection('subscription_plans').create(planData)
    return record ? mapRecordToPlan(record) : null
  },

  async update(id: string, planData: Partial<Omit<Plan, 'id' | 'created' | 'updated'>>) {
    const pb = usePocketBase()
    const record = await pb?.collection('subscription_plans').update(id, planData)
    return record ? mapRecordToPlan(record) : null
  },

  async delete(id: string) {
    const pb = usePocketBase()
    await pb?.collection('subscription_plans').delete(id)
  },

  async getOne(id: string) {
    const pb = usePocketBase()
    const record = await pb?.collection('subscription_plans').getOne(id)
    return record ? mapRecordToPlan(record) : null
  }
}

function mapRecordToPlan(record: any): Plan {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    yearlyPrice: record.yearlyPrice,
    monthlyPrice: record.monthlyPrice,
    yearlyDiscount: record.yearlyDiscount,
    monthlyDiscount: record.monthlyDiscount,
    trialPeriodDays: record.trialPeriodDays,
    currency: record.currency,
    features: record.features,
    is_special: record.is_special,
    deleted: record.deleted,
    stripeProductId: record.stripeProductId,
    stripeMonthlyPriceId: record.stripeMonthlyPriceId,
    stripeYearlyPriceId: record.stripeYearlyPriceId,
    isAddon: record.isAddon,
    displayCount: record.displayCount,
    storage: record.storage,
    maxMembers: record.maxMembers,
    created: record.created,
    updated: record.updated
  }
} 
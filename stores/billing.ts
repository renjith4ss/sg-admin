import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { useRootStore } from './root'
import type { RecordModel } from 'pocketbase'

interface BillingPlan {
  name: string
  displayName: string
  price: number
  displaySlots: number
  additionalDisplayPrice: number
  features: string[]
  isCustom: boolean
}

type BillingPlanRecord = BillingPlan & RecordModel

interface Transaction {
  organizationId: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  type: 'subscription' | 'addon' | 'credit'
  description: string
  createdAt: string
  metadata: Record<string, unknown>
}

type TransactionRecord = Transaction & RecordModel

interface UsageMetrics {
  totalDisplays: number
  activeDisplays: number
  displaySlotUsage: number
  additionalDisplays: number
}

interface Analytics {
  type: 'usage'
  data: UsageMetrics
  organization: string
}

type AnalyticsRecord = Analytics & RecordModel

interface BillingState {
  currentPlan: BillingPlanRecord | null
  availablePlans: BillingPlanRecord[]
  billingHistory: TransactionRecord[]
  usageMetrics: UsageMetrics | null
  paymentMethods: any[]
  defaultPaymentMethod: string | null
  isLoading: boolean
  error: string | null
  billingSubscriptionId: string | null
}

export const useBillingStore = defineStore('billing', {
  state: (): BillingState => ({
    currentPlan: null,
    availablePlans: [],
    billingHistory: [],
    usageMetrics: null,
    paymentMethods: [],
    defaultPaymentMethod: null,
    isLoading: false,
    error: null,
    billingSubscriptionId: null
  }),

  getters: {
    canAddDisplay(state: BillingState): boolean {
      if (!state.currentPlan || !state.usageMetrics) return false
      return state.usageMetrics.totalDisplays < 
        (state.currentPlan.displaySlots + state.usageMetrics.additionalDisplays)
    },

    currentUsage(state: BillingState): number {
      if (!state.currentPlan || !state.usageMetrics) return 0
      return (state.usageMetrics.totalDisplays / state.currentPlan.displaySlots) * 100
    },

    monthlyBill(state: BillingState): number {
      if (!state.currentPlan || !state.usageMetrics) return 0
      return state.currentPlan.price + 
        (state.usageMetrics.additionalDisplays * state.currentPlan.additionalDisplayPrice)
    },

    hasPaymentMethod(state: BillingState): boolean {
      return state.paymentMethods.length > 0
    },

    sortedBillingHistory(state: BillingState): TransactionRecord[] {
      return [...state.billingHistory].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
  },

  actions: {
    async fetchBillingInfo() {
      const api = useApi()
      const rootStore = useRootStore()
      if (!rootStore.currentOrganizationId) return

      this.isLoading = true
      this.error = null

      try {
        // Fetch current plan and usage
        const org = await api.get('organizations', rootStore.currentOrganizationId)
        const planResponse = await api.get<BillingPlanRecord>('plans', org.subscriptionPlan)
        this.currentPlan = planResponse

        // Fetch available plans
        const plansResponse = await api.list<BillingPlanRecord>('plans')
        this.availablePlans = plansResponse.items

        // Fetch usage metrics
        const metricsResponse = await api.list(
          'analytics',
          1,
          1,
          `organization="${rootStore.currentOrganizationId}" && type="usage"`
        )
        this.usageMetrics = metricsResponse.items[0]?.data || null

        // Set up real-time updates for usage metrics
        if (!this.billingSubscriptionId) {
          this.billingSubscriptionId = await api.subscribe<AnalyticsRecord>(
            'analytics',
            {
              callback: (data, event) => {
                if (event === 'create' && data.record.type === 'usage') {
                  this.usageMetrics = data.record.data
                }
              },
              filter: `organization="${rootStore.currentOrganizationId}" && type="usage"`
            }
          )
        }

        // Fetch billing history
        const historyResponse = await api.list<TransactionRecord>(
          'billing_history',
          1,
          100,
          `organization="${rootStore.currentOrganizationId}"`
        )
        this.billingHistory = historyResponse.items

        rootStore.updateLastSync('billing')
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async changePlan(planId: string) {
      const api = useApi()
      const rootStore = useRootStore()
      if (!rootStore.currentOrganizationId) return

      this.isLoading = true
      this.error = null

      try {
        // Update organization's plan
        await api.update('organizations', rootStore.currentOrganizationId, {
          subscriptionPlan: planId
        })

        // Fetch updated billing info
        await this.fetchBillingInfo()

        return true
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addPaymentMethod(paymentMethodData: any) {
      const api = useApi()
      const rootStore = useRootStore()
      if (!rootStore.currentOrganizationId) return

      this.isLoading = true
      this.error = null

      try {
        // Add payment method
        const response = await api.create('payment_methods', {
          organization: rootStore.currentOrganizationId,
          ...paymentMethodData
        })

        // If this is the first payment method, set it as default
        if (this.paymentMethods.length === 0) {
          this.defaultPaymentMethod = response.id
        }

        this.paymentMethods.push(response)
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async removePaymentMethod(paymentMethodId: string) {
      const api = useApi()
      this.isLoading = true
      this.error = null

      try {
        await api.remove('payment_methods', paymentMethodId)
        this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== paymentMethodId)

        // If we removed the default payment method, set a new one
        if (this.defaultPaymentMethod === paymentMethodId) {
          this.defaultPaymentMethod = this.paymentMethods[0]?.id || null
        }

        return true
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async setDefaultPaymentMethod(paymentMethodId: string) {
      const api = useApi()
      const rootStore = useRootStore()
      if (!rootStore.currentOrganizationId) return

      this.isLoading = true
      this.error = null

      try {
        await api.update('organizations', rootStore.currentOrganizationId, {
          defaultPaymentMethod: paymentMethodId
        })
        this.defaultPaymentMethod = paymentMethodId
        return true
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    cleanup() {
      const api = useApi()
      if (this.billingSubscriptionId) {
        api.unsubscribe(this.billingSubscriptionId)
        this.billingSubscriptionId = null
      }
      this.currentPlan = null
      this.usageMetrics = null
      this.billingHistory = []
      this.paymentMethods = []
      this.defaultPaymentMethod = null
    }
  }
}) 
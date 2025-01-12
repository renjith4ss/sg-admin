export interface Plan {
  id: string
  name: string
  description: string
  yearlyPrice: number
  monthlyPrice: number
  yearlyDiscount: number
  monthlyDiscount: number
  trialPeriodDays: number
  currency: string
  features: string[]
  isSpecial: boolean
  deleted: boolean
  stripeProductId: string
  stripeMonthlyPriceId: string
  stripeYearlyPriceId: string
  isAddon: boolean
  displayCount: number
  storage: number
  maxMembers: number
  created: string
  updated: string
}

export interface PlansState {
  plans: Plan[]
  currentPlan: Plan | null
  isLoading: boolean
  error: string | null
}

export interface ValidationError {
  code: string
  message: string
}

export interface ApiError {
  data?: {
    data?: Record<string, ValidationError>
    message?: string
  }
  message: string
  status: number
}

export type PlanTabValue = 'tenant' | 'addon'

export type DialogType = 'create' | 'delete' | 'restore'

export interface PlanTab {
  label: string
  value: PlanTabValue
} 
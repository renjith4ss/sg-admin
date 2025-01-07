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
  is_special: boolean
  deleted: boolean
  stripeProductId: string
  stripeMonthlyPriceId: string
  stripeYearlyPriceId: string
  isAddon: boolean
  displayCount: number | null
  storage: number | null
  maxMembers: number | null
  created: string
  updated: string
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
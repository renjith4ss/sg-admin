import { z } from 'zod'

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .or(z.literal(''))

// Organization validation
export const organizationSchema = z.object({
  name: nameSchema,
  subscriptionPlan: z.enum(['free', 'basic', 'pro']),
  displaySlots: z.number().min(1),
  additionalDisplays: z.number().min(0),
  customRoles: z.record(z.string(), z.array(z.string())).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  billingEmail: emailSchema,
  status: z.enum(['active', 'suspended', 'cancelled'])
})

// Display validation
export const displaySchema = z.object({
  name: nameSchema,
  organization: z.string().min(1),
  status: z.enum(['active', 'inactive', 'maintenance']),
  settings: z.record(z.string(), z.unknown()).optional(),
  version: z.string().optional()
})

// Analytics validation
export const analyticsSchema = z.object({
  display: z.string().min(1),
  organization: z.string().min(1),
  type: z.enum(['view', 'interaction', 'error']),
  data: z.record(z.string(), z.unknown()),
  timestamp: z.date()
})

// Validation helper functions
export const validate = async <T>(schema: z.Schema<T>, data: unknown): Promise<T> => {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err: z.ZodIssue) => err.message)
      throw new Error(messages.join(', '))
    }
    throw error
  }
}

export const validatePartial = async <T extends z.ZodObject<any>>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> => {
  try {
    return await schema.partial().parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err: z.ZodIssue) => err.message)
      throw new Error(messages.join(', '))
    }
    throw error
  }
}

// Type inference helpers
export type Organization = z.infer<typeof organizationSchema>
export type Display = z.infer<typeof displaySchema>
export type Analytics = z.infer<typeof analyticsSchema>

export interface User {
  email: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  lastActive?: Date
  organizationMemberships: {
    organizationId: string
    roleId: string
  }[]
} 
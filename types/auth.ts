
export interface AuthCookie {
  token: string
  model: any // or your specific model type
}

export interface User {
  id: string
  email: string
  emailVisibility: boolean
  username: string
  verified: boolean
  first_name: string
  last_name: string
  avatar: string
  active: boolean
  deleted: boolean
  created: string
  updated: string
  collectionId: string
  collectionName: string
  is_display: boolean
  level: string
  roles: string[]
  tenant: string
  type: string
  owner: string
  eroot: string
  froot: string
  needsMfa?: boolean
  mfaId?: string,
  permissions: string[]
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmation {
  token: string
  password: string
  passwordConfirm: string
}

export interface AuthState {
  isLoading: boolean
  error: string | null
  user: User | null
  initialized: boolean
}

export interface OTPRequest {
  otpId: string
  code: string
  mfaId?: string
}

export interface OTPResponse {
  otpId: string
  expiresIn: number
}

export interface MFAResponse {
  needsMfa: true
  mfaId: string
} 
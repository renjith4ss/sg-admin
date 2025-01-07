export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  created: string
  updated: string
}

export interface LoginCredentials {
  email: string
  password: string
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
  user: User | null
  isLoading: boolean
  error: string | null
} 
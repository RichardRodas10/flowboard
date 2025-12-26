import { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  email: string
  password: string
  fullName: string
  confirmPassword: string
}

export interface ForgotPasswordFormData {
  email: string
}
import { supabase } from '@/lib/supabase'
import { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '../types/auth.types'

export const authService = {
  // Login con email y password
  async login({ email, password }: LoginFormData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Registro de nuevo usuario
  async register({ email, password, fullName }: RegisterFormData) {
    // 1. Crear cuenta en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // 2. Supabase creará automáticamente el perfil via trigger
    return data
  },

  // Login con Google OAuth
  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) throw error
    return data
  },

  // Recuperación de contraseña
  async forgotPassword({ email }: ForgotPasswordFormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
  },

  // Actualizar contraseña
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}
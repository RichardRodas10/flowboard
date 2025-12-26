import { useAuthStore } from '@/stores/authStore'
import { authService } from '../services/authService'
import { LoginFormData, RegisterFormData } from '../types/auth.types'

// Custom hook para manejar autenticación Simplifica el acceso al estado y acciones de auth en cualquier componente
export function useAuth() {
  const { user, loading, setUser, logout, initialize } = useAuthStore()

  // Estado derivado
  const isAuthenticated = !!user
  const isLoading = loading

  // Métodos convenientes
  const login = async (data: LoginFormData) => {
    const result = await authService.login(data)
    return result
  }

  const register = async (data: RegisterFormData) => {
    const result = await authService.register(data)
    return result
  }

  const loginWithGoogle = async () => {
    const result = await authService.loginWithGoogle()
    return result
  }

  const signOut = async () => {
    await logout()
  }

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    loading,

    // Datos del usuario
    userId: user?.id,
    email: user?.email,
    fullName: user?.user_metadata?.full_name,

    // Acciones
    login,
    register,
    loginWithGoogle,
    logout: signOut,
    setUser,
    initialize,
  }
}
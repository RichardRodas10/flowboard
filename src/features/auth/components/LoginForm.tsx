import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { GoogleLoginButton } from './GoogleLoginButton'
import { authService } from '../services/authService'
import { loginSchema, LoginFormData } from '../schemas/authSchemas'

export function LoginForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await authService.login(data)
      toast.success('¡Bienvenido de vuelta!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle()
    } catch (error: any) {
      console.error('Google login error:', error)
      toast.error('Error al iniciar sesión con Google')
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenido de vuelta
        </h1>
        <p className="text-gray-400">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
              {...register('rememberMe')}
            />
            <span className="text-gray-400">Recordarme</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Iniciar Sesión
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-900 text-gray-400">
            O continúa con
          </span>
        </div>
      </div>

      {/* Google login */}
      <GoogleLoginButton onClick={handleGoogleLogin} />

      {/* Register link */}
      <p className="text-center text-sm text-gray-400">
        ¿No tienes una cuenta?{' '}
        <Link
          to="/register"
          className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}
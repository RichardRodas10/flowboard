import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock, User } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { GoogleLoginButton } from './GoogleLoginButton'
import { authService } from '../services/authService'
import { registerSchema, RegisterFormData } from '../schemas/authSchemas'

export function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

const onSubmit = async (data: RegisterFormData) => {
  try {
    setIsLoading(true)
    await authService.register(data)
    
    toast.success(
      'Cuenta creada. Revisa tu email para verificar (válido por 24 horas)',
      { duration: 6000 }
    )
    
    navigate('/login', { 
      state: { 
        message: 'Verifica tu email antes de iniciar sesión',
        email: data.email 
      } 
    })
  } catch (error: any) {
    console.error('Register error:', error)
    
    if (error.message?.includes('already registered')) {
      toast.error('Este email ya está registrado')
    } else {
      toast.error(error.message || 'Error al crear la cuenta')
    }
  } finally {
    setIsLoading(false)
  }
}

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle()
    } catch (error: any) {
      console.error('Google login error:', error)
      toast.error('Error al registrarse con Google')
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Crea tu cuenta
        </h1>
        <p className="text-gray-400">
          Comienza a gestionar tus proyectos hoy
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Juan Pérez"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

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

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Password requirements */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>La contraseña debe contener:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos un número</li>
          </ul>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Crear Cuenta
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

      {/* Login link */}
      <p className="text-center text-sm text-gray-400">
        ¿Ya tienes una cuenta?{' '}
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
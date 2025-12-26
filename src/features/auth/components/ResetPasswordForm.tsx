import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Lock } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { supabase } from '@/lib/supabase'

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Verificar que haya una sesión válida al cargar el componente
  useEffect(() => {
    const checkSession = async () => {
      // Obtener el hash de la URL (contiene el token)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')

      // Verificar que sea una recuperación de contraseña
      if (type !== 'recovery' || !accessToken) {
        toast.error('El enlace ha expirado o es inválido')
        navigate('/forgot-password')
        return
      }

      // Verificar la sesión
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        toast.error('El enlace ha expirado o es inválido')
        navigate('/forgot-password')
        return
      }
      
      setSessionChecked(true)
    }

    checkSession()
  }, [navigate])

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      toast.success('¡Contraseña actualizada correctamente!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Reset password error:', error)
      
      if (error.message?.includes('session')) {
        toast.error('La sesión ha expirado. Solicita un nuevo enlace.')
        navigate('/forgot-password')
      } else {
        toast.error('Error al actualizar la contraseña')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verificando enlace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Nueva contraseña
        </h1>
        <p className="text-gray-400">
          Ingresa tu nueva contraseña segura
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nueva contraseña"
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
          Actualizar contraseña
        </Button>
      </form>
    </div>
  )
}
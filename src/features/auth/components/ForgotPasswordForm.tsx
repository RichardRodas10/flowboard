import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { authService } from '../services/authService'
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/authSchemas'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const email = watch('email')

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      await authService.forgotPassword(data)
      setEmailSent(true)
      toast.success('Email enviado correctamente')
    } catch (error: any) {
      console.error('Forgot password error:', error)
      toast.error('Error al enviar el email de recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-md space-y-6">
        {/* Success state */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary-500" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ¡Revisa tu email!
            </h1>
            <p className="text-gray-400">
              Hemos enviado un enlace de recuperación a
            </p>
            <p className="text-white font-semibold mt-1">{email}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 space-y-2">
            <p className="font-semibold text-white">Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Abre tu bandeja de entrada</li>
              <li>Busca el email de FlowBoard</li>
              <li>Haz clic en el enlace de recuperación</li>
              <li>Crea tu nueva contraseña</li>
            </ol>
          </div>

          <p className="text-sm text-gray-400">
            ¿No recibiste el email?{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              Intentar de nuevo
            </button>
          </p>
        </div>

        {/* Back to login */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-gray-400">
          No te preocupes, te enviaremos instrucciones para recuperarla
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

        {/* Info box */}
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3 text-sm text-gray-300">
          <p>
            Te enviaremos un enlace seguro para restablecer tu contraseña.
            El enlace expirará en 1 hora.
          </p>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Enviar enlace de recuperación
        </Button>
      </form>

      {/* Back to login */}
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio de sesión
      </Link>
    </div>
  )
}
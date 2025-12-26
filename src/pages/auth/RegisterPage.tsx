import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { AuthHeader } from '@/shared/components/layout/AuthHeader'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <RegisterForm />
      </div>
    </div>
  )
}
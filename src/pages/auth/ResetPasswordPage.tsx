import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { AuthHeader } from '@/shared/components/layout/AuthHeader'

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
         <AuthHeader />
        <ResetPasswordForm />
      </div>
    </div>
  )
}
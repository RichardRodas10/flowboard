import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { AuthHeader } from '@/shared/components/layout/Authheader';

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <AuthHeader />
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
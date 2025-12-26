import { LoginForm } from '@/features/auth/components/LoginForm'
import { AuthHeader } from '@/shared/components/layout/Authheader'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <LoginForm />
      </div>
    </div>
  )
}
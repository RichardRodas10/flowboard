import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/shared/components/ui/Button'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Sesión cerrada')
      navigate('/login')
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-white">
            ¡Bienvenido al Dashboard!
          </h1>
          
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">ID:</span> {user?.id}
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
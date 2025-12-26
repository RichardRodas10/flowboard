import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/Button'
import { LogOut, User, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export function DashboardPage() {
  const { user, email, fullName, logout } = useAuth()
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
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Flow<span className="text-primary-500">Board</span>
          </h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>

        {/* Welcome Card */}
        <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              ¡Bienvenido al Dashboard!
            </h2>
            <p className="text-gray-400">
              Sprint 1 completado exitosamente. Próximamente: Workspaces y Proyectos.
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Nombre</p>
                <p className="font-medium">{fullName || 'Usuario'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium break-all">{email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-primary-500">0</p>
              <p className="text-sm text-gray-400">Workspaces</p>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-primary-500">0</p>
              <p className="text-sm text-gray-400">Proyectos</p>
            </div>
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <p className="text-2xl font-bold text-primary-500">0</p>
              <p className="text-sm text-gray-400">Tareas</p>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="text-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 mb-4">
              Sprint 2 en desarrollo
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">
                Workspaces
              </span>
              <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">
                Invitaciones
              </span>
              <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">
                Roles y Permisos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
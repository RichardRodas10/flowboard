import { useAuth } from '@/features/auth/hooks/useAuth'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const { user, email, fullName } = useAuth()
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ¡Bienvenido de vuelta, {fullName || 'Usuario'}!
            </h2>
            <p className="text-gray-400">
              Resumen de actividad.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Workspaces</p>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500 mt-2">Próximamente</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Proyectos</p>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500 mt-2">Próximamente</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Tareas</p>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-gray-500 mt-2">Próximamente</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Completadas</p>
              <p className="text-3xl font-bold text-primary-500">0</p>
              <p className="text-xs text-gray-500 mt-2">Esta semana</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/workspaces')}
                className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-left"
              >
                <p className="font-medium">Crear Workspace</p>
                <p className="text-sm text-primary-100 mt-1">Comienza a organizar</p>
              </button>
              <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-left">
                <p className="font-medium">Invitar Equipo</p>
                <p className="text-sm text-gray-400 mt-1">Colabora con otros</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
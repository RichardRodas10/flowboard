import { Home, FolderKanban, CheckSquare, Users, Settings, LogOut, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { toast } from 'react-hot-toast'
import { cn } from '@/shared/utils/cn'

interface SidebarProps {
  onCloseMobile?: () => void
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const { user, email, fullName, logout } = useAuth()
  const navigate = useNavigate()

  // Obtener avatar de Google
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Sesión cerrada')
      navigate('/login')
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/workspaces', icon: FolderKanban, label: 'Workspaces' },
    { to: '/tasks', icon: CheckSquare, label: 'Mis Tareas' },
    { to: '/members', icon: Users, label: 'Miembros' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header con Logo y Close button (mobile) */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Flow<span className="text-primary-500">Board</span>
        </h1>
        
        {/* Close button solo en mobile */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName || 'User'}
                className="w-12 h-12 rounded-full border-2 border-primary-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg">
                {(fullName || email || 'U')[0].toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">
              {fullName || 'Usuario'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="p-4 border-b border-gray-700">
        <button className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Mi Workspace</p>
              <p className="text-xs text-gray-400">Personal</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}
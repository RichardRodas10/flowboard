import { Plus, FolderKanban } from 'lucide-react'
import { WorkspaceCard } from './WorkspaceCard'
import { Button } from '@/shared/components/ui/Button'
import type { Workspace } from '../types/workspace.types'

interface WorkspaceGridProps {
  workspaces: Workspace[]
  loading?: boolean
  onCreateClick: () => void
}

export function WorkspaceGrid({ workspaces, loading, onCreateClick }: WorkspaceGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-pulse"
          >
            <div className="h-2 bg-gray-700" />
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-700 rounded w-24" />
                <div className="h-4 bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (!loading && workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <FolderKanban className="w-10 h-10 text-gray-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          No tienes workspaces aún
        </h3>
        <p className="text-gray-400 text-center max-w-md mb-8">
          Los workspaces te ayudan a organizar tus proyectos y colaborar con tu equipo.
          Crea tu primer workspace para comenzar.
        </p>
        
        <Button
          variant="primary"
          onClick={onCreateClick}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Crear mi primer workspace
        </Button>
      </div>
    )
  }

  // Grid with workspaces
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Workspaces</h2>
          <p className="text-gray-400 mt-1">
            {workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'}
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={onCreateClick}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nuevo Workspace</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            memberCount={1}
            projectCount={0}
          />
        ))}
      </div>
    </div>
  )
}
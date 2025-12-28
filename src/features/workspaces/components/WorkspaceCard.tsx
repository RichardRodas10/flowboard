import { Users, FolderKanban, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Workspace } from '../types/workspace.types'

interface WorkspaceCardProps {
  workspace: Workspace
  memberCount?: number
  projectCount?: number
}

export function WorkspaceCard({ 
  workspace, 
  memberCount = 0, 
  projectCount = 0 
}: WorkspaceCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/workspaces/${workspace.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500 transition-all cursor-pointer overflow-hidden"
    >
      {/* Color banner */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: workspace.color }}
      />

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Color badge */}
            <div
              className="w-12 h-12 rounded-lg shrink-0 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: workspace.color }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                {workspace.name}
              </h3>
              {workspace.description && (
                <p className="text-sm text-gray-400 line-clamp-1">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>

          {/* Menu button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Abrir menu de opciones
            }}
            className="p-2 hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <FolderKanban className="w-4 h-4" />
            <span>{projectCount} proyectos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{memberCount} miembros</span>
          </div>
        </div>

        {/* Footer - Avatars preview (placeholder) */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800"
              />
            ))}
          </div>
          {memberCount > 3 && (
            <span className="text-xs text-gray-500">
              +{memberCount - 3} más
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { workspaceService } from '../services/workspaceService'
import type { WorkspaceRole, WorkspacePermissions } from '../types/workspace.types'

/**
 * Hook para calcular permisos del usuario en un workspace
 */
export function usePermissions(workspaceId: string | null) {
  const { user } = useAuth()
  const [role, setRole] = useState<WorkspaceRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workspaceId || !user) {
      setRole(null)
      setLoading(false)
      return
    }

    loadRole()
  }, [workspaceId, user])

  const loadRole = async () => {
    if (!workspaceId) return

    try {
      setLoading(true)
      const userRole = await workspaceService.getUserRole(workspaceId)
      setRole(userRole as WorkspaceRole)
    } catch (err) {
      console.error('Error loading role:', err)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }

  // Calcular permisos basados en el rol
  const permissions: WorkspacePermissions = {
    canEdit: ['owner', 'admin'].includes(role || ''),
    canDelete: role === 'owner',
    canInvite: ['owner', 'admin'].includes(role || ''),
    canManageMembers: ['owner', 'admin'].includes(role || ''),
    canChangeRoles: role === 'owner',
    canRemoveMembers: ['owner', 'admin'].includes(role || ''),
  }

  return {
    role,
    loading,
    permissions,
    isOwner: role === 'owner',
    isAdmin: ['owner', 'admin'].includes(role || ''),
    isMember: ['owner', 'admin', 'member'].includes(role || ''),
    canEdit: permissions.canEdit,
    canDelete: permissions.canDelete,
    canInvite: permissions.canInvite,
  }
}
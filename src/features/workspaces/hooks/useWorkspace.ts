import { useState, useEffect } from 'react'
import { workspaceService } from '../services/workspaceService'
import type { WorkspaceWithMembers } from '../types/workspace.types'

/**
 * Hook para gestionar un workspace específico con sus miembros
 */
export function useWorkspace(workspaceId: string | null) {
  const [workspace, setWorkspace] = useState<WorkspaceWithMembers | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setWorkspace(null)
      setLoading(false)
      return
    }

    loadWorkspace()
  }, [workspaceId])

  const loadWorkspace = async () => {
    if (!workspaceId) return

    try {
      setLoading(true)
      setError(null)
      const data = await workspaceService.getById(workspaceId)
      setWorkspace(data)
    } catch (err: any) {
      console.error('Error loading workspace:', err)
      setError(err.message || 'Error al cargar workspace')
    } finally {
      setLoading(false)
    }
  }

  return {
    workspace,
    loading,
    error,
    refetch: loadWorkspace,
  }
}
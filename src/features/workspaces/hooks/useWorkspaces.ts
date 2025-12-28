import { useState, useEffect } from 'react'
import { workspaceService } from '../services/workspaceService'
import type { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from '../types/workspace.types'

/**
 * Hook para gestionar la lista de workspaces del usuario
 */
export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar workspaces al montar
  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await workspaceService.getAll()
      setWorkspaces(data)
    } catch (err: any) {
      console.error('Error loading workspaces:', err)
      setError(err.message || 'Error al cargar workspaces')
    } finally {
      setLoading(false)
    }
  }

  const createWorkspace = async (dto: CreateWorkspaceDto): Promise<Workspace> => {
    try {
      const newWorkspace = await workspaceService.create(dto)
      setWorkspaces(prev => [newWorkspace, ...prev])
      return newWorkspace
    } catch (err: any) {
      console.error('Error creating workspace:', err)
      throw err
    }
  }

  const updateWorkspace = async (id: string, dto: UpdateWorkspaceDto): Promise<Workspace> => {
    try {
      const updated = await workspaceService.update(id, dto)
      setWorkspaces(prev =>
        prev.map(w => (w.id === id ? updated : w))
      )
      return updated
    } catch (err: any) {
      console.error('Error updating workspace:', err)
      throw err
    }
  }

  const deleteWorkspace = async (id: string): Promise<void> => {
    try {
      await workspaceService.delete(id)
      setWorkspaces(prev => prev.filter(w => w.id !== id))
    } catch (err: any) {
      console.error('Error deleting workspace:', err)
      throw err
    }
  }

  return {
    workspaces,
    loading,
    error,
    refetch: loadWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  }
}
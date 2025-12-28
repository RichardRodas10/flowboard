import { useState, useEffect } from 'react'
import { invitationService } from '../services/invitationService'
import type { 
  InvitationWithWorkspace, 
  InviteMemberDto 
} from '../types/workspace.types'

/**
 * Hook para gestionar invitaciones de un workspace
 */
export function useInvitations(workspaceId: string | null) {
  const [invitations, setInvitations] = useState<InvitationWithWorkspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setInvitations([])
      setLoading(false)
      return
    }

    loadInvitations()
  }, [workspaceId])

  const loadInvitations = async () => {
    if (!workspaceId) return

    try {
      setLoading(true)
      setError(null)
      const data = await invitationService.getByWorkspace(workspaceId)
      setInvitations(data)
    } catch (err: any) {
      console.error('Error loading invitations:', err)
      setError(err.message || 'Error al cargar invitaciones')
    } finally {
      setLoading(false)
    }
  }

  const createInvitation = async (dto: InviteMemberDto) => {
    if (!workspaceId) throw new Error('Workspace ID requerido')

    try {
      const newInvitation = await invitationService.create(workspaceId, dto)
      await loadInvitations() // Recargar para obtener relaciones
      return newInvitation
    } catch (err: any) {
      console.error('Error creating invitation:', err)
      throw err
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      await invitationService.cancel(invitationId)
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
    } catch (err: any) {
      console.error('Error cancelling invitation:', err)
      throw err
    }
  }

  const resendInvitation = async (invitationId: string) => {
    try {
      await invitationService.resend(invitationId)
      await loadInvitations()
    } catch (err: any) {
      console.error('Error resending invitation:', err)
      throw err
    }
  }

  return {
    invitations,
    loading,
    error,
    refetch: loadInvitations,
    createInvitation,
    cancelInvitation,
    resendInvitation,
    pendingCount: invitations.length,
  }
}
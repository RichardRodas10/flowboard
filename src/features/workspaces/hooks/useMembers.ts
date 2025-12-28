import { useState, useEffect } from 'react'
import { memberService } from '../services/memberService'
import type { 
  WorkspaceMemberWithUser, 
  UpdateMemberRoleDto,
  WorkspaceRole 
} from '../types/workspace.types'

/**
 * Hook para gestionar miembros de un workspace
 */
export function useMembers(workspaceId: string | null) {
  const [members, setMembers] = useState<WorkspaceMemberWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setMembers([])
      setLoading(false)
      return
    }

    loadMembers()
  }, [workspaceId])

  const loadMembers = async () => {
    if (!workspaceId) return

    try {
      setLoading(true)
      setError(null)
      const data = await memberService.getByWorkspace(workspaceId)
      setMembers(data)
    } catch (err: any) {
      console.error('Error loading members:', err)
      setError(err.message || 'Error al cargar miembros')
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (memberId: string, newRole: WorkspaceRole) => {
    try {
      const dto: UpdateMemberRoleDto = { member_id: memberId, role: newRole }
      await memberService.updateRole(dto)
      
      // Actualizar localmente
      setMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, role: newRole } : m))
      )
    } catch (err: any) {
      console.error('Error updating role:', err)
      throw err
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      await memberService.remove(memberId)
      
      // Actualizar localmente
      setMembers(prev => prev.filter(m => m.id !== memberId))
    } catch (err: any) {
      console.error('Error removing member:', err)
      throw err
    }
  }

  // Datos derivados
  const owner = members.find(m => m.role === 'owner')
  const admins = members.filter(m => m.role === 'admin')
  const regularMembers = members.filter(m => m.role === 'member')
  const viewers = members.filter(m => m.role === 'viewer')

  return {
    members,
    loading,
    error,
    refetch: loadMembers,
    updateRole,
    removeMember,
    // Helpers
    owner,
    admins,
    regularMembers,
    viewers,
    totalCount: members.length,
  }
}
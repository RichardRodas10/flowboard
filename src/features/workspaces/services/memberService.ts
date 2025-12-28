import { supabase } from '@/lib/supabase'
import type {
  WorkspaceMember,
  WorkspaceMemberWithUser,
  UpdateMemberRoleDto,
  WorkspaceRole,
} from '../types/workspace.types'

export const memberService = {
  /**
   * Obtener todos los miembros de un workspace
   */
  async getByWorkspace(workspaceId: string): Promise<WorkspaceMemberWithUser[]> {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        user:user_id(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('workspace_id', workspaceId)
      .order('joined_at', { ascending: true })

    if (error) throw error

    // Transformar los datos
    return (data || []).map((member: any) => ({
      ...member,
      user: {
        id: member.user.id,
        email: member.user.email,
        full_name: member.user.raw_user_meta_data?.full_name || null,
        avatar_url: member.user.raw_user_meta_data?.avatar_url || 
                     member.user.raw_user_meta_data?.picture || null,
      }
    }))
  },

  /**
   * Actualizar el rol de un miembro
   */
  async updateRole(dto: UpdateMemberRoleDto): Promise<WorkspaceMember> {
    const { data, error } = await supabase
      .from('workspace_members')
      .update({ role: dto.role })
      .eq('id', dto.member_id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Remover un miembro del workspace
   */
  async remove(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('id', memberId)

    if (error) throw error
  },

  /**
   * Verificar si el usuario puede gestionar miembros
   */
  async canManageMembers(workspaceId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return false
    return ['owner', 'admin'].includes(data.role)
  },

  /**
   * Obtener el owner del workspace
   */
  async getOwner(workspaceId: string): Promise<WorkspaceMemberWithUser | null> {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        *,
        user:user_id(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('workspace_id', workspaceId)
      .eq('role', 'owner')
      .single()

    if (error || !data) return null

    return {
      ...data,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.raw_user_meta_data?.full_name || null,
        avatar_url: data.user.raw_user_meta_data?.avatar_url || 
                     data.user.raw_user_meta_data?.picture || null,
      }
    }
  },

  /**
   * Contar miembros por rol
   */
  async countByRole(workspaceId: string): Promise<Record<WorkspaceRole, number>> {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)

    if (error) throw error

    const counts = {
      owner: 0,
      admin: 0,
      member: 0,
      viewer: 0,
    }

    data?.forEach((member) => {
      counts[member.role as WorkspaceRole]++
    })

    return counts
  },
}
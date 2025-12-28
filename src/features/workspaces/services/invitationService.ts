import { supabase } from '@/lib/supabase'
import type {
  Invitation,
  InviteMemberDto,
  InvitationWithWorkspace,
} from '../types/workspace.types'

export const invitationService = {
  /**
   * Crear una invitación
   */
  async create(workspaceId: string, dto: InviteMemberDto): Promise<Invitation> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Generar token único
    const token = crypto.randomUUID()

    // Fecha de expiración (7 días)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        workspace_id: workspaceId,
        email: dto.email.toLowerCase().trim(),
        role: dto.role,
        token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Ya existe una invitación pendiente para este email')
      }
      throw error
    }

    // TODO: Enviar email de invitación (Sprint 2 avanzado)
    // await sendInvitationEmail(data)

    return data
  },

  /**
   * Obtener invitaciones pendientes de un workspace
   */
  async getByWorkspace(workspaceId: string): Promise<InvitationWithWorkspace[]> {
    const { data, error } = await supabase
      .from('invitations')
      .select(`
        *,
        workspace:workspace_id(
          id,
          name,
          description
        ),
        inviter:invited_by(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('workspace_id', workspaceId)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((inv: any) => ({
      ...inv,
      workspace: {
        id: inv.workspace.id,
        name: inv.workspace.name,
        description: inv.workspace.description,
      },
      inviter: {
        id: inv.inviter.id,
        email: inv.inviter.email,
        full_name: inv.inviter.raw_user_meta_data?.full_name || null,
      }
    }))
  },

  /**
   * Obtener una invitación por token
   */
  async getByToken(token: string): Promise<InvitationWithWorkspace | null> {
    const { data, error } = await supabase
      .from('invitations')
      .select(`
        *,
        workspace:workspace_id(
          id,
          name,
          description
        ),
        inviter:invited_by(
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('token', token)
      .single()

    if (error || !data) return null

    return {
      ...data,
      workspace: {
        id: data.workspace.id,
        name: data.workspace.name,
        description: data.workspace.description,
      },
      inviter: {
        id: data.inviter.id,
        email: data.inviter.email,
        full_name: data.inviter.raw_user_meta_data?.full_name || null,
      }
    }
  },

  /**
   * Aceptar una invitación
   */
  async accept(token: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Obtener la invitación
    const invitation = await this.getByToken(token)
    if (!invitation) throw new Error('Invitación no encontrada')

    // Verificar que no esté expirada
    if (new Date(invitation.expires_at) < new Date()) {
      throw new Error('La invitación ha expirado')
    }

    // Verificar que el email coincida (opcional)
    if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new Error('Esta invitación es para otro email')
    }

    // Verificar que no sea ya miembro
    const { data: existingMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', invitation.workspace_id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      throw new Error('Ya eres miembro de este workspace')
    }

    // Agregar como miembro
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: invitation.workspace_id,
        user_id: user.id,
        role: invitation.role,
      })

    if (memberError) throw memberError

    // Marcar invitación como aceptada
    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitation.id)

    if (updateError) throw updateError
  },

  /**
   * Cancelar una invitación
   */
  async cancel(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId)

    if (error) throw error
  },

  /**
   * Reenviar invitación (extender fecha de expiración)
   */
  async resend(invitationId: string): Promise<Invitation> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data, error } = await supabase
      .from('invitations')
      .update({
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .eq('id', invitationId)
      .select()
      .single()

    if (error) throw error

    // TODO: Reenviar email
    return data
  },
}
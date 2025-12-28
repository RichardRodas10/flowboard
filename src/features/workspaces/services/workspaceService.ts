import { supabase } from '@/lib/supabase'
import type {
  Workspace,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceWithMembers,
} from '../types/workspace.types'

export const workspaceService = {
  /**
   * Obtener todos los workspaces del usuario actual
   */
  async getAll(): Promise<Workspace[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Primero obtener los workspace IDs donde soy miembro
    const { data: memberData, error: memberError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)

    if (memberError) throw memberError

    const workspaceIds = memberData?.map(m => m.workspace_id) || []

    // Si no tengo workspaces, retornar array vacío
    if (workspaceIds.length === 0) return []

    // Obtener los workspaces
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .in('id', workspaceIds)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Obtener un workspace por ID con sus miembros
   */
  async getById(id: string): Promise<WorkspaceWithMembers> {
    const { data, error } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members(
          id,
          user_id,
          role,
          joined_at,
          user:user_id(
            id,
            email,
            raw_user_meta_data
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Workspace no encontrado')

    // Transformar los datos
    const members = (data.workspace_members || []).map((member: any) => ({
      ...member,
      user: {
        id: member.user.id,
        email: member.user.email,
        full_name: member.user.raw_user_meta_data?.full_name || null,
        avatar_url: member.user.raw_user_meta_data?.avatar_url || 
                     member.user.raw_user_meta_data?.picture || null,
      }
    }))

    return {
      ...data,
      members,
      member_count: members.length,
    }
  },

  /**
   * Crear un nuevo workspace
   */
  async create(dto: CreateWorkspaceDto): Promise<Workspace> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name: dto.name,
        description: dto.description || null,
        color: dto.color || '#6366f1',
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Actualizar un workspace
   */
  async update(id: string, dto: UpdateWorkspaceDto): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspaces')
      .update({
        name: dto.name,
        description: dto.description,
        color: dto.color,
        avatar_url: dto.avatar_url,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Eliminar un workspace (solo owner)
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Verificar si el usuario es miembro del workspace
   */
  async isMember(workspaceId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single()

    return !error && !!data
  },

  /**
   * Obtener el rol del usuario en el workspace
   */
  async getUserRole(workspaceId: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return null
    return data.role
  },

  /**
   * Contar workspaces del usuario
   */
  async count(): Promise<number> {
    const { count, error } = await supabase
      .from('workspaces')
      .select('id', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },
}
// Tipos principales
export interface Workspace {
    id: string
    name: string
    description: string | null
    owner_id: string
    avatar_url: string | null
    color: string
    created_at: string
    updated_at: string
  }
  
  export interface WorkspaceMember {
    id: string
    workspace_id: string
    user_id: string
    role: WorkspaceRole
    joined_at: string
  }
  
  export interface Invitation {
    id: string
    workspace_id: string
    email: string
    role: WorkspaceRole
    token: string
    invited_by: string
    status: InvitationStatus
    expires_at: string
    accepted_at: string | null
    created_at: string
  }
  
  // Tipos enumerados
  export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer'
  
  export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'
  
  // DTOs (Data Transfer Objects)
  export interface CreateWorkspaceDto {
    name: string
    description?: string
    color?: string
  }
  
  export interface UpdateWorkspaceDto {
    name?: string
    description?: string
    color?: string
    avatar_url?: string
  }
  
  export interface InviteMemberDto {
    email: string
    role: Exclude<WorkspaceRole, 'owner'> // No se puede invitar como owner
  }
  
  export interface UpdateMemberRoleDto {
    member_id: string
    role: WorkspaceRole
  }
  
  // Tipos extendidos con relaciones
  export interface WorkspaceWithMembers extends Workspace {
    members: WorkspaceMemberWithUser[]
    member_count: number
  }
  
  export interface WorkspaceMemberWithUser extends WorkspaceMember {
    user: {
      id: string
      email: string
      full_name: string | null
      avatar_url: string | null
    }
  }
  
  export interface InvitationWithWorkspace extends Invitation {
    workspace: {
      id: string
      name: string
      description: string | null
    }
    inviter: {
      id: string
      email: string
      full_name: string | null
    }
  }
  
  // Tipos para el store
  export interface WorkspaceState {
    workspaces: Workspace[]
    currentWorkspace: Workspace | null
    loading: boolean
    error: string | null
    setWorkspaces: (workspaces: Workspace[]) => void
    setCurrentWorkspace: (workspace: Workspace | null) => void
    addWorkspace: (workspace: Workspace) => void
    updateWorkspace: (id: string, updates: Partial<Workspace>) => void
    removeWorkspace: (id: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
  }
  
  // Permisos calculados
  export interface WorkspacePermissions {
    canEdit: boolean
    canDelete: boolean
    canInvite: boolean
    canManageMembers: boolean
    canChangeRoles: boolean
    canRemoveMembers: boolean
  }
  
  // Constantes
  export const WORKSPACE_COLORS = [
    '#6366f1', // Violeta
    '#ec4899', // Rosa
    '#f59e0b', // Amarillo
    '#10b981', // Verde
    '#3b82f6', // Azul
    '#8b5cf6', // Púrpura
    '#f97316', // Naranja
    '#14b8a6', // Teal
  ] as const
  
  export const ROLE_LABELS: Record<WorkspaceRole, string> = {
    owner: 'Propietario',
    admin: 'Administrador',
    member: 'Miembro',
    viewer: 'Observador',
  }
  
  export const ROLE_DESCRIPTIONS: Record<WorkspaceRole, string> = {
    owner: 'Control total del workspace',
    admin: 'Puede gestionar proyectos y miembros',
    member: 'Puede crear y editar tareas',
    viewer: 'Solo puede ver contenido',
  }
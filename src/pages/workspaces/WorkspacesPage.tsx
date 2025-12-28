import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { WorkspaceGrid } from '@/features/workspaces/components/WorkspaceGrid'
import { CreateWorkspaceModal } from '@/features/workspaces/components/CreateWorkspaceModal'
import { useWorkspaces } from '@/features/workspaces'
import type { CreateWorkspaceDto } from '@/features/workspaces'

export function WorkspacesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { workspaces, loading, createWorkspace } = useWorkspaces()

  const handleCreateWorkspace = async (data: CreateWorkspaceDto) => {
    try {
      const newWorkspace = await createWorkspace(data)
      toast.success(`Workspace "${newWorkspace.name}" creado exitosamente`)
    } catch (error: any) {
      console.error('Error creating workspace:', error)
      toast.error(error.message || 'Error al crear workspace')
      throw error // Re-throw para que el modal no se cierre
    }
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <WorkspaceGrid
          workspaces={workspaces}
          loading={loading}
          onCreateClick={() => setIsModalOpen(true)}
        />

        <CreateWorkspaceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateWorkspace}
        />
      </div>
    </AppLayout>
  )
}
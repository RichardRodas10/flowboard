import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { WORKSPACE_COLORS } from '../types/workspace.types'
import type { CreateWorkspaceDto } from '../types/workspace.types'

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es muy largo'),
  description: z.string().max(500, 'La descripción es muy larga').optional(),
  color: z.string().optional(),
})

type FormData = z.infer<typeof createWorkspaceSchema>

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateWorkspaceDto) => Promise<void>
}

export function CreateWorkspaceModal({ isOpen, onClose, onSubmit }: CreateWorkspaceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>(WORKSPACE_COLORS[0])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      color: WORKSPACE_COLORS[0],
    },
  })

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit({
        ...data,
        color: selectedColor,
      })
      reset()
      setSelectedColor(WORKSPACE_COLORS[0])
      onClose()
    } catch (error) {
      // El error se maneja en el componente padre
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      setSelectedColor(WORKSPACE_COLORS[0])
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Crear Workspace</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          {/* Nombre */}
          <Input
            label="Nombre del workspace"
            placeholder="Ej: Mi Empresa, Proyecto Personal"
            error={errors.name?.message}
            disabled={isSubmitting}
            {...register('name')}
          />

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Descripción (opcional)
            </label>
            <textarea
              placeholder="¿De qué trata este workspace?"
              disabled={isSubmitting}
              {...register('description')}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 resize-none"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-error">{errors.description.message}</p>
            )}
          </div>

          {/* Color picker */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Color de identificación
            </label>
            <div className="grid grid-cols-8 gap-2">
              {WORKSPACE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  disabled={isSubmitting}
                  className={`
                    w-10 h-10 rounded-lg transition-all
                    ${selectedColor === color 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-110' 
                      : 'hover:scale-105'
                    }
                    disabled:opacity-50
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {register('name').name || 'Nombre del workspace'}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {register('description').name || 'Sin descripción'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Crear Workspace
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
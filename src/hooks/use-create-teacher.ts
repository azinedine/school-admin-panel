import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { TeacherFormData } from '@/schemas/teacher-form'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface CreateTeacherResponse {
  data: {
    id: number
    name: string
    email: string
  }
  message: string
}

/**
 * Mutation hook for creating a new teacher account
 * Handles API call, cache invalidation, and navigation
 */
export function useCreateTeacher() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: TeacherFormData) => {
      const response = await apiClient.post<CreateTeacherResponse>('/v1/users', data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate users list cache
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users-management'] })
      
      toast.success(`Teacher "${data.data.name}" created successfully`)
      
      // Navigate back to users list
      navigate({ to: '/admin/users' })
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || error.message || 'Failed to create teacher'
      toast.error(message)
    },
  })
}

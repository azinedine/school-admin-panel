import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/store/types'
import { toast } from 'sonner'

interface TeachersResponse {
  data: User[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

export const useTeachers = (page = 1) => {
  return useQuery({
    queryKey: ['teachers', page],
    queryFn: async () => {
      const response = await apiClient.get<TeachersResponse>(`/teachers?page=${page}`)
      return response.data
    },
  })
}

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (teacherId: number) => {
      await apiClient.delete(`/teachers/${teacherId}`)
    },
    onSuccess: () => {
      toast.success('Teacher deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
    onError: () => {
      toast.error('Failed to delete teacher')
    },
  })
}

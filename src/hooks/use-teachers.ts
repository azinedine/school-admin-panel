import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
export interface Teacher {
  id: number
  name: string
  name_ar?: string
  email: string
  phone?: string
  gender?: 'male' | 'female'
  date_of_birth?: string

  institution?: {
    id: number
    name: string
    name_ar?: string
  }
  wilaya?: {
    id: number
    name: string
    name_ar?: string
  }
  municipality?: {
    id: number
    name: string
    name_ar?: string
  }

  teacher_id?: string
  years_of_experience?: number
  employment_status?: string
  weekly_teaching_load?: number
  subjects?: string[]
  levels?: string[]

  created_at: string
}

interface TeachersResponse {
  data: Teacher[]
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
      const response = await apiClient.get<TeachersResponse>(`/v1/teachers?page=${page}`)
      return response.data
    },
  })
}

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (teacherId: number) => {
      await apiClient.delete(`/v1/teachers/${teacherId}`)
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

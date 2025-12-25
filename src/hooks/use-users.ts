import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/store/types'

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface UsersResponse {
  data: User[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface UseUsersParams {
  page?: number
  role?: string
}

export const useUsers = ({ page = 1, role }: UseUsersParams = {}) => {
  return useQuery({
    queryKey: ['users', { page, role }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (role) params.append('role', role)

      const response = await apiClient.get<UsersResponse>(`/v1/users?${params.toString()}`)
      return response.data
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  })
}

interface UpdateUserParams {
  id: number
  data: Partial<User>
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserParams) => {
      const response = await apiClient.put<User>(`/v1/users/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/v1/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

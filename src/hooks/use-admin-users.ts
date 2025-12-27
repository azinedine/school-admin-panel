import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/store/types'

interface AdminUsersParams {
  page?: number
  search?: string
  role?: string
}

interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface AdminUsersResponse {
  data: User[]
  meta: Meta
}

export const useAdminUsers = (params: AdminUsersParams) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: async () => {
      const response = await apiClient.get<AdminUsersResponse>('/v1/admin/users', {
        params,
      })
      return response.data
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new (better UX for pagination)
  })
}

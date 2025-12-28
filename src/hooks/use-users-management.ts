import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/store/types'

/**
 * Pagination metadata from the backend
 */
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

/**
 * Pagination links from the backend
 */
export interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

/**
 * API response structure for users list endpoint
 */
export interface UsersManagementResponse {
  data: User[]
  links: PaginationLinks
  meta: PaginationMeta
}

/**
 * Parameters for the useUsersManagement hook
 */
export interface UseUsersManagementParams {
  page?: number
  role?: string
  limit?: number
}

/**
 * Custom hook for managing and fetching users with pagination and filtering
 * 
 * @param page - Current page number (default: 1)
 * @param role - Filter by user role (optional)
 * @param limit - Items per page (default: 10)
 * 
 * @returns Query object with users data, loading, error states, and pagination info
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, meta } = useUsersManagement({ page: 1 })
 * 
 * if (isLoading) return <LoadingSpinner />
 * if (error) return <ErrorMessage error={error} />
 * 
 * return (
 *   <div>
 *     {data?.data.map(user => (
 *       <UserRow key={user.id} user={user} />
 *     ))}
 *   </div>
 * )
 * ```
 */
export const useUsersManagement = ({ page = 1, role, limit = 10 }: UseUsersManagementParams = {}) => {
  const query = useQuery({
    queryKey: ['users-management', { page, role, limit }],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('per_page', limit.toString())
      if (role) params.append('role', role)


      // Determine endpoint based on user role (Super Admins get enhanced data)
      // We can't use hooks inside this async function, so pass it or check store outside
      // But queryFn is standard async. We can access store via import if not needing reactivity inside fn?
      // Better to check inside the component and pass "endpoint" or "isSuperAdmin" to hook?
      // Actually, easier: just check auth store here directly if possible, OR rely on the hook logic below.

      // Let's use the store state directly from the import since it's outside React render cycle
      const user = (await import('@/store/auth-store').then(m => m.useAuthStore.getState())).user
      const isSuperAdmin = user?.role === 'super_admin'

      const endpoint = isSuperAdmin ? '/v1/super-admin/users' : '/v1/users'

      const response = await apiClient.get<UsersManagementResponse>(`${endpoint}?${params.toString()}`)
      return response.data
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  })

  return {
    ...query,
    users: query.data?.data ?? [],
    meta: query.data?.meta,
    links: query.data?.links,
  }
}

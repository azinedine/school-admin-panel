import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

/**
 * Mutation for suspending a user account
 */
export const useSuspendUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiClient.post(`/v1/users/${userId}/suspend`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate the users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users-management'] })
    },
  })
}

/**
 * Mutation for deleting a user account
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiClient.delete(`/v1/users/${userId}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate the users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users-management'] })
    },
  })
}

/**
 * Mutation for updating user status
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: 'active' | 'inactive' | 'suspended' }) => {
      const response = await apiClient.patch(`/v1/users/${userId}`, { status })
      return response.data
    },
    onSuccess: () => {
      // Invalidate the users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users-management'] })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export interface Role {
  id: number
  name: string
  display_name: string
  description: string | null
  permissions: string[]
  is_system: boolean
  users_count?: number
  created_at: string
  updated_at: string
}

interface RolesResponse {
  data: Role[]
}

interface RoleResponse {
  data: Role
}

interface CreateRoleData {
  name: string
  display_name: string
  description?: string
  permissions?: string[]
}

interface UpdateRoleData {
  name?: string
  display_name?: string
  description?: string
  permissions?: string[]
}

// Fetch all roles
export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await apiClient.get<RolesResponse>('/v1/roles')
      return response.data.data
    },
  })
}

// Fetch single role
export function useRole(id: number) {
  return useQuery<Role>({
    queryKey: ['roles', id],
    queryFn: async () => {
      const response = await apiClient.get<RoleResponse>(`/v1/roles/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

// Create role
export function useCreateRole() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: CreateRoleData) => {
      const response = await apiClient.post<RoleResponse>('/v1/roles', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success(t('common.createSuccess'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}

// Update role
export function useUpdateRole() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRoleData }) => {
      const response = await apiClient.put<RoleResponse>(`/v1/roles/${id}`, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success(t('common.updateSuccess'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}

// Delete role
export function useDeleteRole() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/v1/roles/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success(t('common.deleteSuccess'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}

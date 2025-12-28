import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { isAxiosError, type AxiosError } from 'axios'

import { type RegistrationPayload } from '@/schemas/registration'

interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export const useLogin = () => {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: Record<string, unknown>) => {
      const response = await apiClient.post<AuthResponse>('/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Inject default role if missing from backend
      const userWithRole = { ...data.user, role: data.user.role || 'admin' }
      login(userWithRole, data.access_token)
      // Invalidate user query to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Logged in successfully')
      navigate({ to: '/' })
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })
}

export const useRegister = () => {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: RegistrationPayload) => {
      const response = await apiClient.post<AuthResponse>('/register', credentials)
      return response.data
    },
    onSuccess: (data) => {
      const userWithRole = { ...data.user, role: data.user.role || 'admin' }
      login(userWithRole, data.access_token)
      // Invalidate user query to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Account created successfully')
      navigate({ to: '/' })
    },
    onError: (error: AxiosError<{ message: string }>) => {
        // Handle validation errors key by key if needed, or just show generic message
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message)
    },
  })
}

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/logout')
    },
    onSuccess: () => {
      logout()
      queryClient.clear() // Clear all queries from cache
      toast.success('Logged out successfully')
      navigate({ to: '/login' })
    },
    onError: () => {
        // Even if API fails, we should logout client-side
        logout()
        queryClient.clear()
        navigate({ to: '/login' })
    }
  })
}

import { auth } from '@/lib/api-client'

export const useUser = () => {
  const updateUser = useAuthStore((state) => state.updateUser)
  
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/user')
        // Laravel API with UserResource returns: { data: { id, name, email, ... } }
        // Axios unwraps the HTTP response, so response.data = { data: { user fields } }
        const userData = response.data.data as User
        
        // Sync with auth store
        updateUser(userData)
        return userData
      } catch (error) {
        // If we can't fetch the user profile (likely due to 403/401), logout to prevent loop
        if (isAxiosError(error)) {
          if (error.response?.status === 403 || error.response?.status === 401) {
             useAuthStore.getState().logout()
          }
        }
        throw error
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useDeleteAccount = () => {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await auth.deleteUser()
    },
    onSuccess: () => {
      logout() // Clear local state
      queryClient.clear() // Clear all queries from cache to prevents stale data
      navigate({ to: '/login' })
      toast.success('Account deleted successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Failed to delete account'
      toast.error(message)
    },
  })
}

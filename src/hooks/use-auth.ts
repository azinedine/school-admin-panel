import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export const useLogin = () => {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await apiClient.post<AuthResponse>('/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      // Inject default role if missing from backend
      const userWithRole = { ...data.user, role: data.user.role || 'admin' }
      login(userWithRole, data.access_token)
      toast.success('Logged in successfully')
      navigate({ to: '/' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })
}

export const useRegister = () => {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await apiClient.post<AuthResponse>('/register', credentials)
      return response.data
    },
    onSuccess: (data) => {
      const userWithRole = { ...data.user, role: data.user.role || 'admin' }
      login(userWithRole, data.access_token)
      toast.success('Account created successfully')
      navigate({ to: '/' })
    },
    onError: (error: any) => {
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

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiClient.get<User>('/user')
      return response.data
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

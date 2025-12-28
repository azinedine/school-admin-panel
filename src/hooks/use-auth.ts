/**
 * Auth Mutation Hooks
 * 
 * These hooks handle authentication mutations (login, register, logout).
 * They sync the auth store with server responses and manage query cache.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, auth } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { type RegistrationPayload } from '@/schemas/registration'
import { userKeys } from '@/features/users/api/use-user'

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
      const userWithRole = { ...data.user, role: data.user.role || 'admin' } as User
      login(userWithRole, data.access_token)
      // Set user data in query cache for TanStack Query consumers
      queryClient.setQueryData(userKeys.current(), userWithRole)
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
      const userWithRole = { ...data.user, role: data.user.role || 'admin' } as User
      login(userWithRole, data.access_token)
      // Set user data in query cache
      queryClient.setQueryData(userKeys.current(), userWithRole)
      toast.success('Account created successfully')
      navigate({ to: '/' })
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Registration failed'
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

export const useDeleteAccount = () => {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await auth.deleteUser()
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      navigate({ to: '/login' })
      toast.success('Account deleted successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Failed to delete account'
      toast.error(message)
    },
  })
}

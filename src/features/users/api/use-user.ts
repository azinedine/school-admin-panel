/**
 * User Query Hooks
 * 
 * TanStack Query hooks for user data.
 * These hooks use the userService for API calls.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth-store'
import { userService } from '../services/user.service'
import type { User } from '../types/user.types'

// =============================================================================
// Query Keys
// =============================================================================

export const userKeys = {
    all: ['users'] as const,
    current: () => [...userKeys.all, 'current'] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}

// =============================================================================
// Queries
// =============================================================================

/**
 * Fetch current authenticated user
 */
export function useUser() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    return useQuery({
        queryKey: userKeys.current(),
        queryFn: userService.getCurrentUser,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes garbage collection
        retry: 1,
    })
}

/**
 * Fetch user by ID (admin)
 */
export function useUserById(id: number | undefined) {
    return useQuery({
        queryKey: userKeys.detail(id ?? 0),
        queryFn: () => userService.getUserById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}

// =============================================================================
// Mutations
// =============================================================================

/**
 * Update current user's profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: userService.updateUserProfile,
        onSuccess: (updatedUser) => {
            // Update cache directly for immediate UI update
            queryClient.setQueryData(userKeys.current(), updatedUser)
            toast.success('Profile updated successfully')
        },
        onError: () => {
            toast.error('Failed to update profile')
        },
    })
}

// =============================================================================
// Derived Hooks
// =============================================================================

/**
 * Get user's role
 */
export function useUserRole(): User['role'] | undefined {
    const { data: user } = useUser()
    return user?.role
}

/**
 * Check if user has a specific role
 */
export function useHasRole(role: User['role']): boolean {
    const { data: user } = useUser()
    return user?.role === role
}

/**
 * Check if user has any of the specified roles
 */
export function useHasAnyRole(roles: User['role'][]): boolean {
    const { data: user } = useUser()
    return !!user && roles.includes(user.role)
}

/**
 * Get user display name with RTL support
 */
export function useUserDisplayName(preferArabic = false): string {
    const { data: user } = useUser()
    if (!user) return ''
    if (preferArabic && user.name_ar) return user.name_ar
    return user.name
}

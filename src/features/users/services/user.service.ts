/**
 * User Service
 * 
 * Pure API functions for user-related operations.
 * These are stateless functions that handle HTTP requests.
 */

import { apiClient } from '@/lib/api-client'
import type { User, UpdateUserPayload } from '../types/user.types'

interface UserResponse {
    data: User
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<UserResponse>('/user')
    return response.data.data
}

/**
 * Update current user's profile
 */
export async function updateUserProfile(payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.put<UserResponse>('/user', payload)
    return response.data.data
}

/**
 * Get user by ID (admin only)
 */
export async function getUserById(id: number): Promise<User> {
    const response = await apiClient.get<UserResponse>(`/v1/users/${id}`)
    return response.data.data
}

// Export as namespace for cleaner imports
export const userService = {
    getCurrentUser,
    updateUserProfile,
    getUserById,
}

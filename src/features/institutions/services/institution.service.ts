/**
 * Institution Service
 * 
 * Pure API functions for institution-related operations.
 */

import { apiClient } from '@/lib/api-client'
import type { Institution, InstitutionFilters, PaginatedInstitutions } from '../types/institution.types'

interface InstitutionResponse {
    success: boolean
    data: Institution
}

/**
 * Get institution by ID
 */
export async function getInstitution(id: number): Promise<Institution> {
    const response = await apiClient.get<InstitutionResponse>(`/v1/institutions/${id}`)
    return response.data.data
}

/**
 * Get paginated list of institutions with filters
 */
export async function getInstitutions(filters: InstitutionFilters = {}): Promise<PaginatedInstitutions> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            params.append(key, String(value))
        }
    })
    const response = await apiClient.get<PaginatedInstitutions>(`/v1/institutions?${params.toString()}`)
    return response.data
}

/**
 * Get institutions for a specific user
 * For users with multiple institution access
 */
export async function getUserInstitutions(userId: number): Promise<Institution[]> {
    const response = await apiClient.get<{ data: Institution[] }>(`/v1/users/${userId}/institutions`)
    return response.data.data
}

// Export as namespace
export const institutionService = {
    getInstitution,
    getInstitutions,
    getUserInstitutions,
}

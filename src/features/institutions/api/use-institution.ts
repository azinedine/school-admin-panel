/**
 * Institution Query Hook
 * 
 * Fetch single institution by ID.
 */

import { useQuery } from '@tanstack/react-query'
import { institutionService } from '../services/institution.service'
import type { Institution } from '../types/institution.types'

// =============================================================================
// Query Keys
// =============================================================================

export const institutionKeys = {
    all: ['institutions'] as const,
    lists: () => [...institutionKeys.all, 'list'] as const,
    list: (filters: object) => [...institutionKeys.lists(), filters] as const,
    details: () => [...institutionKeys.all, 'detail'] as const,
    detail: (id: number) => [...institutionKeys.details(), id] as const,
    user: (userId: number) => [...institutionKeys.all, 'user', userId] as const,
}

// =============================================================================
// Queries
// =============================================================================

/**
 * Fetch single institution by ID
 */
export function useInstitution(id: number | undefined) {
    return useQuery({
        queryKey: institutionKeys.detail(id ?? 0),
        queryFn: () => institutionService.getInstitution(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        select: (data): Institution => data, // Transform if needed
    })
}

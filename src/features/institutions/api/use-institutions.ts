/**
 * Institutions List Query Hook
 * 
 * Fetch paginated list of institutions.
 */

import { useQuery } from '@tanstack/react-query'
import { institutionService } from '../services/institution.service'
import { institutionKeys } from './use-institution'
import type { InstitutionFilters, Institution } from '../types/institution.types'

/**
 * Fetch paginated list of institutions with filters
 */
export function useInstitutions(
    filters: InstitutionFilters = {},
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: institutionKeys.list(filters),
        queryFn: () => institutionService.getInstitutions(filters),
        enabled: options?.enabled ?? true,
        staleTime: 2 * 60 * 1000, // 2 minutes
        // Use select to transform data before reaching component
        select: (response) => ({
            institutions: response.data,
            meta: response.meta,
        }),
    })
}

/**
 * Fetch institutions and return just the array (simplified)
 */
export function useInstitutionsList(filters: InstitutionFilters = {}) {
    return useQuery({
        queryKey: institutionKeys.list(filters),
        queryFn: () => institutionService.getInstitutions(filters),
        staleTime: 2 * 60 * 1000,
        select: (response): Institution[] => response.data, // Only return array
    })
}

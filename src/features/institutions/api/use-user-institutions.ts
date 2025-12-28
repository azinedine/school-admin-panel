/**
 * User Institutions Query Hook
 * 
 * DEPENDENT QUERY: Only runs when userId is available.
 * Fetches institutions associated with the current user.
 */

import { useQuery } from '@tanstack/react-query'
import { institutionService } from '../services/institution.service'
import { institutionKeys } from './use-institution'
import { useUser } from '@/features/users/api/use-user'
import type { Institution } from '../types/institution.types'

/**
 * Fetch institutions for current user
 * 
 * This is a DEPENDENT QUERY:
 * - Waits for user data to load first
 * - Only enabled when userId is available
 * - Uses select to filter/transform data
 */
export function useUserInstitutions() {
    const { data: user } = useUser()

    return useQuery({
        queryKey: institutionKeys.user(user?.id ?? 0),
        queryFn: () => institutionService.getUserInstitutions(user!.id),
        // DEPENDENT: Only runs when user is loaded
        enabled: !!user?.id,
        staleTime: 10 * 60 * 1000, // 10 minutes - institutions don't change often
        // SELECT: Transform data before reaching component
        select: (data): Institution[] => data.filter((i) => i.is_active),
    })
}

/**
 * Fetch user's primary institution
 * Uses the institution_id from user profile
 */
export function useUserPrimaryInstitution() {
    const { data: user } = useUser()

    return useQuery({
        queryKey: institutionKeys.detail(user?.institution_id ?? 0),
        queryFn: () => institutionService.getInstitution(user!.institution_id!),
        enabled: !!user?.institution_id,
        staleTime: 10 * 60 * 1000,
    })
}

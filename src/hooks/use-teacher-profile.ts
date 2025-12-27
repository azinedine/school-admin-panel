import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { safeValidateTeacherProfile, type TeacherProfile } from '@/schemas/teacher-profile'
import { toast } from 'sonner'

interface TeacherProfileResponse {
  data: TeacherProfile
}

/**
 * TanStack Query hook for fetching teacher profile
 * 
 * Features:
 * - API response validation with Zod
 * - Automatic caching and background refetch
 * - Error handling with toast notifications
 * - Type-safe response data
 */
export function useTeacherProfile() {
  return useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async (): Promise<TeacherProfile> => {
      const response = await apiClient.get<TeacherProfileResponse>('/user')
      
      // Validate API response before returning
      const validation = safeValidateTeacherProfile(response.data.data)
      
      if (!validation.success) {
        console.error('Teacher profile validation failed:', validation.error)
        toast.error('Invalid profile data received from server')
        throw new Error('Profile data validation failed')
      }
      
      return validation.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Query key factory for consistent keys across the app
 */
export const teacherProfileKeys = {
  all: ['teacher-profile'] as const,
  byId: (id: number) => ['teacher-profile', id] as const,
}

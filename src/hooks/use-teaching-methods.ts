import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface TeachingMethod {
    id: number
    name: string
    name_ar: string
}

// Fetch teaching methods
export function useTeachingMethods() {
    return useQuery<TeachingMethod[]>({
        queryKey: ['teaching-methods'],
        queryFn: async () => {
            const response = await apiClient.get<any>('/v1/teaching-methods')
            if (Array.isArray(response.data)) {
                return response.data
            }
            return response.data.data || []
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })
}

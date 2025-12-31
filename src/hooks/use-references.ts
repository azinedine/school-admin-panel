import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface Reference {
    id: number
    name: string
    name_ar: string
}

// Fetch references
export function useReferences() {
    return useQuery<Reference[]>({
        queryKey: ['references'],
        queryFn: async () => {
            const response = await apiClient.get<any>('/v1/references')
            if (Array.isArray(response.data)) {
                return response.data
            }
            return response.data.data || []
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })
}

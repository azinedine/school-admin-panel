import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface Material {
    id: number
    name: string
    name_ar: string
}

// Fetch materials
export function useMaterials() {
    return useQuery<Material[]>({
        queryKey: ['materials'],
        queryFn: async () => {
            const response = await apiClient.get<any>('/v1/materials')
            if (Array.isArray(response.data)) {
                return response.data
            }
            return response.data.data || []
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })
}

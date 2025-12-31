import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface LearningObjective {
    id: number
    name: string
    name_ar: string
}

// Fetch learning objectives
export function useLearningObjectives() {
    return useQuery<LearningObjective[]>({
        queryKey: ['learning-objectives'],
        queryFn: async () => {
            const response = await apiClient.get<any>('/v1/learning-objectives')
            if (Array.isArray(response.data)) {
                return response.data
            }
            return response.data.data || []
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })
}

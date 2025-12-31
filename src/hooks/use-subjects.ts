import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface Subject {
  id: number
  name: string
  name_ar: string
}

export interface Level {
  id: number
  name: string
}

interface SubjectsResponse {
  data: Subject[]
}

interface LevelsResponse {
  data: Level[]
}

// Fetch subjects
export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/v1/subjects')
      if (Array.isArray(response.data)) {
        return response.data
      }
      return response.data.data || []
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Fetch levels/classes
export function useLevels() {
  return useQuery<Level[]>({
    queryKey: ['levels'],
    queryFn: async () => {
      const response = await apiClient.get<any>('/v1/levels')
      if (Array.isArray(response.data)) {
        return response.data
      }
      return response.data.data || []
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

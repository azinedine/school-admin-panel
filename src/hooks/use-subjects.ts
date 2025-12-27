import { useQuery } from '@tanstack/react-query'
import { subjectsList, classesList } from '@/data/mock-locations'

export interface Subject {
  id: string
  name: string
  nameAr: string
}

export interface Level {
  id: string
  name: string
}

// Fetch subjects
export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(subjectsList), 500)
      })
    },
    staleTime: Infinity, // Static data for now
  })
}

// Fetch levels/classes
export function useLevels() {
  return useQuery<Level[]>({
    queryKey: ['levels'],
    queryFn: async () => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(classesList), 500)
      })
    },
    staleTime: Infinity,
  })
}

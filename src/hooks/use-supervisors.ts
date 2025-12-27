import { useQuery } from "@tanstack/react-query"

export interface Supervisor {
  id: string
  name: string
  position: string
}

// Mock data
const mockSupervisors: Supervisor[] = [
  { id: '1', name: 'Dr. Sarah Smith', position: 'Principal' },
  { id: '2', name: 'Mr. John Doe', position: 'Vice Principal' },
  { id: '3', name: 'Mrs. Emily Brown', position: 'Head of Administration' },
]

export function useSupervisors() {
  return useQuery({
    queryKey: ['supervisors'],
    queryFn: async (): Promise<Supervisor[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockSupervisors
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

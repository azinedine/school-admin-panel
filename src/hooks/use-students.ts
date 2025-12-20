import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

/**
 * Student type definition
 * Adjust this according to your actual API response
 */
export interface Student {
  id: number
  name: string
  email: string
  grade?: string
  class?: string
  enrollmentDate?: string
}

/**
 * Fetch all students from the API
 */
const fetchStudents = async (): Promise<Student[]> => {
  const response = await apiClient.get<Student[]>('/students')
  return response.data
}

/**
 * Hook to fetch all students
 * 
 * @example
 * ```tsx
 * function StudentsPage() {
 *   const { data, isLoading, error } = useStudents()
 *   
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   
 *   return (
 *     <div>
 *       {data?.map(student => (
 *         <div key={student.id}>{student.name}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  })
}

/**
 * Fetch a single student by ID
 */
const fetchStudent = async (id: number): Promise<Student> => {
  const response = await apiClient.get<Student>(`/students/${id}`)
  return response.data
}

/**
 * Hook to fetch a single student by ID
 * 
 * @param id - Student ID
 * @param enabled - Whether the query should run (default: true)
 */
export function useStudent(id: number, enabled = true) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => fetchStudent(id),
    enabled: enabled && !!id,
  })
}

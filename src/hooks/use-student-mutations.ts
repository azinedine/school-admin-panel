import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Student } from './use-students'

/**
 * Input type for creating a new student
 */
export interface CreateStudentInput {
  name: string
  email: string
  grade?: string
  class?: string
}

/**
 * Create a new student
 */
const createStudent = async (input: CreateStudentInput): Promise<Student> => {
  const response = await apiClient.post<Student>('/students', input)
  return response.data
}

/**
 * Hook to create a new student with optimistic updates
 * 
 * @example
 * ```tsx
 * function CreateStudentForm() {
 *   const createMutation = useCreateStudent()
 *   
 *   const handleSubmit = (data: CreateStudentInput) => {
 *     createMutation.mutate(data, {
 *       onSuccess: () => {
 *         console.log('Student created successfully!')
 *       },
 *       onError: (error) => {
 *         console.error('Failed to create student:', error)
 *       }
 *     })
 *   }
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {createMutation.isPending && <div>Creating...</div>}
 *       {createMutation.isError && <div>Error: {createMutation.error.message}</div>}
 *       // ... form fields
 *     </form>
 *   )
 * }
 * ```
 */
export function useCreateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

/**
 * Update an existing student
 */
const updateStudent = async ({ id, data }: { id: number; data: Partial<Student> }): Promise<Student> => {
  const response = await apiClient.put<Student>(`/students/${id}`, data)
  return response.data
}

/**
 * Hook to update a student
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateStudent,
    onSuccess: (_, variables) => {
      // Invalidate both the list and the individual student query
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['students', variables.id] })
    },
  })
}

/**
 * Delete a student
 */
const deleteStudent = async (id: number): Promise<void> => {
  await apiClient.delete(`/students/${id}`)
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

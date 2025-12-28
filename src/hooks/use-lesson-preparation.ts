import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import type { LessonPreparation, LessonPreparationFormData } from '@/schemas/lesson-preparation'

/**
 * Query key factory for lesson preparations
 * Follows the pattern from the project
 */
export const lessonPrepKeys = {
  all: ['lessonPreps'] as const,
  lists: () => [...lessonPrepKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...lessonPrepKeys.lists(), { ...filters }] as const,
  details: () => [...lessonPrepKeys.all, 'detail'] as const,
  detail: (id: number) => [...lessonPrepKeys.details(), id] as const,
}

/**
 * Fetch all lesson preparations for the current teacher
 */
const fetchLessonPreps = async (filters?: {
  class?: string
  subject?: string
  status?: string
}): Promise<LessonPreparation[]> => {
  const response = await apiClient.get<LessonPreparation[]>(
    '/v1/lesson-preparations',
    { params: filters }
  )
  return response.data
}

/**
 * Fetch a single lesson preparation
 */
const fetchLessonPrepDetail = async (id: number): Promise<LessonPreparation> => {
  const response = await apiClient.get<LessonPreparation>(`/v1/lesson-preparations/${id}`)
  return response.data
}

/**
 * Create a new lesson preparation
 */
const createLessonPrep = async (data: LessonPreparationFormData): Promise<LessonPreparation> => {
  const response = await apiClient.post<LessonPreparation>(
    '/v1/lesson-preparations',
    data
  )
  return response.data
}

/**
 * Update an existing lesson preparation
 */
const updateLessonPrep = async (id: number, data: Partial<LessonPreparationFormData>): Promise<LessonPreparation> => {
  const response = await apiClient.put<LessonPreparation>(
    `/v1/lesson-preparations/${id}`,
    data
  )
  return response.data
}

/**
 * Delete a lesson preparation
 */
const deleteLessonPrep = async (id: number): Promise<void> => {
  await apiClient.delete(`/v1/lesson-preparations/${id}`)
}

/**
 * Hook to fetch all lesson preparations
 * Supports filtering by class, subject, and status
 *
 * @example
 * ```tsx
 * function LessonPrepPage() {
 *   const { data: preps, isLoading, error } = useLessonPreps({
 *     class: '10-A',
 *     status: 'draft'
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error loading preparations</div>
 *
 *   return (
 *     <div>
 *       {preps?.map(prep => (
 *         <div key={prep.id}>{prep.title}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLessonPreps(filters?: {
  class?: string
  subject?: string
  status?: string
}) {
  return useQuery({
    queryKey: lessonPrepKeys.list(filters),
    queryFn: () => fetchLessonPreps(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single lesson preparation
 *
 * @example
 * ```tsx
 * function EditLessonPrepPage({ id }: { id: number }) {
 *   const { data: prep, isLoading } = useLessonPrepDetail(id)
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return <LessonPrepForm initialData={prep} />
 * }
 * ```
 */
export function useLessonPrepDetail(id: number) {
  return useQuery({
    queryKey: lessonPrepKeys.detail(id),
    queryFn: () => fetchLessonPrepDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to create a new lesson preparation
 *
 * @example
 * ```tsx
 * function CreateLessonPrepForm() {
 *   const { mutate, isPending } = useCreateLessonPrep()
 *
 *   const handleSubmit = (data: LessonPreparationFormData) => {
 *     mutate(data, {
 *       onSuccess: () => {
 *         navigate({ to: '/teacher/lessons/preparation' })
 *       }
 *     })
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */
export function useCreateLessonPrep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLessonPrep,
    onSuccess: (newPrep) => {
      // Invalidate the list to refetch
      queryClient.invalidateQueries({
        queryKey: lessonPrepKeys.lists(),
      })

      // Optionally add to cache for immediate UI update
      queryClient.setQueryData(lessonPrepKeys.detail(newPrep.id), newPrep)

      toast.success('Lesson preparation created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create lesson preparation')
      console.error('Create lesson prep error:', error)
    },
  })
}

/**
 * Hook to update an existing lesson preparation
 *
 * @example
 * ```tsx
 * function EditLessonPrepForm({ id, initialData }: { id: number, initialData: LessonPreparation }) {
 *   const { mutate, isPending } = useUpdateLessonPrep(id)
 *
 *   const handleSubmit = (data: LessonPreparationFormData) => {
 *     mutate(data, {
 *       onSuccess: () => {
 *         navigate({ to: '/teacher/lessons/preparation' })
 *       }
 *     })
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */
export function useUpdateLessonPrep(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<LessonPreparationFormData>) => updateLessonPrep(id, data),
    onSuccess: (updatedPrep) => {
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: lessonPrepKeys.lists(),
      })

      // Update the detail cache
      queryClient.setQueryData(lessonPrepKeys.detail(id), updatedPrep)

      toast.success('Lesson preparation updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update lesson preparation')
      console.error('Update lesson prep error:', error)
    },
  })
}

/**
 * Hook to delete a lesson preparation
 *
 * @example
 * ```tsx
 * function LessonPrepTable({ preps }: { preps: LessonPreparation[] }) {
 *   const { mutate, isPending } = useDeleteLessonPrep()
 *
 *   const handleDelete = (id: number) => {
 *     if (confirm('Are you sure?')) {
 *       mutate(id)
 *     }
 *   }
 *
 *   return (
 *     <table>
 *       {preps.map(prep => (
 *         <tr key={prep.id}>
 *           <td>{prep.title}</td>
 *           <td>
 *             <button onClick={() => handleDelete(prep.id)}>
 *               {isPending ? 'Deleting...' : 'Delete'}
 *             </button>
 *           </td>
 *         </tr>
 *       ))}
 *     </table>
 *   )
 * }
 * ```
 */
export function useDeleteLessonPrep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLessonPrep,
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: lessonPrepKeys.lists(),
      })

      toast.success('Lesson preparation deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete lesson preparation')
      console.error('Delete lesson prep error:', error)
    },
  })
}

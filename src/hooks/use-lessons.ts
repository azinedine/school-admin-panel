import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import type { Lesson, LessonFormData, LessonFilters } from '@/schemas/lesson'
import { isLessonDuplicate } from '@/schemas/lesson'

/**
 * Query key factory for lessons
 * Follows the same pattern as lesson preparations
 */
export const lessonKeys = {
    all: ['lessons'] as const,
    lists: () => [...lessonKeys.all, 'list'] as const,
    list: (filters?: LessonFilters) =>
        [...lessonKeys.lists(), { ...filters }] as const,
    details: () => [...lessonKeys.all, 'detail'] as const,
    detail: (id: number) => [...lessonKeys.details(), id] as const,
    statistics: () => [...lessonKeys.all, 'statistics'] as const,
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch all lessons with optional filters
 */
const fetchLessons = async (filters?: LessonFilters): Promise<Lesson[]> => {
    const response = await apiClient.get<{ data: Lesson[] }>('/v1/lessons', {
        params: filters,
    })
    // Handle both paginated and non-paginated responses
    return Array.isArray(response.data) ? response.data : response.data.data
}

/**
 * Fetch a single lesson by ID
 */
const fetchLessonDetail = async (id: number): Promise<Lesson> => {
    const response = await apiClient.get<Lesson>(`/v1/lessons/${id}`)
    return response.data
}

/**
 * Create a new lesson
 */
const createLesson = async (data: LessonFormData): Promise<Lesson> => {
    const response = await apiClient.post<Lesson>('/v1/lessons', data)
    return response.data
}

/**
 * Update an existing lesson
 */
const updateLesson = async (
    id: number,
    data: Partial<LessonFormData>
): Promise<Lesson> => {
    const response = await apiClient.put<Lesson>(`/v1/lessons/${id}`, data)
    return response.data
}

/**
 * Delete a lesson
 */
const deleteLesson = async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/lessons/${id}`)
}

/**
 * Fetch lesson statistics
 */
const fetchLessonStatistics = async (): Promise<{
    total: number
    draft: number
    published: number
}> => {
    const response = await apiClient.get('/v1/lessons/statistics/summary')
    return response.data
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to fetch all lessons with optional filters
 *
 * @example
 * const { data: lessons, isLoading } = useLessons({
 *   status: 'published',
 *   class_name: '10-A'
 * })
 */
export function useLessons(filters?: LessonFilters) {
    return useQuery({
        queryKey: lessonKeys.list(filters),
        queryFn: () => fetchLessons(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook to fetch a single lesson by ID
 *
 * @example
 * const { data: lesson, isLoading } = useLessonDetail(lessonId)
 */
export function useLessonDetail(id: number) {
    return useQuery({
        queryKey: lessonKeys.detail(id),
        queryFn: () => fetchLessonDetail(id),
        enabled: !!id && id > 0,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to fetch lesson statistics
 */
export function useLessonStatistics() {
    return useQuery({
        queryKey: lessonKeys.statistics(),
        queryFn: fetchLessonStatistics,
        staleTime: 5 * 60 * 1000,
    })
}

/**
 * Hook to create a new lesson
 * Includes duplicate check and Arabic error message
 *
 * @example
 * const { mutate, isPending } = useCreateLesson()
 * mutate(formData, {
 *   onSuccess: () => navigate({ to: '/teacher/lessons' })
 * })
 */
export function useCreateLesson() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: LessonFormData) => {
            // Check for duplicates before creating
            const existingLessons = queryClient.getQueryData<Lesson[]>(
                lessonKeys.list()
            )

            if (existingLessons && isLessonDuplicate(data, existingLessons)) {
                throw new Error('DUPLICATE_LESSON')
            }

            return createLesson(data)
        },
        onSuccess: (newLesson) => {
            // Invalidate the list to refetch
            queryClient.invalidateQueries({
                queryKey: lessonKeys.lists(),
            })

            // Invalidate statistics
            queryClient.invalidateQueries({
                queryKey: lessonKeys.statistics(),
            })

            // Add to cache
            queryClient.setQueryData(lessonKeys.detail(newLesson.id), newLesson)

            toast.success('تم إنشاء الدرس بنجاح')
        },
        onError: (error: Error) => {
            if (error.message === 'DUPLICATE_LESSON') {
                toast.error('لا يمكن إضافة درس تم إضافته من قبل')
            } else {
                toast.error('فشل في إنشاء الدرس')
                console.error('Create lesson error:', error)
            }
        },
    })
}

/**
 * Hook to update an existing lesson
 *
 * @example
 * const { mutate, isPending } = useUpdateLesson(lessonId)
 * mutate(updatedData)
 */
export function useUpdateLesson(id: number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<LessonFormData>) => updateLesson(id, data),
        onSuccess: (updatedLesson) => {
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: lessonKeys.lists(),
            })

            // Invalidate statistics
            queryClient.invalidateQueries({
                queryKey: lessonKeys.statistics(),
            })

            // Update the detail cache
            queryClient.setQueryData(lessonKeys.detail(id), updatedLesson)

            toast.success('تم تحديث الدرس بنجاح')
        },
        onError: (error) => {
            toast.error('فشل في تحديث الدرس')
            console.error('Update lesson error:', error)
        },
    })
}

/**
 * Hook to delete a lesson
 *
 * @example
 * const { mutate, isPending } = useDeleteLesson()
 * mutate(lessonId)
 */
export function useDeleteLesson() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteLesson,
        onSuccess: (_, deletedId) => {
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: lessonKeys.lists(),
            })

            // Invalidate statistics
            queryClient.invalidateQueries({
                queryKey: lessonKeys.statistics(),
            })

            // Remove from cache
            queryClient.removeQueries({
                queryKey: lessonKeys.detail(deletedId),
            })

            toast.success('تم حذف الدرس بنجاح')
        },
        onError: (error) => {
            toast.error('فشل في حذف الدرس')
            console.error('Delete lesson error:', error)
        },
    })
}

/**
 * Custom hook to check if a lesson already exists
 * Useful for form validation
 */
export function useCheckLessonExists() {
    const { data: lessons } = useLessons()

    return (data: LessonFormData): boolean => {
        if (!lessons) return false
        return isLessonDuplicate(data, lessons)
    }
}

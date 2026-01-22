/**
 * Weekly Reviews API Hooks
 *
 * React Query hooks for weekly review tracking operations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type {
    WeeklyReviewSummaryResponse,
    WeeklyReview,
    BatchCreateWeeklyReviewsRequest,
    UpdateWeeklyReviewRequest,
} from '../types'
import { getCurrentISOWeek } from '../types'

// Query Keys
export const weeklyReviewKeys = {
    all: ['weekly-reviews'] as const,
    summary: (classId: string) => [...weeklyReviewKeys.all, 'summary', classId] as const,
    list: (classId: string, filters?: Record<string, unknown>) =>
        [...weeklyReviewKeys.all, 'list', classId, filters] as const,
    detail: (id: number) => [...weeklyReviewKeys.all, 'detail', id] as const,
}

// ============ Summary Endpoint ============

/**
 * Hook to fetch weekly review summary for a class.
 * This is the main hook used by the Grades table.
 *
 * Returns aggregated review status per student for current/last week.
 */
export function useWeeklyReviewSummary(classId: string) {
    const { year, week } = getCurrentISOWeek()

    return useQuery({
        queryKey: weeklyReviewKeys.summary(classId),
        queryFn: async () => {
            const { data } = await apiClient.get<{ data: WeeklyReviewSummaryResponse }>(
                `/v1/grade-classes/${classId}/weekly-reviews/summary`
            )
            return data.data
        },
        enabled: !!classId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Refetch when week changes (e.g., user returns after weekend)
        refetchOnMount: true,
    })
}

// ============ List Endpoint ============

/**
 * Hook to fetch all reviews for a class (paginated, filterable).
 */
export function useWeeklyReviews(
    classId: string,
    filters?: {
        year?: number
        week?: number
        student_id?: string
        pending_only?: boolean
    }
) {
    return useQuery({
        queryKey: weeklyReviewKeys.list(classId, filters),
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters?.year) params.append('year', filters.year.toString())
            if (filters?.week) params.append('week', filters.week.toString())
            if (filters?.student_id) params.append('student_id', filters.student_id)
            if (filters?.pending_only) params.append('pending_only', '1')

            const { data } = await apiClient.get<{ data: WeeklyReview[] }>(
                `/v1/grade-classes/${classId}/weekly-reviews?${params.toString()}`
            )
            return data.data
        },
        enabled: !!classId,
    })
}

// ============ Batch Create/Update ============

/**
 * Hook to batch create or update weekly reviews.
 */
export function useBatchCreateWeeklyReviews() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            classId,
            ...request
        }: BatchCreateWeeklyReviewsRequest & { classId: string }) => {
            const { data } = await apiClient.post<{ data: WeeklyReview[]; message: string }>(
                `/v1/grade-classes/${classId}/weekly-reviews/batch`,
                request
            )
            return data.data
        },
        onSuccess: (_, variables) => {
            // Invalidate summary and list queries for this class
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.summary(variables.classId),
            })
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.list(variables.classId),
            })
        },
    })
}

// ============ Update Single Review ============

/**
 * Hook to update a single weekly review.
 */
export function useUpdateWeeklyReview() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            reviewId,
            classId,
            ...request
        }: UpdateWeeklyReviewRequest & { reviewId: number; classId: string }) => {
            const { data } = await apiClient.put<{ data: WeeklyReview }>(
                `/v1/weekly-reviews/${reviewId}`,
                request
            )
            return data.data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.summary(variables.classId),
            })
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.list(variables.classId),
            })
        },
    })
}

// ============ Resolve Alert ============

/**
 * Hook to mark a review's alert as resolved.
 */
export function useResolveWeeklyReviewAlert() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ reviewId, classId }: { reviewId: number; classId: string }) => {
            const { data } = await apiClient.post<{ data: WeeklyReview }>(
                `/v1/weekly-reviews/${reviewId}/resolve`
            )
            return data.data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.summary(variables.classId),
            })
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.list(variables.classId),
            })
        },
    })
}

// ============ Delete Review ============

/**
 * Hook to delete a weekly review.
 */
export function useDeleteWeeklyReview() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ reviewId, classId }: { reviewId: number; classId: string }) => {
            await apiClient.delete(`/v1/weekly-reviews/${reviewId}`)
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.summary(variables.classId),
            })
            queryClient.invalidateQueries({
                queryKey: weeklyReviewKeys.list(variables.classId),
            })
        },
    })
}

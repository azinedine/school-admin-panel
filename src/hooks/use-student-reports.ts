import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { StudentReport, StudentReportFormValues } from '@/schemas/student-report-schema'
import { gradeKeys } from '@/features/grades'

export const reportKeys = {
    all: ['student-reports'] as const,
    lists: () => [...reportKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...reportKeys.lists(), { ...filters }] as const,
    details: () => [...reportKeys.all, 'detail'] as const,
    detail: (id: number) => [...reportKeys.details(), id] as const,
}

// Fetch Reports List
export function useStudentReports(filters: { student_id?: string; class_id?: string } = {}) {
    return useQuery({
        queryKey: reportKeys.list(filters),
        queryFn: async () => {
            const { data } = await apiClient.get<{ data: StudentReport[] }>('/v1/student-reports', { params: filters })
            return data.data
        },
    })
}

// Fetch Single Report
export function useStudentReport(id: number) {
    return useQuery({
        queryKey: reportKeys.detail(id),
        queryFn: async () => {
            const { data } = await apiClient.get<{ data: StudentReport }>(`/v1/student-reports/${id}`)
            return data.data
        },
        enabled: !!id,
    })
}

// Create Report
export function useCreateStudentReport() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: StudentReportFormValues) => {
            const { data: response } = await apiClient.post<{ data: StudentReport }>('/v1/student-reports', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
            // Also invalidate grades to refresh reports_count indicator
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

// Update Report
export function useUpdateStudentReport() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<StudentReportFormValues> }) => {
            const { data: response } = await apiClient.put<{ data: StudentReport }>(`/v1/student-reports/${id}`, data)
            return response.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
            queryClient.invalidateQueries({ queryKey: reportKeys.detail(data.id) })
        },
    })
}

// Delete Report
export function useDeleteStudentReport() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/v1/student-reports/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
            // Also invalidate grades to refresh reports_count indicator
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

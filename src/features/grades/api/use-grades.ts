/**
 * Grades API Hooks
 * 
 * React Query hooks for grades management CRUD operations.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type {
    GradeClass,
    GradeStudent,
    CreateGradeClassRequest,
    UpdateGradeClassRequest,
    CreateStudentRequest,
    BatchCreateStudentsRequest,
    UpdateStudentRequest,
    UpdateGradeRequest,
    BatchUpdateGradesRequest,
    ReorderStudentsRequest,
    MoveStudentRequest,
} from '../types'

// Query Keys
export const gradeKeys = {
    all: ['grades'] as const,
    classes: (year?: string) => [...gradeKeys.all, 'classes', year] as const,
    class: (id: string) => [...gradeKeys.all, 'class', id] as const,
    students: (classId: string, term: number) => [...gradeKeys.all, 'students', classId, term] as const,
}

// ============ Grade Classes ============

export function useGradeClasses(year?: string) {
    return useQuery({
        queryKey: gradeKeys.classes(year),
        queryFn: async () => {
            const params = year ? { year } : {}
            const { data } = await apiClient.get<{ data: GradeClass[] }>('/v1/grade-classes', { params })
            return data.data
        },
    })
}

export function useGradeClass(id: string) {
    return useQuery({
        queryKey: gradeKeys.class(id),
        queryFn: async () => {
            const { data } = await apiClient.get<{ data: GradeClass }>(`/v1/grade-classes/${id}`)
            return data.data
        },
        enabled: !!id,
    })
}

export function useCreateGradeClass() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: CreateGradeClassRequest) => {
            const { data } = await apiClient.post<{ data: GradeClass }>('/v1/grade-classes', request)
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useUpdateGradeClass() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...request }: UpdateGradeClassRequest & { id: string }) => {
            const { data } = await apiClient.put<{ data: GradeClass }>(`/v1/grade-classes/${id}`, request)
            return data.data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.class(variables.id) })
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useDeleteGradeClass() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/v1/grade-classes/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

// ============ Grade Students ============

export function useGradeStudents(classId: string, term: number) {
    return useQuery({
        queryKey: gradeKeys.students(classId, term),
        queryFn: async () => {
            const { data } = await apiClient.get<{ data: GradeStudent[] }>(
                `/v1/grade-classes/${classId}/students`,
                { params: { term } }
            )
            return data.data
        },
        enabled: !!classId,
    })
}

export function useCreateStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ classId, ...request }: CreateStudentRequest & { classId: string }) => {
            const { data } = await apiClient.post<{ data: GradeStudent }>(
                `/v1/grade-classes/${classId}/students`,
                request
            )
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useBatchCreateStudents() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ classId, students }: BatchCreateStudentsRequest & { classId: string }) => {
            const { data } = await apiClient.post<{ data: GradeStudent[] }>(
                `/v1/grade-classes/${classId}/students/batch`,
                { students }
            )
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useUpdateStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ studentId, ...request }: UpdateStudentRequest & { studentId: string }) => {
            const { data } = await apiClient.put<{ data: GradeStudent }>(
                `/v1/grade-students/${studentId}`,
                request
            )
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useDeleteStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (studentId: string) => {
            await apiClient.delete(`/v1/grade-students/${studentId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useMoveStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ studentId, ...request }: MoveStudentRequest & { studentId: string }) => {
            const { data } = await apiClient.post<{ data: GradeStudent }>(
                `/v1/grade-students/${studentId}/move`,
                request
            )
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useReorderStudents() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ classId, order }: ReorderStudentsRequest & { classId: string }) => {
            await apiClient.post(`/v1/grade-classes/${classId}/students/reorder`, { order })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

// ============ Student Grades ============

export function useUpdateGrade() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ studentId, ...request }: UpdateGradeRequest & { studentId: string }) => {
            const { data } = await apiClient.put(`/v1/grade-students/${studentId}/grades`, request)
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

export function useBatchUpdateGrades() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: BatchUpdateGradesRequest) => {
            const { data } = await apiClient.post('/v1/grades/batch', request)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gradeKeys.all })
        },
    })
}

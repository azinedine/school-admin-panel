import { useCallback } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import {
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent,
    useMoveStudent,
    useReorderStudents,
    useUpdateGrade
} from '@/features/grades'
import type { StudentGrade } from '../types'

/**
 * Hook to manage API mutations and side effects.
 *
 * Responsibility:
 * - Wraps React Query mutations.
 * - Handles success/error toasts.
 * - keeping UI logic clean of API details.
 */
export function useGradeMutations(classId: string, term: string) {
    const { t } = useTranslation()
    const createStudentMutation = useCreateStudent()
    const updateStudentMutation = useUpdateStudent()
    const deleteStudentMutation = useDeleteStudent()
    const moveStudentMutation = useMoveStudent()
    const reorderStudentsMutation = useReorderStudents()
    const updateGradeMutation = useUpdateGrade()

    const handleCreateStudent = useCallback((student: Partial<StudentGrade>) => new Promise<boolean>((resolve) => {
        // Map camelCase to snake_case for API
        const apiRequest: { classId: string; student_number?: string; last_name: string; first_name: string; date_of_birth?: string; special_case?: string | null } = {
            classId: student.classId || classId,
            student_number: student.id || undefined, // Use id as student_number
            last_name: student.lastName || '',
            first_name: student.firstName || '',
            date_of_birth: student.dateOfBirth,
            special_case: student.specialCase || null
        }

        // Basic validation
        if (!apiRequest.last_name || !apiRequest.first_name || !apiRequest.classId) {
            toast.error(t('pages.grades.toast.createError'))
            resolve(false)
            return
        }

        createStudentMutation.mutate(apiRequest, {
            onSuccess: () => {
                toast.success(t('pages.grades.toast.createSuccess'))
                resolve(true)
            },
            onError: () => {
                toast.error(t('pages.grades.toast.createError'))
                resolve(false)
            }
        })
    }), [classId, createStudentMutation, t])

    const handleUpdateStudent = useCallback(async (id: string, updates: Partial<StudentGrade>) => {
        try {
            // Map updates to API format
            const apiUpdates = {
                ...(updates.lastName && { last_name: updates.lastName }),
                ...(updates.firstName && { first_name: updates.firstName }),
                ...(updates.dateOfBirth && { date_of_birth: updates.dateOfBirth }),
                ...(updates.specialCase !== undefined && { special_case: updates.specialCase })
            }

            await updateStudentMutation.mutateAsync({ studentId: id, ...apiUpdates })
            // No toast on success to avoid spamming during quick edits, handling errors only or critical updates
        } catch {
            toast.error(t('pages.grades.toast.updateError'))
        }
    }, [updateStudentMutation, t])

    const handleCellEdit = useCallback((id: string, field: keyof StudentGrade, value: string) => {
        if (!id) return

        // safe cast or check
        const validFields = ['behavior', 'applications', 'notebook', 'assignment', 'exam']
        if (!validFields.includes(field)) return

        // Call mutation directly for specific field
        updateGradeMutation.mutate({
            studentId: id,
            term: Number(term) as 1 | 2 | 3, // Ensure term is passed and is valid
            [field]: Number(value)
        }, {
            onError: () => toast.error(t('pages.grades.toast.updateError'))
        })
    }, [updateGradeMutation, term, t])

    const handleRemoveStudent = useCallback(async (id: string) => {
        try {
            await deleteStudentMutation.mutateAsync(id)
            toast.success(t('pages.grades.toast.deleteSuccess'))
            return true
        } catch {
            toast.error(t('pages.grades.toast.deleteError'))
            return false
        }
    }, [deleteStudentMutation, t])

    const handleMoveStudent = useCallback(async (studentId: string, targetClassId: string) => {
        try {
            await moveStudentMutation.mutateAsync({ studentId, grade_class_id: targetClassId })
            toast.success(t('pages.grades.toast.moveSuccess'))
            return true
        } catch {
            toast.error(t('pages.grades.toast.moveError'))
            return false
        }
    }, [moveStudentMutation, t])

    const handleReorderStudents = useCallback(async (studentIds: string[]) => {
        try {
            await reorderStudentsMutation.mutateAsync({
                classId,
                order: studentIds
            })
        } catch {
            toast.error(t('pages.grades.toast.reorderError'))
        }
    }, [classId, reorderStudentsMutation, t])


    return {
        handleCreateStudent,
        handleUpdateStudent,
        handleCellEdit,
        handleRemoveStudent,
        handleMoveStudent,
        handleReorderStudents,
        isCreating: createStudentMutation.isPending,
        isUpdating: updateStudentMutation.isPending || updateGradeMutation.isPending,
        isDeleting: deleteStudentMutation.isPending,
        isMoving: moveStudentMutation.isPending
    }
}

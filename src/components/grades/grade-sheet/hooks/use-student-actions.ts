import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAttendanceStore } from '@/store/attendance-store'
import {
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent,
    useMoveStudent,
    useUpdateGrade,
} from '@/features/grades'
import type {
    StudentGrade,
    CalculatedStudentGrade,
    AttendanceDialogState,
    NewStudentForm,
} from '../types'
import { DEFAULT_NEW_STUDENT } from '../constants'

export function useStudentActions(
    selectedClassId: string | null,
    selectedTerm: number,
    selectedYear: string,
    setAttendanceDialog: (state: AttendanceDialogState) => void,
    setMoveStudentDialog: (state: { open: boolean; student: CalculatedStudentGrade | null }) => void,
    setRemoveStudentDialog: (state: { open: boolean; student: CalculatedStudentGrade | null }) => void,
    setRecordToDelete: (id: string | null) => void,
    setEditingCell: (cell: { id: string; field: string } | null) => void,
    attendanceDate: string,
    attendanceTime: string,
    attendanceDialog: AttendanceDialogState,
    setAddStudentDialog: (open: boolean) => void,
    newStudent: NewStudentForm,
    setNewStudent: (student: NewStudentForm) => void,
    handleClassSelect: (classId: string) => void
) {
    const { t } = useTranslation()
    const { addRecord, removeRecord } = useAttendanceStore()

    const createStudentMutation = useCreateStudent()
    const updateStudentMutation = useUpdateStudent()
    const deleteStudentMutation = useDeleteStudent()
    const moveStudentMutation = useMoveStudent()
    const updateGradeMutation = useUpdateGrade()

    const handleCellEdit = useCallback(async (id: string, field: keyof StudentGrade, value: string, keepOpen: boolean = false) => {
        const numValue = Number(value)
        if (isNaN(numValue) || numValue < 0 || numValue > 20) return

        try {
            await updateGradeMutation.mutateAsync({
                studentId: id,
                term: selectedTerm as 1 | 2 | 3,
                [field]: numValue,
            })
        } catch (error) {
            toast.error(t('common.error'))
        }
        if (!keepOpen) {
            setEditingCell(null)
        }
    }, [updateGradeMutation, selectedTerm, t, setEditingCell])

    const handleRecordAttendance = useCallback(() => {
        if (!attendanceDialog.student) return

        const student = attendanceDialog.student
        const studentName = `${student.firstName} ${student.lastName}`

        addRecord({
            studentId: student.id,
            studentName,
            classId: 'class-1',
            date: attendanceDate,
            time: attendanceTime,
            year: selectedYear,
            term: selectedTerm,
            type: attendanceDialog.type
        })

        const messageKey = attendanceDialog.type === 'absence'
            ? 'pages.grades.attendance.absenceRecorded'
            : 'pages.grades.attendance.tardinessRecorded'

        toast.success(t(messageKey, { name: studentName }))
        setAttendanceDialog({ open: false, student: null, type: 'absence' })
    }, [attendanceDialog, attendanceDate, attendanceTime, addRecord, t, selectedYear, selectedTerm, setAttendanceDialog])

    const handleDeleteRecord = useCallback((id: string) => {
        removeRecord(id)
        toast.success(t('pages.grades.attendance.deleted'))
        setRecordToDelete(null)
    }, [removeRecord, t, setRecordToDelete])

    const handleMoveStudent = useCallback(async (studentId: string, newClassId: string) => {
        try {
            await moveStudentMutation.mutateAsync({ studentId, grade_class_id: newClassId })
            toast.success(t('pages.grades.studentManagement.moved'))
            setMoveStudentDialog({ open: false, student: null })
            if (newClassId !== selectedClassId) {
                handleClassSelect(newClassId)
            }
        } catch (error) {
            toast.error(t('common.error'))
        }
    }, [moveStudentMutation, t, selectedClassId, handleClassSelect, setMoveStudentDialog])

    const handleRemoveStudent = useCallback(async (studentId: string) => {
        try {
            await deleteStudentMutation.mutateAsync(studentId)
            toast.success(t('pages.grades.studentManagement.removed'))
            setRemoveStudentDialog({ open: false, student: null })
        } catch (error) {
            toast.error(t('common.error'))
        }
    }, [deleteStudentMutation, t, setRemoveStudentDialog])

    const handleAddStudent = useCallback(async () => {
        if (!selectedClassId) {
            toast.error(t('pages.grades.addStudent.noClassSelected'))
            return
        }

        if (!newStudent.lastName.trim() || !newStudent.firstName.trim()) {
            toast.error(t('pages.grades.addStudent.nameRequired'))
            return
        }

        try {
            await createStudentMutation.mutateAsync({
                classId: selectedClassId,
                student_number: newStudent.id.trim() || undefined,
                last_name: newStudent.lastName.trim(),
                first_name: newStudent.firstName.trim(),
                date_of_birth: newStudent.dateOfBirth,
            })

            toast.success(t('pages.grades.addStudent.success'))
            setAddStudentDialog(false)
            setNewStudent(DEFAULT_NEW_STUDENT)
        } catch (error) {
            toast.error(t('common.error'))
        }
    }, [selectedClassId, newStudent, createStudentMutation, t, setAddStudentDialog, setNewStudent])

    const updateStudent = useCallback(async (studentId: string, updates: { specialCase?: string }) => {
        try {
            await updateStudentMutation.mutateAsync({
                studentId,
                special_case: updates.specialCase || null,
            })
        } catch (error) {
            toast.error(t('common.error'))
        }
    }, [updateStudentMutation, t])

    return {
        handleCellEdit,
        handleRecordAttendance,
        handleDeleteRecord,
        handleMoveStudent,
        handleRemoveStudent,
        handleAddStudent,
        updateStudent,
    }
}

import { useState, useCallback } from 'react'
import type { CalculatedStudentGrade } from '../types'

/**
 * Hook to manage dialog state.
 *
 * Responsibility:
 * - Centralizes open/close state for all grade sheet dialogs.
 * - Manages the 'selected student' context for each dialog.
 */
export function useGradeDialogs() {
    // Add Student
    const [addStudentOpen, setAddStudentOpen] = useState(false)

    // Attendance (Lateness/Absence)
    const [attendanceDialog, setAttendanceDialog] = useState<{
        open: boolean
        student: CalculatedStudentGrade | null
        type: 'absence' | 'tardiness'
    }>({ open: false, student: null, type: 'absence' })

    // Attendance History
    const [historyDialog, setHistoryDialog] = useState<{
        open: boolean
        student: CalculatedStudentGrade | null
    }>({ open: false, student: null })

    // Move Student
    const [moveStudentDialog, setMoveStudentDialog] = useState<{
        open: boolean
        student: CalculatedStudentGrade | null
    }>({ open: false, student: null })

    // Remove Student
    const [removeStudentDialog, setRemoveStudentDialog] = useState<{
        open: boolean
        student: CalculatedStudentGrade | null
    }>({ open: false, student: null })

    // Student Info Sidebar (Sheet)
    const [studentInfoSidebar, setStudentInfoSidebar] = useState<{
        open: boolean
        student: CalculatedStudentGrade | null
    }>({ open: false, student: null })

    // Handlers
    const openAttendance = useCallback((student: CalculatedStudentGrade, type: 'absence' | 'tardiness') => {
        setAttendanceDialog({ open: true, student, type })
    }, [])

    const openHistory = useCallback((student: CalculatedStudentGrade) => {
        setHistoryDialog({ open: true, student })
    }, [])

    const openMove = useCallback((student: CalculatedStudentGrade) => {
        setMoveStudentDialog({ open: true, student })
    }, [])

    const openRemove = useCallback((student: CalculatedStudentGrade) => {
        setRemoveStudentDialog({ open: true, student })
    }, [])

    const openStudentInfo = useCallback((student: CalculatedStudentGrade) => {
        setStudentInfoSidebar({ open: true, student })
    }, [])

    return {
        // State
        addStudentOpen,
        attendanceDialog,
        historyDialog,
        moveStudentDialog,
        removeStudentDialog,
        studentInfoSidebar,

        // Setters (Direct state access if needed, e.g. for onOpenChange)
        setAddStudentOpen,
        setAttendanceDialog,
        setHistoryDialog,
        setMoveStudentDialog,
        setRemoveStudentDialog,
        setStudentInfoSidebar,

        // Convenience Openers
        openAttendance,
        openHistory,
        openMove,
        openRemove,
        openStudentInfo
    }
}

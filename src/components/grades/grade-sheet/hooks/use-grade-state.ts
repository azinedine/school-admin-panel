import { useState, useCallback, useMemo } from 'react'
import type {
    SortField,
    SortDirection,
    EditingCell,
    AttendanceDialogState,
    HistoryDialogState,
    StudentDialogState,
    NewStudentForm,
} from '../types'
import { DEFAULT_NEW_STUDENT } from '../constants'

/**
 * Hook for managing all component state
 */
export function useGradeState() {
    // UI state
    const [searchQuery, setSearchQuery] = useState("")
    const [sortField, setSortField] = useState<SortField | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
    const [showGroups, setShowGroups] = useState(true)
    const [showSpecialCasesOnly, setShowSpecialCasesOnly] = useState(false)

    // Attendance dialog state
    const [attendanceDialog, setAttendanceDialog] = useState<AttendanceDialogState>({
        open: false,
        student: null,
        type: 'absence'
    })
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
    const [attendanceTime, setAttendanceTime] = useState(new Date().toTimeString().slice(0, 5))

    // History dialog state
    const [historyDialog, setHistoryDialog] = useState<HistoryDialogState>({
        open: false,
        student: null
    })
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null)

    // Student management dialog state
    const [moveStudentDialog, setMoveStudentDialog] = useState<StudentDialogState>({
        open: false,
        student: null
    })
    const [removeStudentDialog, setRemoveStudentDialog] = useState<StudentDialogState>({
        open: false,
        student: null
    })
    const [addStudentDialog, setAddStudentDialog] = useState(false)
    const [studentInfoSidebar, setStudentInfoSidebar] = useState<StudentDialogState>({
        open: false,
        student: null
    })
    const [newStudent, setNewStudent] = useState<NewStudentForm>(DEFAULT_NEW_STUDENT)

    // Sort handler
    const handleSort = useCallback((field: SortField) => {
        setSortField(prev => {
            if (prev === field) {
                setSortDirection(d => d === "asc" ? "desc" : d === "desc" ? null : "asc")
                return field
            }
            setSortDirection("asc")
            return field
        })
    }, [])

    return {
        // UI state
        searchQuery,
        setSearchQuery,
        sortField,
        sortDirection,
        editingCell,
        setEditingCell,
        showGroups,
        setShowGroups,
        showSpecialCasesOnly,
        setShowSpecialCasesOnly,
        handleSort,

        // Attendance state
        attendanceDialog,
        setAttendanceDialog,
        attendanceDate,
        setAttendanceDate,
        attendanceTime,
        setAttendanceTime,

        // History state
        historyDialog,
        setHistoryDialog,
        recordToDelete,
        setRecordToDelete,

        // Student management state
        moveStudentDialog,
        setMoveStudentDialog,
        removeStudentDialog,
        setRemoveStudentDialog,
        addStudentDialog,
        setAddStudentDialog,
        studentInfoSidebar,
        setStudentInfoSidebar,
        newStudent,
        setNewStudent,
    }
}

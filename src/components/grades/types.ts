import type { GradeClass } from "@/features/grades"

// Local StudentGrade type for compatibility
export interface StudentGrade {
    id: string
    classId: string
    lastName: string
    firstName: string
    dateOfBirth: string
    behavior: number
    applications: number
    notebook: number
    assignment: number
    exam: number
    specialCase?: string
}

// Calculated student grade with computed fields
export interface CalculatedStudentGrade extends StudentGrade {
    lateness: number
    absences: number
    activityAverage: number
    finalAverage: number
    remarks: string
}

// Props for GradeSheetTable
export interface GradeSheetTableProps {
    classId: string | null
    term: 1 | 2 | 3
    classes: GradeClass[]
    onClassSelect: (classId: string) => void
}

export type SortField = keyof CalculatedStudentGrade
export type SortDirection = "asc" | "desc" | null

// Editing cell state
export interface EditingCell {
    id: string
    field: keyof StudentGrade
}

// Attendance dialog state
export interface AttendanceDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
    type: 'absence' | 'tardiness'
}

// History dialog state
export interface HistoryDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
}

// Move student dialog state
export interface MoveStudentDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
}

// Remove student dialog state
export interface RemoveStudentDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
}

// Student info sidebar state
export interface StudentInfoSidebarState {
    open: boolean
    student: CalculatedStudentGrade | null
}

// New student form state
export interface NewStudentForm {
    id: string
    lastName: string
    firstName: string
    dateOfBirth: string
}

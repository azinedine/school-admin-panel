// Types for GradeSheetTable component

export type { GradeClass } from '@/features/grades'

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

export interface CalculatedStudentGrade extends StudentGrade {
    lateness: number
    absences: number
    activityAverage: number
    finalAverage: number
    remarks: string
}

export interface GradeSheetStatistics {
    classAverage: string
    total: number
    passed: number
    failed: number
    passRate: string
    failRate: string
    specialCaseCount: number
    absenceCount: number
    latenessCount: number
}

export interface GradeSheetTableProps {
    classId: string | null
    term: 1 | 2 | 3
    classes: import('@/features/grades').GradeClass[]
    onClassSelect: (classId: string) => void
}

export type SortField = keyof CalculatedStudentGrade
export type SortDirection = "asc" | "desc" | null

export interface EditingCell {
    id: string
    field: string
}

export interface AttendanceDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
    type: 'absence' | 'tardiness'
}

export interface HistoryDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
}

export interface StudentDialogState {
    open: boolean
    student: CalculatedStudentGrade | null
}

export interface NewStudentForm {
    id: string
    lastName: string
    firstName: string
    dateOfBirth: string
}

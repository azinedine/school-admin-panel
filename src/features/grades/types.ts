/**
 * Grades API Types
 * 
 * Types for the grades management feature matching the backend API.
 */

export interface GradeClass {
    id: string
    user_id: number
    name: string
    subject: string | null
    grade_level: string | null
    academic_year: string
    created_at: string
    updated_at: string
    students?: GradeStudent[]
}

export interface GradeStudent {
    id: string
    grade_class_id: string
    student_number: string | null
    last_name: string
    first_name: string
    date_of_birth: string | null
    special_case: string | null
    sort_order: number
    // Flat grade fields for current term (from API)
    behavior: number
    applications: number
    notebook: number
    assignment: number
    exam: number
    // Pedagogical tracking fields for current term
    oral_interrogation: boolean
    notebook_checked: boolean
    last_interrogation_at: string | null
    last_notebook_check_at: string | null
    // Report indicator (count of student reports)
    reports_count: number
}

export interface StudentGrade {
    id: number
    grade_student_id: string
    term: 1 | 2 | 3
    behavior: number
    applications: number
    notebook: number
    assignment: number
    exam: number
}

// Request types
export interface CreateGradeClassRequest {
    name: string
    subject?: string
    grade_level?: string
    academic_year: string
}

export interface UpdateGradeClassRequest {
    name?: string
    subject?: string
    grade_level?: string
}

export interface CreateStudentRequest {
    student_number?: string
    last_name: string
    first_name: string
    date_of_birth?: string
    special_case?: string | null
}

export interface BatchCreateStudentsRequest {
    students: CreateStudentRequest[]
}

export interface UpdateStudentRequest {
    student_number?: string
    last_name?: string
    first_name?: string
    date_of_birth?: string
    special_case?: string | null
}

export interface UpdateGradeRequest {
    term: 1 | 2 | 3
    behavior?: number
    applications?: number
    notebook?: number
    assignment?: number
    exam?: number
}

export interface BatchUpdateGradesRequest {
    term: 1 | 2 | 3
    grades: {
        student_id: string
        behavior?: number
        applications?: number
        notebook?: number
        assignment?: number
        exam?: number
    }[]
}

export interface ReorderStudentsRequest {
    order: string[]
}

export interface MoveStudentRequest {
    grade_class_id: string
}

export interface UpdatePedagogicalTrackingRequest {
    term: 1 | 2 | 3
    oral_interrogation?: boolean
    notebook_checked?: boolean
}

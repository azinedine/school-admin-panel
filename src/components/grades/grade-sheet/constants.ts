// Constants for GradeSheetTable component

export const FIELD_CONFIG: Record<string, { min: number; max: number; step: number; labelKey: string }> = {
    behavior: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.behavior' },
    applications: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.applications' },
    notebook: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.notebook' },
    assignment: { min: 0, max: 20, step: 0.5, labelKey: 'pages.grades.table.assignment' },
    exam: { min: 0, max: 20, step: 0.5, labelKey: 'pages.grades.table.exam' },
}

export const DEFAULT_NEW_STUDENT = {
    id: '',
    lastName: '',
    firstName: '',
    dateOfBirth: '2013-01-01',
}

export const SPECIAL_CASE_TYPES = {
    LONG_ABSENCE: 'longAbsence',
    EXEMPTION: 'exemption',
    MEDICAL: 'medical',
    TRANSFER: 'transfer',
    AUTISM: 'autism',
    DIABETES: 'diabetes',
} as const

export const GRADE_THRESHOLDS = {
    EXCELLENT: 16,
    VERY_GOOD: 14,
    GOOD: 12,
    AVERAGE: 10,
} as const

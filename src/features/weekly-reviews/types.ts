/**
 * Weekly Review Types
 *
 * Types for the weekly student review tracking feature.
 */

// Observation types enum
export const ObservationType = {
    OK: 'OK',
    NO_NOTEBOOK: 'NO_NOTEBOOK',
    LESSON_NOT_WRITTEN: 'LESSON_NOT_WRITTEN',
    INCOMPLETE: 'INCOMPLETE',
    HOMEWORK_MISSING: 'HOMEWORK_MISSING',
    COMMUNICATION_NOTE: 'COMMUNICATION_NOTE',
    MULTIPLE_ISSUES: 'MULTIPLE_ISSUES',
} as const

export type ObservationType = (typeof ObservationType)[keyof typeof ObservationType]

// Week info structure
export interface WeekInfo {
    year: number
    week: number
    week_start: string
}

// Individual weekly review record
export interface WeeklyReview {
    id: number
    grade_student_id: string
    grade_class_id: string
    teacher_id: number
    year: number
    week_number: number
    week_start_date: string
    notebook_checked: boolean
    lesson_written: boolean
    homework_done: boolean
    score: number | null
    observation_type: ObservationType
    observation_notes: string | null
    alert_resolved: boolean
    resolved_at: string | null
    created_at: string
    updated_at: string
}

// This week's review summary (subset of fields for display)
export interface ThisWeekReviewSummary {
    id: number
    observation_type: ObservationType
    notebook_checked: boolean
    lesson_written: boolean
    homework_done: boolean
    score: number | null
    observation_notes: string | null
}

// Last week's review summary (subset of fields for alerts)
export interface LastWeekReviewSummary {
    id: number
    week: number
    year: number
    observation_type: ObservationType
    alert_resolved: boolean
}

// Per-student summary in the API response
export interface StudentWeeklyReviewSummary {
    reviewed_this_week: boolean
    reviewed_last_week: boolean
    this_week_review: ThisWeekReviewSummary | null
    last_review: LastWeekReviewSummary | null
    has_pending_alert: boolean
}

// Full API response for summary endpoint
export interface WeeklyReviewSummaryResponse {
    current_week: WeekInfo
    last_week: WeekInfo
    students: Record<string, StudentWeeklyReviewSummary>
}

// Request types
export interface CreateWeeklyReviewRequest {
    student_id: string
    notebook_checked?: boolean
    lesson_written?: boolean
    homework_done?: boolean
    score?: number | null
    observation_type?: ObservationType
    observation_notes?: string | null
}

export interface BatchCreateWeeklyReviewsRequest {
    year: number
    week_number: number
    reviews: CreateWeeklyReviewRequest[]
}

export interface UpdateWeeklyReviewRequest {
    notebook_checked?: boolean
    lesson_written?: boolean
    homework_done?: boolean
    score?: number | null
    observation_type?: ObservationType
    observation_notes?: string | null
}

// Helper to check if observation has an issue
export function hasIssue(observationType: ObservationType): boolean {
    return observationType !== ObservationType.OK
}

// Helper to get current ISO week
export function getCurrentISOWeek(): { year: number; week: number; weekStart: Date } {
    const now = new Date()

    // Get ISO week year
    const jan4 = new Date(now.getFullYear(), 0, 4)
    const dayOfYear = Math.floor((now.getTime() - jan4.getTime()) / 86400000) + 1
    const weekNumber = Math.ceil((dayOfYear + jan4.getDay() - 1) / 7)

    // Handle year boundary
    let year = now.getFullYear()
    if (weekNumber === 0) {
        year = year - 1
    } else if (weekNumber > 52) {
        const dec31 = new Date(year, 11, 31)
        if (dec31.getDay() < 4) {
            year = year + 1
        }
    }

    // Calculate week start (Monday)
    const weekStart = new Date(now)
    const day = weekStart.getDay()
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1)
    weekStart.setDate(diff)
    weekStart.setHours(0, 0, 0, 0)

    return { year, week: weekNumber, weekStart }
}

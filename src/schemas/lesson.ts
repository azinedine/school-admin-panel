import { z } from 'zod'

/**
 * Lesson Schema
 * Validates fields for creating and updating lessons
 * 
 * NOTE: subject_name is NOT included in this schema.
 * Subject is derived from the authenticated teacher's profile (identity-bound).
 * The backend resolves subject based on the authenticated teacher.
 */

export const lessonSchema = z.object({
    // Basic Information
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title must be less than 255 characters'),

    content: z.string()
        .max(10000, 'Content must be less than 10000 characters')
        .optional()
        .nullable(),

    lesson_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD')
        .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date'),

    academic_year: z.string()
        .regex(/^\d{4}-\d{4}$/, 'Academic year format must be YYYY-YYYY (e.g., 2024-2025)'),

    class_name: z.string()
        .min(1, 'Please select a class')
        .max(100, 'Class name must be less than 100 characters'),

    // NOTE: subject_name is intentionally excluded
    // Subject is identity-bound to the teacher, not lesson-bound

    status: z.enum(['draft', 'published']),
})

/**
 * Form input type for Lesson create/update
 * Does NOT include subject - that comes from teacher profile
 */
export type LessonFormData = z.infer<typeof lessonSchema>

/**
 * API payload type - what gets sent to the backend
 * Backend resolves subject from authenticated teacher
 */
export type LessonCreatePayload = LessonFormData

/**
 * API Response type for Lesson
 * Includes resolved relationship fields including subject_name
 */
export interface Lesson {
    id: number
    institution_id: number
    teacher_id: number
    teacher_name: string | null
    institution_name: string | null
    // Lesson data
    title: string
    content: string | null
    lesson_date: string
    academic_year: string
    class_name: string
    subject_name: string // Resolved from teacher, read-only
    status: 'draft' | 'published'
    // Timestamps
    created_at: string
    updated_at: string
}

/**
 * Default values for the lesson form
 */
export const lessonDefaults: LessonFormData = {
    title: '',
    content: '',
    lesson_date: new Date().toISOString().split('T')[0],
    academic_year: getCurrentAcademicYear(),
    class_name: '',
    status: 'draft',
}

/**
 * Helper to get current academic year in YYYY-YYYY format
 */
function getCurrentAcademicYear(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // 0-indexed

    // Academic year typically starts in September
    // If we're in September or later, use current year - next year
    // Otherwise use previous year - current year
    if (month >= 9) {
        return `${year}-${year + 1}`
    }
    return `${year - 1}-${year}`
}

/**
 * Lesson filters for API queries
 */
export interface LessonFilters {
    status?: 'draft' | 'published'
    class_name?: string
    subject_name?: string
    academic_year?: string
    date_from?: string
    date_to?: string
    per_page?: number
}

/**
 * Check if two lessons are duplicates
 * Based on title, class, and academic year
 * NOTE: Subject is not compared since it's teacher-bound
 */
export function isLessonDuplicate(
    newLesson: LessonFormData,
    existingLessons: Lesson[]
): boolean {
    return existingLessons.some((existing) =>
        existing.title.toLowerCase() === newLesson.title.toLowerCase() &&
        existing.class_name.toLowerCase() === newLesson.class_name.toLowerCase() &&
        existing.academic_year === newLesson.academic_year
    )
}

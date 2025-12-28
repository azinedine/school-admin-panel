import { z } from 'zod'

/**
 * Lesson Preparation Schema
 * Validates all fields for creating and updating lesson preparations
 */

export const lessonPreparationSchema = z.object({
  // Basic Information
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters'),

  subject: z.string()
    .min(1, 'Please select a subject'),

  class: z.string()
    .min(1, 'Please select a class'),

  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date'),

  duration_minutes: z.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration must be less than 8 hours'),

  // Content
  learning_objectives: z.array(z.object({ value: z.string().min(1, 'Objective cannot be empty') }))
    .min(1, 'Add at least one learning objective'),

  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),

  key_topics: z.array(z.object({ value: z.string().min(1, 'Topic cannot be empty') }))
    .min(1, 'Add at least one key topic'),

  // Methodology
  teaching_methods: z.array(z.object({ value: z.string().min(1) }))
    .min(1, 'Select at least one teaching method'),

  resources_needed: z.array(z.object({ value: z.string().min(1, 'Resource cannot be empty') })),

  // Assessment
  assessment_methods: z.array(z.object({ value: z.string().min(1) })),

  assessment_criteria: z.string()
    .max(1000, 'Assessment criteria must be less than 1000 characters')
    .optional(),

  // Additional Notes
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),

  status: z.enum(['draft', 'ready', 'delivered']),
})

export type LessonPreparationFormData = z.output<typeof lessonPreparationSchema>

/**
 * API Response type for lesson preparations
 */
export interface LessonPreparation extends LessonPreparationFormData {
  id: number
  teacher_id: number
  created_at: string
  updated_at: string
}

/**
 * Default values for the form
 */
export const lessonPreparationDefaults: Partial<LessonPreparationFormData> = {
  title: '',
  subject: '',
  class: '',
  date: new Date().toISOString().split('T')[0],
  duration_minutes: 45,
  learning_objectives: [{ value: '' }],
  description: '',
  key_topics: [{ value: '' }],
  teaching_methods: [],
  resources_needed: [],
  assessment_methods: [],
  assessment_criteria: '',
  notes: '',
  status: 'draft',
}

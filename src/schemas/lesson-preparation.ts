import { z } from 'zod'

/**
 * Common field definitions reused across schemas
 */
const commonFields = {
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters'),
  class: z.string().min(1, 'Please select a class'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date'),
  duration_minutes: z.number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration must be less than 8 hours'),
  description: z.string().max(2000).optional(),
  assessment_criteria: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(['draft', 'ready', 'delivered']),
}

/**
 * 1. Form Schema (UI Layer)
 * Optimized for React Hook Form usage (objects with IDs/Values)
 */
export const lessonPreparationFormSchema = z.object({
  ...commonFields,
  learning_objectives: z.array(z.object({ value: z.string().min(1, 'Objective is required') }))
    .min(1, 'Add at least one learning objective'),
  key_topics: z.array(z.object({ value: z.string().min(1, 'Topic is required') }))
    .min(1, 'Add at least one key topic'),
  teaching_methods: z.array(z.object({ value: z.string().min(1, 'Method is required') }))
    .min(1, 'Select at least one teaching method'),
  resources_needed: z.array(z.object({ value: z.string().min(1, 'Resource is required') })),
  assessment_methods: z.array(z.object({ value: z.string().min(1, 'Method is required') })),
})

export type LessonPreparationFormData = z.infer<typeof lessonPreparationFormSchema>

/**
 * 2. API Schema (Data Layer)
 * Optimized for Backend Contract (Flat Arrays)
 */
export const lessonPreparationApiSchema = z.object({
  ...commonFields,
  learning_objectives: z.array(z.string()),
  key_topics: z.array(z.string()),
  teaching_methods: z.array(z.string()),
  resources_needed: z.array(z.string()),
  assessment_methods: z.array(z.string()),
})

export type LessonPreparationApiPayload = z.infer<typeof lessonPreparationApiSchema>

/**
 * 3. Domain Entity (Response)
 * What the API returns to us (usually matches API Schema + ID/Timestamps)
 */
export interface LessonPreparation extends LessonPreparationApiPayload {
  id: number
  teacher_id: number
  subject: string
  created_at: string
  updated_at: string
}

/**
 * Helpers/Adapters
 */
export const defaultFormValues: Partial<LessonPreparationFormData> = {
  title: '',
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

// Transform API Entity -> Form Data (for Editing)
export const toFormData = (entity: LessonPreparation): LessonPreparationFormData => ({
  ...entity,
  learning_objectives: entity.learning_objectives.map(v => ({ value: v })),
  key_topics: entity.key_topics.map(v => ({ value: v })),
  teaching_methods: entity.teaching_methods.map(v => ({ value: v })),
  resources_needed: entity.resources_needed.map(v => ({ value: v })),
  assessment_methods: entity.assessment_methods.map(v => ({ value: v })),
})

// Transform Form Data -> API Payload (for Submission)
export const toApiPayload = (formData: LessonPreparationFormData): LessonPreparationApiPayload => ({
  ...formData,
  learning_objectives: formData.learning_objectives.map(item => item.value),
  key_topics: formData.key_topics.map(item => item.value),
  teaching_methods: formData.teaching_methods.map(item => item.value),
  resources_needed: formData.resources_needed.map(item => item.value),
  assessment_methods: formData.assessment_methods.map(item => item.value),
})

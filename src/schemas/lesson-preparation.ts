import { z } from 'zod'

/**
 * Validation message keys (for i18n lookup)
 * Usage: t(message) where message is the key
 */
const v = {
  lessonNumberRequired: 'pages.prep.validation.lessonNumberRequired',
  lessonNumberMax: 'pages.prep.validation.lessonNumberMax',
  subjectRequired: 'pages.prep.validation.subjectRequired',
  levelRequired: 'pages.prep.validation.levelRequired',
  dateRequired: 'pages.prep.validation.dateRequired',
  durationMin: 'pages.prep.validation.durationMin',
  durationMax: 'pages.prep.validation.durationMax',
  domainRequired: 'pages.prep.validation.domainRequired',
  learningUnitRequired: 'pages.prep.validation.learningUnitRequired',
  knowledgeResourceRequired: 'pages.prep.validation.knowledgeResourceRequired',
  lessonElementRequired: 'pages.prep.validation.lessonElementRequired',
  lessonElementsMin: 'pages.prep.validation.lessonElementsMin',
  assessmentDetailsRequired: 'pages.prep.validation.assessmentDetailsRequired',
  homeworkDetailsRequired: 'pages.prep.validation.homeworkDetailsRequired',
  objectiveRequired: 'pages.prep.validation.objectiveRequired',
  objectivesMin: 'pages.prep.validation.objectivesMin',
  topicRequired: 'pages.prep.validation.topicRequired',
  topicsMin: 'pages.prep.validation.topicsMin',
  methodRequired: 'pages.prep.validation.methodRequired',
  methodsMin: 'pages.prep.validation.methodsMin',
  resourceRequired: 'pages.prep.validation.resourceRequired',
}

/**
 * Common field definitions reused across schemas
 */
const commonFields = {
  lesson_number: z.string()
    .min(1, v.lessonNumberRequired)
    .max(50, v.lessonNumberMax),
  subject: z.string().min(1, v.subjectRequired),
  level: z.string().min(1, v.levelRequired),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), v.dateRequired),
  duration_minutes: z.number()
    .min(15, v.durationMin)
    .max(480, v.durationMax),
  description: z.string().max(2000).optional(),
  assessment_criteria: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(['draft', 'ready', 'delivered']),
}

const lessonElementsSchema = z.array(z.object({
  id: z.string().optional(),
  content: z.string().min(1, v.lessonElementRequired)
})).min(1, v.lessonElementsMin)

/**
 * 1. Form Schema (UI Layer)
 * Optimized for React Hook Form usage (objects with IDs/Values)
 */
export const lessonPreparationFormSchema = z.object({
  ...commonFields,
  // Pedagogical Context
  domain: z.string().min(1, v.domainRequired),
  learning_unit: z.string().min(1, v.learningUnitRequired),
  knowledge_resource: z.string().min(1, v.knowledgeResourceRequired),

  // Lesson Flow
  lesson_elements: lessonElementsSchema,

  // Evaluation
  evaluation_type: z.enum(['assessment', 'homework']),
  evaluation_content: z.string().optional(),

  // Legacy fields (kept for backward compatibility or future use if needed, but made optional in UI logic if replaced)
  learning_objectives: z.array(z.object({ value: z.string().min(1, v.objectiveRequired) }))
    .min(1, v.objectivesMin),
  key_topics: z.array(z.object({ value: z.string().min(1, v.topicRequired) }))
    .min(1, v.topicsMin),
  teaching_methods: z.array(z.object({ value: z.string().min(1, v.methodRequired) }))
    .min(1, v.methodsMin),
  resources_needed: z.array(z.object({ value: z.string().min(1, v.resourceRequired) })),
  assessment_methods: z.array(z.object({ value: z.string().min(1, v.methodRequired) })),
}).superRefine((data, ctx) => {
  if (!data.evaluation_content || data.evaluation_content.length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['evaluation_content'],
      message: data.evaluation_type === 'assessment'
        ? v.assessmentDetailsRequired
        : v.homeworkDetailsRequired,
    });
  }
})

export type LessonPreparationFormData = z.infer<typeof lessonPreparationFormSchema>

/**
 * 2. API Schema (Data Layer)
 * Optimized for Backend Contract (Flat Arrays)
 */
export const lessonPreparationApiSchema = z.object({
  ...commonFields,
  domain: z.string(),
  learning_unit: z.string(),
  knowledge_resource: z.string(),
  lesson_elements: z.array(z.object({
    id: z.string().optional(),
    content: z.string()
  })),
  evaluation_type: z.enum(['assessment', 'homework']),
  evaluation_content: z.string().optional(),

  // Legacy arrays needed for type compatibility if backend still expects them
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
  lesson_number: '',
  subject: '',
  level: '',
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

  // New Pedagogical Defaults
  domain: '',
  learning_unit: '',
  knowledge_resource: '',
  lesson_elements: [{ content: '' }],
  evaluation_type: 'assessment',
  evaluation_content: '',
}

// Transform API Entity -> Form Data (for Editing)
export const toFormData = (entity: LessonPreparation): LessonPreparationFormData => ({
  ...entity,
  learning_objectives: entity.learning_objectives?.map(v => ({ value: v })) ?? [{ value: '' }],
  key_topics: entity.key_topics?.map(v => ({ value: v })) ?? [{ value: '' }],
  teaching_methods: entity.teaching_methods?.map(v => ({ value: v })) ?? [],
  resources_needed: entity.resources_needed?.map(v => ({ value: v })) ?? [],
  assessment_methods: entity.assessment_methods?.map(v => ({ value: v })) ?? [],

  // Pedagogical Fields
  domain: entity.domain ?? '',
  learning_unit: entity.learning_unit ?? '',
  knowledge_resource: entity.knowledge_resource ?? '',
  lesson_elements: entity.lesson_elements?.length ? entity.lesson_elements : [{ content: '' }],
  evaluation_type: entity.evaluation_type ?? 'assessment',
  evaluation_content: entity.evaluation_content ?? '',
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

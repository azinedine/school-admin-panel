import { z } from 'zod'

/**
 * Validation message keys (i18n translation keys)
 * These keys are resolved by FormMessage component at render time
 */
const V = {
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
  materialRequired: 'pages.prep.validation.materialRequired',
  referenceRequired: 'pages.prep.validation.referenceRequired',
  knowledgeRequired: 'pages.prep.validation.knowledgeRequired',
  phaseContentRequired: 'pages.prep.validation.phaseContentRequired',
  phaseDurationRequired: 'pages.prep.validation.phaseDurationRequired',
  activityContentRequired: 'pages.prep.validation.activityContentRequired',
  totalDurationMismatch: 'pages.prep.validation.totalDurationMismatch',
  evaluationDurationRequired: 'pages.prep.validation.evaluationDurationRequired',
}

/**
 * Common fields with i18n validation keys
 */
const commonFields = {
  lesson_number: z.string()
    .min(1, V.lessonNumberRequired)
    .max(50, V.lessonNumberMax),
  subject: z.string().min(1, V.subjectRequired),
  level: z.string().min(1, V.levelRequired),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), V.dateRequired),
  duration_minutes: z.number()
    .min(15, V.durationMin)
    .max(480, V.durationMax),
  notes: z.string().max(2000).optional(),
  status: z.enum(['draft', 'ready', 'delivered']),
}

/**
 * Lesson elements schema
 */
const lessonElementsSchema = z.array(z.object({
  id: z.string().optional(),
  content: z.string()
}))

/**
 * Form Schema (UI Layer)
 * Validation messages are i18n keys - translated by FormMessage
 */
export const lessonPreparationFormSchema = z.object({
  ...commonFields,
  // Pedagogical Context
  domain: z.string().min(1, V.domainRequired),
  learning_unit: z.string().min(1, V.learningUnitRequired),
  knowledge_resource: z.string().min(1, V.knowledgeResourceRequired),

  // Lesson Flow (Legacy - kept for backward compatibility)
  lesson_elements: lessonElementsSchema.optional(),

  // Pedagogical V2 Fields (Optional Extension)
  targeted_knowledge: z.array(z.object({ value: z.string().min(1, V.knowledgeRequired) })).optional(),
  used_materials: z.array(z.string()).optional(), // Array of material names from MultiSelect
  references: z.array(z.string()).optional(), // Array of reference names from MultiSelect

  phases: z.array(z.object({
    type: z.enum(['departure', 'presentation', 'consolidation']),
    content: z.string().min(1, V.phaseContentRequired),
    duration_minutes: z.number().min(1, V.phaseDurationRequired)
  })).optional(),

  activities: z.array(z.object({
    content: z.string().min(1, V.activityContentRequired)
  })).optional(),

  // Evaluation
  evaluation_type: z.enum(['assessment', 'homework']),
  evaluation_content: z.string().optional(),
  evaluation_duration: z.number().min(1, V.evaluationDurationRequired).optional(),

  // Notes List (UI Helper for Notes)
  notes_list: z.array(z.object({
    id: z.string().optional(),
    content: z.string()
  })).optional(),

  // Legacy fields
  learning_objectives: z.array(z.string()),
  teaching_methods: z.array(z.string()).min(1, V.methodsMin),
  resources_needed: z.array(z.object({ value: z.string().min(1, V.resourceRequired) })),
  assessment_methods: z.array(z.object({ value: z.string().min(1, V.methodRequired) })),
}).superRefine((data, ctx) => {
  // Validate Evaluation Content
  if (!data.evaluation_content || data.evaluation_content.length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['evaluation_content'],
      message: data.evaluation_type === 'assessment'
        ? V.assessmentDetailsRequired
        : V.homeworkDetailsRequired,
    });
  }

  // Validate Phase Durations Compatibility (if phases exist)
  if (data.phases && data.phases.length > 0) {
    const totalPhaseDuration = data.phases.reduce((sum, phase) => sum + phase.duration_minutes, 0);
    // Allow a small buffer or exact match? Strictly speaking, they should sum up. 
    // But let's just warn if it exceeds significantly or is way too low. 
    // Actually, usually the phases IS the total duration. 
    // For now, let's just ensure it doesn't EXCEED total duration significantly.
    if (totalPhaseDuration > data.duration_minutes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phases'], // Mark the phases section
        message: V.totalDurationMismatch,
      });
    }
  }
})

export type LessonPreparationFormData = z.infer<typeof lessonPreparationFormSchema>

/**
 * API Schema (Data Layer)
 */
export const lessonPreparationApiSchema = z.object({
  lesson_number: z.string(),
  subject: z.string(),
  level: z.string(),
  date: z.string(),
  duration_minutes: z.number(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'ready', 'delivered']),
  domain: z.string(),
  learning_unit: z.string(),
  knowledge_resource: z.string(),
  lesson_elements: z.array(z.object({
    id: z.string().optional(),
    content: z.string()
  })).optional(),

  // New API Fields
  targeted_knowledge: z.array(z.string()).optional(),
  used_materials: z.array(z.string()).optional(),
  references: z.array(z.string()).optional(),
  phases: z.array(z.object({
    type: z.enum(['departure', 'presentation', 'consolidation']),
    content: z.string(),
    duration_minutes: z.number()
  })).optional(),
  activities: z.array(z.object({
    content: z.string()
  })).optional(),

  evaluation_type: z.enum(['assessment', 'homework']),
  evaluation_content: z.string().optional(),
  evaluation_duration: z.number().optional(),
  learning_objectives: z.array(z.string()),
  teaching_methods: z.array(z.string()),
  resources_needed: z.array(z.string()),
  assessment_methods: z.array(z.string()),
})

export type LessonPreparationApiPayload = z.infer<typeof lessonPreparationApiSchema>

/**
 * Domain Entity (Response)
 */
export interface LessonPreparation extends LessonPreparationApiPayload {
  id: number
  teacher_id: number
  subject: string
  created_at: string
  updated_at: string
}

/**
 * Default form values
 */
export const defaultFormValues: LessonPreparationFormData = {
  lesson_number: '',
  subject: '',
  level: '',
  date: new Date().toISOString().split('T')[0],
  duration_minutes: 45,
  learning_objectives: [],
  teaching_methods: [],
  resources_needed: [],
  assessment_methods: [],
  notes: '',
  status: 'draft',
  domain: '',
  learning_unit: '',
  knowledge_resource: '',
  lesson_elements: [],
  // New Defaults
  targeted_knowledge: [],
  used_materials: [],
  references: [],
  phases: [], // Empty implies legacy mode or fresh start
  activities: [],

  evaluation_type: 'assessment',
  evaluation_content: '',
  evaluation_duration: 10,
  notes_list: [],
}

// Transform API Entity -> Form Data
export const toFormData = (entity: LessonPreparation): LessonPreparationFormData => ({
  ...entity,
  learning_objectives: entity.learning_objectives ?? [],
  teaching_methods: entity.teaching_methods ?? [],
  resources_needed: entity.resources_needed?.map(v => ({ value: v })) ?? [],
  assessment_methods: entity.assessment_methods?.map(v => ({ value: v })) ?? [],

  // New Fields Transformation
  targeted_knowledge: entity.targeted_knowledge?.map(v => ({ value: v })) ?? [],
  used_materials: entity.used_materials ?? [], // Direct string array for MultiSelect
  references: entity.references ?? [], // Direct string array for MultiSelect
  phases: entity.phases ?? [],
  activities: entity.activities ?? [],

  domain: entity.domain ?? '',
  learning_unit: entity.learning_unit ?? '',
  knowledge_resource: entity.knowledge_resource ?? '',
  lesson_elements: entity.lesson_elements ?? [],
  evaluation_type: entity.evaluation_type ?? 'assessment',
  evaluation_content: entity.evaluation_content ?? '',
  evaluation_duration: entity.evaluation_duration ?? 10,
  notes_list: entity.notes
    ? entity.notes.split('\n\n').filter(n => n.trim().length > 0).map(n => ({ content: n }))
    : [],
})

// Transform Form Data -> API Payload
export const toApiPayload = (formData: LessonPreparationFormData): LessonPreparationApiPayload => ({
  ...formData,
  learning_objectives: formData.learning_objectives ?? [],
  teaching_methods: formData.teaching_methods ?? [],
  resources_needed: formData.resources_needed.map(item => item.value),
  assessment_methods: formData.assessment_methods.map(item => item.value),

  // New Fields Transformation
  targeted_knowledge: formData.targeted_knowledge?.map(item => item.value) ?? [],
  used_materials: formData.used_materials ?? [], // Direct string array from MultiSelect
  references: formData.references ?? [], // Direct string array from MultiSelect
  lesson_elements: formData.lesson_elements?.filter(e => e.content && e.content.trim().length > 0) ?? [],
  // Phases and Activities are direct arrays of objects, no map needed if structure matches
  phases: formData.phases ?? [],
  activities: formData.activities ?? [],

  // Transform Notes List back to String
  notes: formData.notes_list
    ? formData.notes_list
      .filter(n => n.content && n.content.trim().length > 0)
      .map(n => n.content)
      .join('\n\n')
    : formData.notes || '',
})

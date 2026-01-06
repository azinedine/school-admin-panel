import type { DailyPlanEntry } from '@/store/prep-store'

/**
 * Default form data configuration
 * Open/Closed: Modify defaults here without touching components
 */
export interface LessonDetailFormData {
    class: string
    lessonNumber: string
    lessonContent: string
    practiceNotes: string
    date: string
    startTime: string
    endTime: string
    mode: 'fullClass' | 'groups'
    group: 'first' | 'second'
    status: DailyPlanEntry['status']
    statusNote: string
    field: string
    learningSegment: string
    knowledgeResource: string
    lessonElements: string[]
    assessment: string
    targetedKnowledge: string
    usedMaterials: string
    references: string
}

export const DEFAULT_FORM_DATA: LessonDetailFormData = {
    class: '',
    lessonNumber: '',
    lessonContent: '',
    practiceNotes: '',
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    mode: 'fullClass',
    group: 'first',
    status: undefined,
    statusNote: '',
    field: '',
    learningSegment: '',
    knowledgeResource: '',
    lessonElements: [],
    assessment: '',
    targetedKnowledge: '',
    usedMaterials: '',
    references: '',
}

export const DEFAULT_GROUP_TIMES = {
    first: { start: '08:00', end: '09:00' },
    second: { start: '09:00', end: '10:00' },
}

export type GroupTimesType = typeof DEFAULT_GROUP_TIMES
export type ActiveGroupsType = ('first' | 'second')[]

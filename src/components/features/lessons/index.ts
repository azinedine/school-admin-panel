// Tabs
export { LessonsTab } from './LessonsTab.tsx'
export { PreparationTab } from './preparation-tab/index.ts'
export { TimetableTab } from './TimetableTab.tsx'

// Lesson Card Module (SOLID refactored)
export { LessonCard, LessonCardGrid } from './lesson-card/index.ts'

// Lesson Components
export { LessonForm } from './lesson-form/index.ts'
export { LessonViewDialog } from './LessonViewDialog.tsx'
export { LessonPrepForm } from './lesson-prep-form/index.ts'
export { LessonPrepDetails } from './lesson-prep-details/index.ts'
export { PreparationCard } from './PreparationCard.tsx'

// Form Sub-components
export { LessonPrepPedagogicalContext } from './lesson-prep-context/index.ts'
export { LessonPrepElements } from './LessonPrepElements.tsx'
export { LessonPrepEvaluation } from './LessonPrepEvaluation.tsx'

// Utilities
export { ClassContextDisplay } from './ClassContextDisplay.tsx'
export { LessonDetailDialog } from './lesson-detail-dialog/index.ts'
export { LessonPrepByClass } from './lesson-prep-by-class/index.ts'
export { LessonSelector } from './LessonSelector.tsx'

// Legacy: Edit sheet for DailyPlanEntry (zustand store)
export { LessonPlanEntrySheet } from './lesson-plan-entry-sheet/index.ts'

// New: Read-only lesson details memo (LessonPreparation API type)
export { LessonDetailsSheet } from './lesson-details/index.ts'


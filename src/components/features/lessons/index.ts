/**
 * Lesson Components - Feature-Based Organization
 * 
 * Components are organized by functional domain:
 * - tabs: Main navigation views
 * - forms: Data entry and editing
 * - viewer: Read-only displays
 * - cards: Display cards
 * - shared: Common utilities
 */

// ============================================================================
// TABS - Main Navigation Views
// ============================================================================
export { LessonsTab } from './tabs/lessons-tab'
export { PreparationTab } from './tabs/preparation-tab'
export { TimetableTab } from './tabs/timetable-tab'

// ============================================================================
// FORMS - Data Entry and Editing
// ============================================================================
export { LessonForm } from './forms/lesson-form'
export { PhaseEditor } from './forms/phase-editor'

// Preparation Form (main + sections)
export { LessonPrepForm } from './forms/preparation-form/main'
export { LessonPrepPedagogicalContext } from './forms/preparation-form/sections/lesson-prep-context'
export { LessonPrepElements } from './forms/preparation-form/sections/lesson-prep-elements'
export { LessonPrepEvaluation } from './forms/preparation-form/sections/lesson-prep-evaluation'

// ============================================================================
// VIEWER - Read-Only Display Components
// ============================================================================

// Memo - Read-only lesson preparation view
export * from './viewer/memo/index'

// Details - Detailed lesson information display
export { LessonDetailsSheet } from './viewer/details'

// Dialogs - Lesson viewing dialogs
export { LessonViewDialog } from './viewer/dialogs/lesson-view-dialog'
export { LessonDetailDialog } from './viewer/dialogs/lesson-detail-dialog'

// Sheets - Legacy and detail sheets
export { LessonPlanEntrySheet } from './viewer/sheets/lesson-plan-entry-sheet'
export { LessonPrepDetails } from './viewer/sheets/lesson-prep-details'

// ============================================================================
// CARDS - Display Card Components
// ============================================================================
export { LessonCard, LessonCardGrid } from './cards/lesson-card'
export { PreparationCard } from './cards/preparation-card'

// ============================================================================
// SHARED - Common Utilities and Reusable Components
// ============================================================================
export { DynamicList } from './shared/components/dynamic-list'
export { ClassContextDisplay } from './shared/components/class-context-display'
export { LessonPrepByClass } from './shared/components/lesson-prep-by-class'
export { LessonSelector } from './shared/components/lesson-selector'


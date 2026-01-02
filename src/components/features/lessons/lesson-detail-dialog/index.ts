// LessonDetailDialog Module - SOLID Architecture
// Single Responsibility: Each section handles one form area
// Open/Closed: Add new fields in dialog-config without changing components
// Interface Segregation: Props are focused per section
// Dependency Inversion: All logic in use-lesson-detail-form hook

export { LessonDetailDialog, type LessonDetailDialogProps } from './LessonDetailDialog.tsx'
export { useLessonDetailForm } from './use-lesson-detail-form.ts'
export { TemplateSelectorButton } from './TemplateSelectorButton.tsx'
export {
    BasicInfoSection,
    SchedulingSection,
    StructureSection,
    ElementsSection,
} from './sections/index.ts'
export {
    type LessonDetailFormData,
    DEFAULT_FORM_DATA,
    DEFAULT_GROUP_TIMES,
} from './dialog-config.ts'

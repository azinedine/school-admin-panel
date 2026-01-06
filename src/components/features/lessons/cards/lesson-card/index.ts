// LessonCard Module - SOLID Architecture
// Single Responsibility: Each component has one job
// Open/Closed: Add new statuses via lesson-card-config
// Interface Segregation: Props are minimal and focused
// Dependency Inversion: Logic in hooks, presentation in components

export { LessonCard, type LessonCardProps } from './LessonCard.tsx'
export { LessonCardGrid } from './LessonCardGrid.tsx'
export { LessonStatusBadge } from './LessonStatusBadge.tsx'
export { LessonMetaInfo } from './LessonMetaInfo.tsx'
export { LessonActions } from './LessonActions.tsx'
export { useLessonCard } from './use-lesson-card.ts'
export {
    getStatusConfig,
    getDateLocale,
    type LessonStatus,
    type StatusConfig,
} from './lesson-card-config.ts'

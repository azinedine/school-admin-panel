// LessonPrepDetails Module - SOLID Architecture
// Single Responsibility: Header and PedagogicalGrid extracted
// Open/Closed: Status configs in prep-details-config
// Dependency Inversion: Config functions for formatting

export { LessonPrepDetails, type LessonPrepDetailsProps } from './LessonPrepDetails.tsx'
export { PrepDetailsHeader } from './PrepDetailsHeader.tsx'
export { PedagogicalGrid } from './PedagogicalGrid.tsx'
export {
    getPrepStatusConfig,
    formatPrepDate,
    type PrepStatus,
    type PrepStatusConfig,
} from './prep-details-config.ts'

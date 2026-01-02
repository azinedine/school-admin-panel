// Phase Editor Components - SOLID Architecture
// Single Responsibility: Each component has one job
// Open/Closed: Add new phase types via config
// Interface Segregation: Props are minimal and focused
// Dependency Inversion: Logic in hooks, presentation in components

export { PhaseEditor } from './PhaseEditor.tsx'
export { PhaseCard } from './PhaseCard.tsx'
export { ConsolidationPhaseCard } from './ConsolidationPhaseCard.tsx'
export { DurationInput } from './DurationInput.tsx'
export { usePhaseEditor } from './use-phase-editor.ts'
export {
    PHASE_CONFIGS,
    getPhaseConfig,
    createDefaultPhases,
    DEFAULT_TOTAL_DURATION,
    type PhaseType,
    type PhaseConfig,
    type PhaseData,
} from './phase-config'

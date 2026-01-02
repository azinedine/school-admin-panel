// Phase Editor Components - SOLID Architecture
// Single Responsibility: Each component has one job
// Open/Closed: Add new phase types via config
// Interface Segregation: Props are minimal and focused
// Dependency Inversion: Logic in hooks, presentation in components

export { PhaseEditor } from './PhaseEditor'
export { PhaseCard } from './PhaseCard'
export { ConsolidationPhaseCard } from './ConsolidationPhaseCard'
export { DurationInput } from './DurationInput'
export { usePhaseEditor } from './use-phase-editor'
export {
    PHASE_CONFIGS,
    getPhaseConfig,
    createDefaultPhases,
    DEFAULT_TOTAL_DURATION,
    type PhaseType,
    type PhaseConfig,
    type PhaseData,
} from './phase-config'

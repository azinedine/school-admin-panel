
/**
 * Phase type literals
 */
export type PhaseType = 'departure' | 'presentation' | 'consolidation'

/**
 * Phase configuration type
 */
export interface PhaseConfig {
    type: PhaseType
    color: string
    defaultDuration: number
}

/**
 * Phase data structure (matches form schema)
 */
export interface PhaseData {
    type: PhaseType
    content: string
    duration_minutes: number
}

/**
 * Phase configuration - defines appearance and default values
 * Open/Closed: Add new phase types here without modifying components
 */
export const PHASE_CONFIGS: readonly PhaseConfig[] = [
    { type: 'departure', color: 'bg-amber-500/10 text-amber-600', defaultDuration: 10 },
    { type: 'presentation', color: 'bg-blue-500/10 text-blue-600', defaultDuration: 35 },
    { type: 'consolidation', color: 'bg-emerald-500/10 text-emerald-600', defaultDuration: 15 },
] as const

/**
 * Get phase config by type
 */
export const getPhaseConfig = (type: PhaseType): PhaseConfig => {
    return PHASE_CONFIGS.find(p => p.type === type) ?? PHASE_CONFIGS[0]
}

/**
 * Create default phases array
 */
export const createDefaultPhases = (): PhaseData[] => {
    return PHASE_CONFIGS.map(config => ({
        type: config.type,
        content: '',
        duration_minutes: config.defaultDuration,
    }))
}

/**
 * Total default duration in minutes
 */
export const DEFAULT_TOTAL_DURATION = PHASE_CONFIGS.reduce(
    (sum, config) => sum + config.defaultDuration,
    0
)

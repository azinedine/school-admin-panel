import type { TFunction } from 'i18next'

/**
 * Status configuration for lesson preparations
 * Open/Closed: Add new statuses here without modifying components
 */
export type PrepStatus = 'draft' | 'ready' | 'delivered'

export interface PrepStatusConfig {
    label: string
    className: string
}

export function getPrepStatusConfig(
    status: PrepStatus,
    _t?: TFunction
): PrepStatusConfig {
    const configs: Record<PrepStatus, PrepStatusConfig> = {
        draft: {
            label: 'Draft',
            className:
                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
        },
        ready: {
            label: 'Ready',
            className:
                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
        },
        delivered: {
            label: 'Delivered',
            className:
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
        },
    }

    return configs[status]
}

/**
 * Format date for display
 */
export function formatPrepDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

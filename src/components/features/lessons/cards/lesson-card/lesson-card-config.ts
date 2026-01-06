import { ar, fr, enUS, type Locale } from 'date-fns/locale'
import type { TFunction } from 'i18next'

/**
 * Status configuration for lesson cards
 * Open/Closed: Add new statuses here without modifying components
 */
export type LessonStatus = 'draft' | 'published'

export interface StatusConfig {
    label: string
    variant: 'secondary' | 'default'
    className: string
}

export function getStatusConfig(
    status: LessonStatus,
    t: TFunction
): StatusConfig {
    const configs: Record<LessonStatus, StatusConfig> = {
        draft: {
            label: t('lessons.status.draft', 'Draft'),
            variant: 'secondary',
            className:
                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        },
        published: {
            label: t('lessons.status.published', 'Published'),
            variant: 'default',
            className:
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
    }

    return configs[status]
}

/**
 * Locale mapping for date-fns
 */
export function getDateLocale(language: string): Locale {
    switch (language) {
        case 'ar':
            return ar
        case 'fr':
            return fr
        default:
            return enUS
    }
}

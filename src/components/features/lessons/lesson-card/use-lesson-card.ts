import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import type { Lesson } from '@/schemas/lesson'
import { getStatusConfig, getDateLocale, type StatusConfig } from './lesson-card-config.ts'

/**
 * Hook for LessonCard logic
 * Dependency Inversion: Separates logic from presentation
 */
export function useLessonCard(lesson: Lesson) {
    const { t, i18n } = useTranslation()

    const locale = useMemo(
        () => getDateLocale(i18n.language),
        [i18n.language]
    )

    const formattedDate = useMemo(
        () => format(new Date(lesson.lesson_date), 'PPP', { locale }),
        [lesson.lesson_date, locale]
    )

    const statusConfig: StatusConfig = useMemo(
        () => getStatusConfig(lesson.status, t),
        [lesson.status, t]
    )

    return {
        t,
        formattedDate,
        statusConfig,
    }
}

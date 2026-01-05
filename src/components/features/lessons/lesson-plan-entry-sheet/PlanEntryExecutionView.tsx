import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import type { DailyPlanEntry } from '@/store/prep-store'

interface PlanEntryExecutionViewProps {
    lesson: DailyPlanEntry
}

export function PlanEntryExecutionView({ lesson }: PlanEntryExecutionViewProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                {t('pages.prep.details.executionDetails')}
            </h3>

            <div className="space-y-3 pl-6 rtl:pr-6 rtl:pl-0">
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div className="space-y-1">
                        <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                            {lesson.mode === 'groups'
                                ? t('pages.prep.details.group1Time')
                                : t('pages.prep.details.firstSessionHour')}
                        </span>
                        <span className="font-mono">{lesson.timeSlot}</span>
                    </div>
                    {lesson.secondaryTimeSlot && (
                        <div className="space-y-1">
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider font-semibold">
                                {lesson.mode === 'groups'
                                    ? t('pages.prep.details.group2Time')
                                    : t('pages.prep.details.secondSessionHour')}
                            </span>
                            <span className="font-mono">{lesson.secondaryTimeSlot}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${lesson.practicalWork
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                                : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${lesson.practicalWork ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        />
                        <span className="font-medium">{t('pages.prep.details.practicalWork')}</span>
                        <span>
                            {lesson.practicalWork ? t('pages.prep.details.yes') : t('pages.prep.details.no')}
                        </span>
                    </div>

                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${lesson.homework
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${lesson.homework ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                        <span className="font-medium">{t('pages.prep.details.homework')}</span>
                        <span>
                            {lesson.homework ? t('pages.prep.details.yes') : t('pages.prep.details.no')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

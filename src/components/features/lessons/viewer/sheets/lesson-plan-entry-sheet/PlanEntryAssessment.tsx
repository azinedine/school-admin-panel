import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import type { DailyPlanEntry } from '@/store/prep-store'

interface PlanEntryAssessmentProps {
    lesson: DailyPlanEntry
    editMode?: boolean
}

export function PlanEntryAssessment({ lesson, editMode }: PlanEntryAssessmentProps) {
    const { t } = useTranslation()

    return (
        <div className={`space-y-4 ${editMode ? 'opacity-80' : ''}`}>
            <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {t('pages.prep.details.assessment')}
            </h3>
            <p className="text-sm pl-6 rtl:pr-6 rtl:pl-0">{lesson.assessment || '-'}</p>
        </div>
    )
}

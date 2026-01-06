import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'
import type { DailyPlanEntry } from '@/store/prep-store'

interface PlanEntryCoreContentProps {
    lesson: DailyPlanEntry
    editMode?: boolean
}

export function PlanEntryCoreContent({ lesson, editMode }: PlanEntryCoreContentProps) {
    const { t } = useTranslation()

    return (
        <div className={`space-y-4 ${editMode ? 'opacity-80' : ''}`}>
            <h3 className="font-semibold flex items-center gap-2 text-primary">
                <BookOpen className="h-4 w-4" />
                {t('pages.prep.details.coreContent')}
            </h3>

            <div className="space-y-4">
                <h4 className="font-medium pl-6 rtl:pr-6 rtl:pl-0">{lesson.lessonNumber}</h4>

                <div className="grid gap-4 pl-6 rtl:pr-6 rtl:pl-0 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground font-medium">
                            {t('pages.prep.details.field')}
                        </span>
                        <span className="col-span-2">{lesson.field || '-'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground font-medium">
                            {t('pages.prep.details.learningSegment')}
                        </span>
                        <span className="col-span-2">{lesson.learningSegment || '-'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground font-medium">
                            {t('pages.prep.details.knowledgeResource')}
                        </span>
                        <span className="col-span-2">{lesson.knowledgeResource || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

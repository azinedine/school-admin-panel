import { useTranslation } from 'react-i18next'
import { List } from 'lucide-react'
import type { DailyPlanEntry } from '@/store/prep-store'

interface PlanEntryElementsProps {
    lesson: DailyPlanEntry
    editMode?: boolean
}

export function PlanEntryElements({ lesson, editMode }: PlanEntryElementsProps) {
    const { t } = useTranslation()

    return (
        <div className={`space-y-3 ${editMode ? 'opacity-80' : ''}`}>
            <h3 className="font-semibold flex items-center gap-2">
                <List className="h-4 w-4" />
                {t('pages.prep.details.lessonElements')}
            </h3>
            {lesson.lessonElements && lesson.lessonElements.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1 pl-6 rtl:pr-6 rtl:pl-0 text-sm">
                    {lesson.lessonElements.map((element, index) => (
                        <li key={index} className="leading-relaxed">
                            {element}
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-sm text-muted-foreground pl-6 rtl:pr-6 rtl:pl-0">-</p>
            )}
        </div>
    )
}

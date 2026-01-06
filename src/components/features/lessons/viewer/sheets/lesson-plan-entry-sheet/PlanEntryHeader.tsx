import { useTranslation } from 'react-i18next'
import { Clock, Users } from 'lucide-react'
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { DailyPlanEntry } from '@/store/prep-store'

interface PlanEntryHeaderProps {
    lesson: DailyPlanEntry
    editMode: boolean
}

export function PlanEntryHeader({ lesson, editMode }: PlanEntryHeaderProps) {
    const { t } = useTranslation()

    const formattedDate = lesson.date
        ? new Date(lesson.date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : t('pages.prep.noDate')

    const timeDisplay = lesson.secondaryTimeSlot
        ? `${lesson.timeSlot} & ${lesson.secondaryTimeSlot}`
        : lesson.timeSlot

    return (
        <SheetHeader className="space-y-4">
            <SheetTitle className="text-2xl font-bold text-primary">
                {editMode ? t('pages.prep.details.edit') : t('pages.prep.details.title')}
            </SheetTitle>
            {!editMode && (
                <SheetDescription className="flex flex-col gap-2 text-base">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{formattedDate}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{timeDisplay}</span>
                    </div>
                    {lesson.mode === 'groups' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{t('pages.prep.details.groups')}</span>
                        </div>
                    )}
                </SheetDescription>
            )}
        </SheetHeader>
    )
}

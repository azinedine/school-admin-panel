import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Lesson } from '@/schemas/lesson'
import { ViewDialogHeader } from './ViewDialogHeader'
import { ViewDialogMetaGrid } from './ViewDialogMetaGrid'
import { ViewDialogContent } from './ViewDialogContent'
import { ViewDialogTimestamps } from './ViewDialogTimestamps'
import { ViewDialogFooter } from './ViewDialogFooter'

interface LessonViewDialogProps {
    lesson: Lesson | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/**
 * Read-only view dialog for lessons
 * Used on preparation page - all fields are view-only
 */
export function LessonViewDialog({
    lesson,
    open,
    onOpenChange,
}: LessonViewDialogProps) {
    const { i18n } = useTranslation()

    if (!lesson) return null

    const locale = i18n.language === 'ar' ? ar : i18n.language === 'fr' ? fr : enUS
    const formattedDate = format(new Date(lesson.lesson_date), 'PPPP', { locale })
    const createdAt = format(new Date(lesson.created_at), 'PPp', { locale })
    const updatedAt = format(new Date(lesson.updated_at), 'PPp', { locale })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <ViewDialogHeader
                    title={lesson.title}
                    status={lesson.status}
                    academicYear={lesson.academic_year}
                />

                <Separator />

                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        <ViewDialogMetaGrid lesson={lesson} formattedDate={formattedDate} />

                        <ViewDialogContent content={lesson.content} />

                        <ViewDialogTimestamps createdAt={createdAt} updatedAt={updatedAt} />
                    </div>
                </div>

                <ViewDialogFooter onClose={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}

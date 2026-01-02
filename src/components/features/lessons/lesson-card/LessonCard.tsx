import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/schemas/lesson'
import { useLessonCard } from './use-lesson-card.ts'
import { LessonStatusBadge } from './LessonStatusBadge.tsx'
import { LessonMetaInfo } from './LessonMetaInfo.tsx'
import { LessonActions } from './LessonActions.tsx'

export interface LessonCardProps {
    lesson: Lesson
    onView?: (lesson: Lesson) => void
    onEdit?: (lesson: Lesson) => void
    onDelete?: (lesson: Lesson) => void
    /** Hide action buttons */
    hideActions?: boolean
    /** Compact card variant */
    compact?: boolean
}

/**
 * Information-rich Lesson Card Component
 * SOLID: Pure presentation, logic in useLessonCard hook
 */
export function LessonCard({
    lesson,
    onView,
    onEdit,
    onDelete,
    hideActions = false,
    compact = false,
}: LessonCardProps) {
    const { t, formattedDate, statusConfig } = useLessonCard(lesson)

    return (
        <Card
            className={cn(
                'group transition-all hover:shadow-md',
                compact ? 'p-3' : ''
            )}
        >
            <CardHeader className={cn('pb-3', compact ? 'p-0 pb-2' : '')}>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold text-lg truncate"
                            title={lesson.title}
                        >
                            {lesson.title}
                        </h3>
                        {lesson.teacher_name && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {lesson.teacher_name}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <LessonStatusBadge statusConfig={statusConfig} />

                        {!hideActions && (
                            <LessonActions
                                lesson={lesson}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                t={t}
                            />
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className={cn(compact ? 'p-0' : 'pb-4')}>
                <LessonMetaInfo lesson={lesson} formattedDate={formattedDate} />

                {/* Content Preview */}
                {!compact && lesson.content && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {lesson.content}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

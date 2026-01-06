import type { Lesson } from '@/schemas/lesson'
import { LessonCard } from './LessonCard.tsx'

interface LessonCardGridProps {
    lessons: Lesson[]
    onView?: (lesson: Lesson) => void
    onEdit?: (lesson: Lesson) => void
    onDelete?: (lesson: Lesson) => void
    hideActions?: boolean
}

/**
 * Grid layout for LessonCards
 * Single Responsibility: Only handles grid layout
 */
export function LessonCardGrid({
    lessons,
    onView,
    onEdit,
    onDelete,
    hideActions,
}: LessonCardGridProps) {
    if (lessons.length === 0) {
        return null
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
                <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    hideActions={hideActions}
                />
            ))}
        </div>
    )
}

import { CalendarDays, BookOpen, GraduationCap, Clock } from 'lucide-react'
import type { Lesson } from '@/schemas/lesson'

interface LessonMetaInfoProps {
    lesson: Lesson
    formattedDate: string
}

/**
 * Single Responsibility: Only renders lesson metadata
 */
export function LessonMetaInfo({ lesson, formattedDate }: LessonMetaInfoProps) {
    return (
        <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 shrink-0" />
                <span className="truncate">{lesson.class_name}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span className="truncate">{lesson.subject_name}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="truncate">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span className="truncate">{lesson.academic_year}</span>
            </div>
        </div>
    )
}

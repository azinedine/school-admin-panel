import { useTranslation } from 'react-i18next'
import {
    CalendarDays,
    BookOpen,
    GraduationCap,
    Clock,
    User,
    Building2,
} from 'lucide-react'
import { ViewDialogInfoItem } from './ViewDialogInfoItem'
import type { Lesson } from '@/schemas/lesson'

interface ViewDialogMetaGridProps {
    lesson: Lesson
    formattedDate: string
}

export function ViewDialogMetaGrid({
    lesson,
    formattedDate,
}: ViewDialogMetaGridProps) {
    const { t } = useTranslation()

    return (
        <div className="grid grid-cols-2 gap-4">
            <ViewDialogInfoItem
                icon={<GraduationCap className="h-4 w-4" />}
                label={t('lessons.form.class', 'Class')}
                value={lesson.class_name}
            />

            <ViewDialogInfoItem
                icon={<BookOpen className="h-4 w-4" />}
                label={t('lessons.form.subject', 'Subject')}
                value={lesson.subject_name}
            />

            <ViewDialogInfoItem
                icon={<CalendarDays className="h-4 w-4" />}
                label={t('lessons.form.date', 'Lesson Date')}
                value={formattedDate}
            />

            <ViewDialogInfoItem
                icon={<Clock className="h-4 w-4" />}
                label={t('lessons.form.academicYear', 'Academic Year')}
                value={lesson.academic_year}
            />

            {lesson.teacher_name && (
                <ViewDialogInfoItem
                    icon={<User className="h-4 w-4" />}
                    label={t('lessons.teacher', 'Teacher')}
                    value={lesson.teacher_name}
                />
            )}

            {lesson.institution_name && (
                <ViewDialogInfoItem
                    icon={<Building2 className="h-4 w-4" />}
                    label={t('lessons.institution', 'Institution')}
                    value={lesson.institution_name}
                />
            )}
        </div>
    )
}

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import { BookOpen, Calendar, Clock, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MemoHeaderProps {
    lesson: LessonPreparation
    language: string
    teacherName?: string
}

export function MemoHeader({ lesson, language, teacherName }: MemoHeaderProps) {
    const { t } = useTranslation()

    const dateLocale = language === 'ar' ? ar : language === 'fr' ? fr : enUS
    const formattedDate = lesson.date
        ? format(new Date(lesson.date), 'PPP', { locale: dateLocale })
        : t('common.noDate', 'No date')

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Title Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{lesson.level || 'Level'}</Badge>
                            <Badge>{lesson.subject || 'Subject'}</Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {lesson.knowledge_resource || 'Untitled Lesson'}
                        </h1>
                        {lesson.learning_unit && (
                            <p className="text-muted-foreground flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {lesson.learning_unit}
                            </p>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{lesson.duration_minutes} {t('common.minutes', 'min')}</span>
                        </div>
                        {teacherName && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>{teacherName}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

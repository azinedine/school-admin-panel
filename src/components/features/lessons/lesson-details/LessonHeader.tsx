import { Badge } from '@/components/ui/badge'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import { BookOpen, Calendar, Clock, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LessonHeaderProps {
    lesson: LessonPreparation
    language: string
    teacherName?: string
    onLanguageChange: (lang: string) => void
}

export function LessonHeader({
    lesson,
    language,
    teacherName,
    onLanguageChange,
}: LessonHeaderProps) {
    const { t } = useTranslation()

    const dateLocale = language === 'ar' ? ar : language === 'fr' ? fr : enUS
    const formattedDate = lesson.date
        ? format(new Date(lesson.date), 'PPP', { locale: dateLocale })
        : t('common.noDate', 'No date')

    return (
        <div className="sticky top-0 z-10 bg-background border-b p-4 space-y-4">
            {/* Top Row: Badges + Language Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{lesson.level || '—'}</Badge>
                    <Badge>{lesson.subject || '—'}</Badge>
                </div>

                {/* Language Switcher */}
                <div className="flex border rounded-md overflow-hidden">
                    {(['ar', 'fr', 'en'] as const).map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => onLanguageChange(lang)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${language === lang
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight">
                    {lesson.knowledge_resource || t('pages.prep.lessonDetails.untitled', 'Untitled Lesson')}
                </h1>
                {lesson.learning_unit && (
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4" />
                        {lesson.learning_unit}
                    </p>
                )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                        {lesson.duration_minutes} {t('common.minutes', 'min')}
                    </span>
                </div>
                {teacherName && (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{teacherName}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import { Calendar, Clock, Printer, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MemoHeaderProps {
    lesson: LessonPreparation
    language: string
    onLanguageChange: (lang: string) => void
    teacherName?: string
}

export function MemoHeader({
    lesson,
    language,
    onLanguageChange,
    teacherName
}: MemoHeaderProps) {
    const { t } = useTranslation()

    // Date formatting based on selected language
    const dateLocale = language === 'ar' ? ar : language === 'fr' ? fr : enUS
    const formattedDate = lesson.date
        ? format(new Date(lesson.date), 'PPP', { locale: dateLocale })
        : t('common.noDate', 'No date')

    return (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm print:static print:shadow-none">
            <div className="container mx-auto max-w-5xl px-4 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Title & Subject */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
                                {lesson.level || 'Level?'}
                            </Badge>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                {lesson.subject || 'Subject?'}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {lesson.knowledge_resource}
                        </h1>
                    </div>

                    {/* Meta Info & Actions */}
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 opacity-70" />
                                <span>{formattedDate}</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 opacity-70" />
                                <span>{lesson.duration_minutes} {t('common.minutes', 'min')}</span>
                            </div>
                            {teacherName && (
                                <>
                                    <Separator orientation="vertical" className="h-4 hidden sm:block" />
                                    <div className="flex items-center gap-1.5 hidden sm:flex">
                                        <User className="h-4 w-4 opacity-70" />
                                        <span>{teacherName}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 print:hidden">
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                <Printer className="h-4 w-4 mr-2" />
                                {t('common.print', 'Print')}
                            </Button>

                            <div className="flex bg-muted rounded-md p-1">
                                {['ar', 'fr', 'en'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => onLanguageChange(lang)}
                                        className={`px-3 py-1 rounded-sm text-xs font-medium transition-all ${language === lang
                                            ? 'bg-background shadow-sm text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

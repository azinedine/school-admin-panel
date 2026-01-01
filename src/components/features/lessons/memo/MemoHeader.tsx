import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
        <div className="bg-card border-b print:shadow-none print:border-none">
            {/* Top Bar with Ministry Header */}
            <div className="bg-muted/50 border-b py-3 px-6 md:px-10 flex justify-between items-center text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-semibold print:hidden">
                <span>Ministry of Education</span>
                <span>School Year: {new Date().getFullYear()}-{new Date().getFullYear() + 1}</span>
            </div>

            <div className="px-6 md:px-10 py-6">
                {/* Official Header Grid */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">

                    {/* Left: School Info */}
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-muted rounded-full flex items-center justify-center border shadow-inner">
                            <span className="text-xl">🏛️</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-sm uppercase tracking-wide">El Amel High School</h3>
                            <p className="text-xs text-muted-foreground font-medium">Official Lesson Plan Document</p>
                            {teacherName && (
                                <div className="flex items-center gap-1.5 text-xs mt-1 text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span className="font-medium">{teacherName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Meta Actions & Language */}
                    <div className="flex flex-col items-end gap-3 print:hidden">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs gap-1.5">
                                <Printer className="h-3.5 w-3.5" />
                                {t('common.print', 'Print')}
                            </Button>

                            <div className="flex bg-muted rounded-md p-1 border">
                                {['ar', 'fr', 'en'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => onLanguageChange(lang)}
                                        className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase transition-all ${language === lang
                                            ? 'bg-background shadow-sm text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Title Area */}
                <div className="mt-6 pt-6 border-t flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2">
                                {lesson.level || 'Level?'}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider py-0.5 px-2">
                                {lesson.subject || 'Subject?'}
                            </Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                            {lesson.knowledge_resource}
                        </h1>
                    </div>

                    {/* Date/Duration Card */}
                    <div className="flex shrink-0 gap-6 bg-muted/50 rounded-lg p-4 border print:bg-transparent">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Date</span>
                            <div className="flex items-center gap-2 font-medium">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                        <div className="w-px bg-border h-auto" />
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Duration</span>
                            <div className="flex items-center gap-2 font-medium">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span>{lesson.duration_minutes} {t('common.minutes', 'min')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

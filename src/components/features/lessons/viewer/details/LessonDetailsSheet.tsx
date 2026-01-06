import { useState, useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import { LessonHeader } from './LessonHeader'
import { LessonContextObjectives } from './LessonContextObjectives'
import { LessonCoreInfo } from './LessonCoreInfo'
import { LessonPhasesTimeline } from './LessonPhasesTimeline'
import { LessonResources } from './LessonResources'
import { LessonEvaluation } from './LessonEvaluation'

interface LessonDetailsSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    lesson: LessonPreparation | null
}

export function LessonDetailsSheet({
    open,
    onOpenChange,
    lesson,
}: LessonDetailsSheetProps) {
    const { t, i18n } = useTranslation()
    const { user } = useAuthStore()
    const isRTL = i18n.dir() === 'rtl'

    // UI-only state for language display
    const [language, setLanguage] = useState(i18n.language || 'fr')

    useEffect(() => {
        setLanguage(i18n.language)
    }, [i18n.language])

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
    }

    if (!lesson) return null

    const teacherName = user?.name || undefined

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-[400px] sm:w-[540px] md:w-[640px] p-0 flex flex-col"
            >
                {/* Sticky Header */}
                <LessonHeader
                    lesson={lesson}
                    language={language}
                    teacherName={teacherName}
                    onLanguageChange={handleLanguageChange}
                />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Accessibility: Hidden title for screen readers */}
                    <SheetHeader className="sr-only">
                        <SheetTitle>
                            {t('pages.prep.lessonDetails.title', 'Lesson Details')}
                        </SheetTitle>
                    </SheetHeader>

                    {/* Context & Objectives */}
                    <LessonContextObjectives lesson={lesson} />

                    {/* Core Information */}
                    <LessonCoreInfo lesson={lesson} />

                    {/* Lesson Phases Timeline */}
                    <LessonPhasesTimeline lesson={lesson} />

                    {/* Resources */}
                    <LessonResources lesson={lesson} />

                    {/* Evaluation (Single Location) */}
                    <LessonEvaluation lesson={lesson} />

                    {/* Print Footer */}
                    <div className="hidden print:block mt-16 pt-8 border-t">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium mb-8">
                                    {t('pages.prep.printFooter.directorVisa', 'Director / Inspector Visa')}:
                                </p>
                                <div className="text-sm text-muted-foreground">
                                    {t('pages.prep.printFooter.dateSignature', 'Date and Signature')}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium mb-8">
                                    {t('pages.prep.printFooter.teacherSignature', 'Teacher Signature')}:
                                </p>
                                <div className="text-sm text-muted-foreground">
                                    {t('pages.prep.printFooter.dateSignature', 'Date and Signature')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

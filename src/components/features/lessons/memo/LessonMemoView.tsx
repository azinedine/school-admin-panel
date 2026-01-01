import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLessonPrepDetail } from '@/hooks/use-lesson-preparation'
import { useAuthStore } from '@/store/auth-store'
import { AlertCircle, ChevronLeft, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { MemoContext } from './MemoContext'
import { MemoCoreInfo } from './MemoCoreInfo'
import { MemoEvaluation } from './MemoEvaluation'
import { MemoHeader } from './MemoHeader'
import { MemoPhases } from './MemoPhases'
import { MemoResources } from './MemoResources'

interface LessonMemoViewProps {
    lessonId: number
}

export function LessonMemoView({ lessonId }: LessonMemoViewProps) {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { data: lesson, isLoading, error } = useLessonPrepDetail(lessonId)
    const { user } = useAuthStore() // Correct auth usage
    const [language, setLanguage] = useState(i18n.language || 'fr')

    // Handle language switching for the memo view specifically
    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
    }

    // Effect to sync memo language with app language initially
    useEffect(() => {
        setLanguage(i18n.language)
    }, [i18n.language])

    const handlePrint = () => {
        window.print()
    }

    if (isLoading) {
        return <MemoLoadingSkeleton />
    }

    if (error || !lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{t('common.error', 'Error loading memo')}</h2>
                <p className="text-muted-foreground">{t('pages.prep.notFound', 'Lesson preparation not found')}</p>
                <Button variant="outline" onClick={() => window.history.back()}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t('common.back', 'Go Back')}
                </Button>
            </div>
        )
    }

    const teacherName = user ? user.name : 'Unknown Teacher'

    return (
        <div className="min-h-screen bg-muted/10 pb-20 print:bg-white print:pb-0">
            {/* Navigation Overlay (Hidden in Print) */}
            <div className="fixed top-24 left-6 z-40 print:hidden hidden xl:block">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full shadow-md bg-background hover:bg-accent"
                    onClick={() => window.history.back()}
                    title={t('common.back', 'Go Back')}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            </div>

            {/* Memo Container */}
            <div className="container mx-auto max-w-5xl bg-white shadow-xl min-h-screen border-x border-border/40 print:shadow-none print:border-none print:w-full print:max-w-none">

                {/* Header */}
                <MemoHeader
                    lesson={lesson}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    teacherName={teacherName}
                />

                <div className="p-8 md:p-12 space-y-10 print:p-0 print:pt-4">
                    {/* Core Info Section */}
                    <MemoCoreInfo lesson={lesson} language={language} />

                    {/* Context & Objectives */}
                    <MemoContext lesson={lesson} language={language} />

                    <hr className="border-border/50" />

                    {/* Phases Section */}
                    <MemoPhases lesson={lesson} language={language} />

                    <hr className="border-border/50" />

                    {/* Resources Section */}
                    <MemoResources lesson={lesson} language={language} />

                    <hr className="border-border/50" />

                    {/* Evaluation Section */}
                    <MemoEvaluation lesson={lesson} language={language} />

                    {/* Footer / Signature (Print Only) */}
                    <div className="hidden print:flex justify-between mt-20 pt-8 border-t border-black/20">
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">Visa du Directeur / Inspecteur :</p>
                            <div className="h-20 w-48 border-b border-dashed border-gray-300 mt-2"></div>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">Signature de l'enseignant :</p>
                            <div className="h-20 w-48 border-b border-dashed border-gray-300 mt-2"></div>
                        </div>
                    </div>
                </div>

                {/* Print Fab (Mobile/Bottom) */}
                <div className="fixed bottom-6 right-6 z-50 md:hidden print:hidden">
                    <Button size="lg" className="rounded-full shadow-xl" onClick={handlePrint}>
                        <Printer className="h-5 w-5 mr-2" />
                        Print
                    </Button>
                </div>
            </div>
        </div>
    )
}

function MemoLoadingSkeleton() {
    return (
        <div className="container mx-auto max-w-5xl bg-white min-h-screen p-8 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            <div className="space-y-6 pt-8">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-60 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
            </div>
        </div>
    )
}

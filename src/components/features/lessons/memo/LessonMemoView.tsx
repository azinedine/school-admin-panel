import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLessonPrepDetail } from '@/hooks/use-lesson-preparation'
import { useAuthStore } from '@/store/auth-store'
import { AlertCircle, ArrowLeft, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    const { data: lesson, isLoading, error } = useLessonPrepDetail(lessonId)
    const { user } = useAuthStore()
    const [language, setLanguage] = useState(i18n.language || 'fr')

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
    }

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
                <h2 className="text-xl font-semibold">{t('common.error', 'Error loading memo')}</h2>
                <p className="text-muted-foreground">{t('pages.prep.notFound', 'Lesson preparation not found')}</p>
                <Button variant="outline" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.back', 'Go Back')}
                </Button>
            </div>
        )
    }

    const teacherName = user ? user.name : 'Unknown Teacher'

    return (
        <div className="min-h-screen bg-background print:bg-white">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b print:hidden">
                <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('common.back', 'Back')}
                    </Button>
                    <div className="flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="flex border rounded-md overflow-hidden">
                            {['ar', 'fr', 'en'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${language === lang
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                        }`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <Button size="sm" onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            {t('common.print', 'Print')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6 print:py-4 print:px-8">
                {/* Header Card */}
                <MemoHeader lesson={lesson} language={language} teacherName={teacherName} />

                {/* Core Info */}
                <MemoCoreInfo lesson={lesson} />

                {/* Context & Objectives */}
                <MemoContext lesson={lesson} language={language} />

                {/* Phases */}
                <MemoPhases lesson={lesson} language={language} />

                {/* Resources */}
                <MemoResources lesson={lesson} language={language} />

                {/* Evaluation */}
                <MemoEvaluation lesson={lesson} language={language} />

                {/* Print Footer */}
                <div className="hidden print:block mt-16 pt-8 border-t">
                    <div className="flex justify-between">
                        <div>
                            <p className="font-medium mb-8">Visa du Directeur / Inspecteur:</p>
                            <div className="text-sm text-muted-foreground">Date et Signature</div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium mb-8">Signature de l'enseignant:</p>
                            <div className="text-sm text-muted-foreground">Date et Signature</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MemoLoadingSkeleton() {
    return (
        <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
        </div>
    )
}

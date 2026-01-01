import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { BookOpen, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoSection } from './MemoSection'

interface MemoContextProps {
    lesson: LessonPreparation
    language: string
}

export function MemoContext({ lesson, language }: MemoContextProps) {
    const { t } = useTranslation()
    const isRTL = language === 'ar'

    // Helper for fixed translations
    const tFixed = (key: string, defaultValue: string) => {
        return t(key, defaultValue) as string
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
            {/* Pedagogical Context / Notes */}
            <MemoSection
                title={tFixed('pages.prep.context', 'Pedagogical Context')}
                icon={BookOpen}
                className="h-full"
            >
                <div className="space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                        {lesson.notes ? (
                            <p className="whitespace-pre-wrap leading-relaxed">{lesson.notes}</p>
                        ) : (
                            <p className="italic opacity-60">{tFixed('common.noData', 'No context provided')}</p>
                        )}
                    </div>
                </div>
            </MemoSection>

            {/* Learning Objectives */}
            <MemoSection
                title={tFixed('pages.prep.objectives', 'Learning Objectives')}
                icon={Target}
                className="h-full"
            >
                <div className="space-y-3">
                    {lesson.learning_objectives && lesson.learning_objectives.length > 0 ? (
                        <ul className="space-y-2">
                            {lesson.learning_objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="leading-relaxed">{obj}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic opacity-70">
                            {tFixed('common.noData', 'No objectives defined')}
                        </p>
                    )}
                </div>
            </MemoSection>
        </div>
    )
}

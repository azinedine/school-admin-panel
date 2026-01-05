import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { ContextDomainField } from './ContextDomainField'
import { ContextLearningUnitField } from './ContextLearningUnitField'
import { ContextKnowledgeResourceField } from './ContextKnowledgeResourceField'

interface LessonPrepPedagogicalContextProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepPedagogicalContext({
    control,
    isLoading,
    language,
}: LessonPrepPedagogicalContextProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <Card className="h-full border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Layers className="h-5 w-5 text-indigo-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.lessonStructure.title', 'Lesson Structure')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <ContextDomainField
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
                <ContextLearningUnitField
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
                <ContextKnowledgeResourceField
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
            </CardContent>
        </Card>
    )
}

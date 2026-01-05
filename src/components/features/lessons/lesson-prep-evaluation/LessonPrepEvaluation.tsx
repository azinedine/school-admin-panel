import { type Control, useWatch } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { EvaluationHeader } from './EvaluationHeader'
import { EvaluationTypeTabs } from './EvaluationTypeTabs'
import { EvaluationDuration } from './EvaluationDuration'
import { EvaluationContent } from './EvaluationContent'

interface LessonPrepEvaluationProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepEvaluation({
    control,
    isLoading,
    language,
}: LessonPrepEvaluationProps) {
    const evaluationType = useWatch({
        control,
        name: 'evaluation_type',
    })

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <EvaluationHeader language={language} />
            <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <EvaluationTypeTabs
                        control={control}
                        isLoading={isLoading}
                        language={language}
                    />
                    <EvaluationDuration
                        control={control}
                        isLoading={isLoading}
                        language={language}
                    />
                </div>
                <EvaluationContent
                    control={control}
                    evaluationType={evaluationType}
                    isLoading={isLoading}
                    language={language}
                />
            </CardContent>
        </Card>
    )
}

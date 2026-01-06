import { type Control } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { ObjectivesHeader } from './ObjectivesHeader'
import { ObjectivesSelect } from './ObjectivesSelect'

interface LessonPrepObjectivesProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepObjectives({
    control,
    isLoading,
    language,
}: LessonPrepObjectivesProps) {
    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <ObjectivesHeader language={language} />
            <CardContent className="space-y-6 pt-6">
                <ObjectivesSelect
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
            </CardContent>
        </Card>
    )
}

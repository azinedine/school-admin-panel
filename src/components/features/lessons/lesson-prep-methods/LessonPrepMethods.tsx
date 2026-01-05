import { type Control } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { MethodsHeader } from './MethodsHeader'
import { MethodsSelect } from './MethodsSelect'

interface LessonPrepMethodsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepMethods({
    control,
    isLoading,
    language,
}: LessonPrepMethodsProps) {
    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <MethodsHeader language={language} />
            <CardContent className="space-y-6 pt-6">
                <MethodsSelect
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
            </CardContent>
        </Card>
    )
}

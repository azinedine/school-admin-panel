import { type Control } from 'react-hook-form'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { LessonSupportMaterial } from '../lesson-support-material'
import { LessonPrepPedagogicalContext } from '../lesson-prep-context'
import { LessonPrepObjectives } from '../LessonPrepObjectives'
import { LessonPrepMethods } from '../LessonPrepMethods'

interface PrepFormLeftColumnProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function PrepFormLeftColumn({
    control,
    isLoading,
    language,
}: PrepFormLeftColumnProps) {
    return (
        <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
                <LessonSupportMaterial
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
                <LessonPrepPedagogicalContext
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
                <LessonPrepObjectives
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
                <LessonPrepMethods
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
            </div>
        </div>
    )
}

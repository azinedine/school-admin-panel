import { type Control } from 'react-hook-form'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { LessonSupportMaterial } from '../sections/lesson-support-material'
import { LessonPrepPedagogicalContext } from '../sections/lesson-prep-context'
import { LessonPrepObjectives } from '../sections/lesson-prep-objectives'
import { LessonPrepMethods } from '../sections/lesson-prep-methods'

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

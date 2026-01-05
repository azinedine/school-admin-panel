import { type Control } from 'react-hook-form'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { PrepFormId } from './PrepFormId'
import { PrepFormSubject } from './PrepFormSubject'
import { PrepFormLevel } from './PrepFormLevel'
import { PrepFormDate } from './PrepFormDate'
import { PrepFormStatusDuration } from './PrepFormStatusDuration'

interface LessonPrepHeaderProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
    subjects: string[]
    levels: string[]
}

export function LessonPrepHeader({
    control,
    isLoading,
    language,
    subjects,
    levels,
}: LessonPrepHeaderProps) {
    const disabled = isLoading

    return (
        <div className="bg-muted/10 border-b">
            <div className="p-4 space-y-4">
                {/* Top Row: Basic Identifier Info */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-3 items-start">
                    {/* Lesson Number */}
                    <PrepFormId control={control} disabled={disabled} language={language} />

                    {/* Subject */}
                    <PrepFormSubject
                        control={control}
                        disabled={disabled}
                        language={language}
                        subjects={subjects}
                    />

                    {/* Level */}
                    <PrepFormLevel
                        control={control}
                        disabled={disabled}
                        language={language}
                        levels={levels}
                    />

                    {/* Date */}
                    <PrepFormDate control={control} disabled={disabled} language={language} />

                    {/* Status & Duration */}
                    <PrepFormStatusDuration
                        control={control}
                        disabled={disabled}
                        language={language}
                    />
                </div>
            </div>
        </div>
    )
}

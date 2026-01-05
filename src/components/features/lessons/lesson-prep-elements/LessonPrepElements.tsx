import { type Control, useFieldArray } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { ElementsHeader } from './ElementsHeader'
import { ElementsEmptyState } from './ElementsEmptyState'
import { ElementsItem } from './ElementsItem'

interface LessonPrepElementsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepElements({
    control,
    isLoading,
    language,
}: LessonPrepElementsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'lesson_elements',
    })

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <ElementsHeader
                onAdd={() => append({ content: '' })}
                isLoading={isLoading}
                language={language}
            />
            <CardContent className="space-y-4 pt-6">
                {fields.length === 0 && <ElementsEmptyState language={language} />}

                {fields.map((field, index) => (
                    <ElementsItem
                        key={field.id}
                        control={control}
                        index={index}
                        fieldId={field.id}
                        onRemove={() => remove(index)}
                        isLoading={isLoading}
                        language={language}
                    />
                ))}
            </CardContent>
        </Card>
    )
}

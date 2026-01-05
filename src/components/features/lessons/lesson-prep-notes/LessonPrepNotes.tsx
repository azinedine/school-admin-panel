import { type Control, useFieldArray } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { NotesHeader } from './NotesHeader'
import { NotesEmptyState } from './NotesEmptyState'
import { NotesItem } from './NotesItem'

interface LessonPrepNotesProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepNotes({
    control,
    isLoading,
    language,
}: LessonPrepNotesProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'notes_list',
    })

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <NotesHeader
                onAdd={() => append({ content: '' })}
                isLoading={isLoading}
                language={language}
            />
            <CardContent className="space-y-4 pt-6">
                {fields.length === 0 && <NotesEmptyState language={language} />}

                {fields.map((field, index) => (
                    <NotesItem
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

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import {
    lessonSchema,
    lessonDefaults,
    type LessonFormData,
    type Lesson,
} from '@/schemas/lesson'
import { LessonFormHeader } from './LessonFormHeader'
import { LessonFormMeta } from './LessonFormMeta'
import { LessonFormContent } from './LessonFormContent'
import { LessonFormActions } from './LessonFormActions'

interface LessonFormProps {
    /** Initial data for editing */
    initialData?: Lesson | null
    /** Submit handler */
    onSubmit: (data: LessonFormData) => void
    /** Loading state */
    isLoading?: boolean
    /** Read-only mode - all inputs disabled */
    readOnly?: boolean
    /** Cancel handler */
    onCancel?: () => void
    /** Available classes for selection */
    classes?: string[]
}

/**
 * Reusable Lesson Form Component
 * Uses React Hook Form with Zod validation
 * Supports create, edit, and read-only modes
 *
 * NOTE: Subject is NOT included in this form.
 * Subject is derived from the authenticated teacher's profile (identity-bound).
 */
export function LessonForm({
    initialData,
    onSubmit,
    isLoading = false,
    readOnly = false,
    onCancel,
    classes = [],
}: LessonFormProps) {
    const form = useForm<LessonFormData>({
        resolver: zodResolver(lessonSchema),
        defaultValues: initialData
            ? {
                title: initialData.title,
                content: initialData.content || '',
                lesson_date: initialData.lesson_date,
                academic_year: initialData.academic_year,
                class_name: initialData.class_name,
                status: initialData.status,
            }
            : lessonDefaults,
    })

    const handleFormSubmit = (data: LessonFormData) => {
        if (!readOnly) {
            onSubmit(data)
        }
    }

    const isDisabled = readOnly || isLoading

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Title */}
                            <LessonFormHeader disabled={isDisabled} />

                            {/* Meta Fields: Class, Date, Academic Year, Status */}
                            <LessonFormMeta disabled={isDisabled} classes={classes} />

                            {/* Content */}
                            <LessonFormContent disabled={isDisabled} />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                {!readOnly && (
                    <LessonFormActions
                        isLoading={isLoading}
                        isEditing={!!initialData}
                        onCancel={onCancel}
                    />
                )}
            </form>
        </FormProvider>
    )
}

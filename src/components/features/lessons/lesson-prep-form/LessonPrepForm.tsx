import type { LessonPreparationApiPayload, LessonPreparation } from '@/schemas/lesson-preparation'
import { Form, FormLanguageProvider } from '@/components/ui/form'
import { LessonPrepHeader } from '../lesson-prep-header'
import { useLessonPrepForm } from './useLessonPrepForm'
import { PrepFormLeftColumn } from './PrepFormLeftColumn'
import { PrepFormRightColumn } from './PrepFormRightColumn'
import { PrepFormFooter } from './PrepFormFooter'

interface LessonPrepFormProps {
    initialData?: LessonPreparation | null
    subjects?: string[]
    levels?: string[]
    onCancel?: () => void
    isLoading?: boolean
    language?: string
    nextLessonNumber?: string
    onSubmit: (data: LessonPreparationApiPayload) => Promise<void>
}

/**
 * Lesson Preparation Form
 * Supports create, edit modes with auto-save draft persistence
 */
export function LessonPrepForm({
    initialData,
    subjects = [],
    levels = [],
    onCancel,
    isLoading,
    language,
    nextLessonNumber,
    onSubmit,
}: LessonPrepFormProps) {
    const { form, handleSubmit, onInvalid, availableSubjects, availableLevels } =
        useLessonPrepForm({
            initialData,
            subjects,
            levels,
            nextLessonNumber,
            language,
            onSubmit,
        })

    return (
        <FormLanguageProvider language={language}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit, onInvalid)}
                    className="flex flex-col h-full bg-background"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    {/* Header */}
                    <LessonPrepHeader
                        control={form.control}
                        isLoading={isLoading}
                        language={language}
                        subjects={availableSubjects}
                        levels={availableLevels}
                    />

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column */}
                            <PrepFormLeftColumn
                                control={form.control}
                                isLoading={isLoading}
                                language={language}
                            />

                            {/* Right Column */}
                            <PrepFormRightColumn
                                control={form.control}
                                watch={form.watch}
                                isLoading={isLoading}
                                language={language}
                            />
                        </div>
                        {/* Footer Spacing */}
                        <div className="h-10" />
                    </div>

                    {/* Footer */}
                    <PrepFormFooter
                        isLoading={isLoading}
                        isEditing={!!initialData}
                        language={language}
                        onCancel={onCancel}
                    />
                </form>
            </Form>
        </FormLanguageProvider>
    )
}

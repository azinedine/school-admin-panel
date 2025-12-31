import { useForm, type FieldErrors } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
    Loader2,
    FileText
} from 'lucide-react'
import { PhaseEditor } from './PhaseEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonHeader } from './LessonHeader'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLanguageProvider,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
    type LessonPreparationFormData,
    type LessonPreparationApiPayload,
    type LessonPreparation,
    lessonPreparationFormSchema,
    defaultFormValues,
    toFormData,
    toApiPayload
} from '@/schemas/lesson-preparation'
import { LessonPrepPedagogicalContext } from './LessonPrepPedagogicalContext'
import { LessonPrepLegacyFields } from './LessonPrepLegacyFields'
import { LessonPrepElements } from './LessonPrepElements'
import { LessonSupportMaterial } from './LessonSupportMaterial'

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

export function LessonPrepForm({
    initialData,
    subjects = [],
    levels = [],
    onCancel,
    isLoading,
    language,
    nextLessonNumber,
    onSubmit
}: LessonPrepFormProps) {
    const { t: originalT, i18n } = useTranslation()
    // Use fixed language if provided, otherwise default to i18n
    const t = language ? i18n.getFixedT(language) : originalT

    const form = useForm<LessonPreparationFormData>({
        resolver: zodResolver(lessonPreparationFormSchema),
        defaultValues: initialData ? toFormData(initialData) : { ...defaultFormValues, lesson_number: nextLessonNumber || '' },
    })

    const handleSubmit = async (data: LessonPreparationFormData) => {
        const payload = toApiPayload(data)
        await onSubmit(payload)
    }

    const onInvalid = (errors: FieldErrors<LessonPreparationFormData>) => {
        console.error('Form validation errors:', errors)
        const errorFields = Object.keys(errors).map(key => t(`pages.prep.${key}`, key)).join(', ')
        toast.error(t('common.formErrors', 'Please check the form for errors'), {
            description: errorFields ? `${t('common.errorsIn', 'Errors in')}: ${errorFields}` : undefined
        })
    }

    return (
        <FormLanguageProvider language={language}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)} className="flex flex-col h-full bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                    {/* NEW: Lesson Header (Metadata + Objectives) */}
                    <LessonHeader
                        control={form.control}
                        isLoading={isLoading}
                        language={language}
                        subjects={subjects}
                        levels={levels}
                    />

                    {/* MAIN CONTENT - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* LEFT COLUMN: Context & Objectives (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="space-y-4">



                                    <LessonPrepPedagogicalContext
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />

                                    <LessonPrepLegacyFields
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                        variant="default"
                                    />

                                    <LessonSupportMaterial
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Phases & Content (8 cols) */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="space-y-6">
                                    <PhaseEditor
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                        totalDuration={form.watch('duration_minutes')}
                                    />

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-dashed border-muted-foreground/30" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground font-semibold tracking-widest">
                                                {t('pages.prep.additionalContent', 'Additional Content')}
                                            </span>
                                        </div>
                                    </div>

                                    <LessonPrepElements
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />

                                    <Card className="border shadow-none bg-muted/10">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-primary" />
                                                <CardTitle className="text-base">{t('pages.prep.notes', 'Teacher Notes')}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <FormField
                                                control={form.control}
                                                name="notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder={t('pages.prep.notesPlaceholder', 'Private notes for yourself...')}
                                                                className="min-h-[80px]"
                                                                {...field}
                                                                disabled={isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>     {/* Footer Spacing */}
                        <div className="h-10" />
                    </div>


                    {/* Footer Actions */}
                    <div className="flex justify-between items-center px-6 py-4 border-t bg-background sticky bottom-0 z-10 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
                        <div className="text-xs text-muted-foreground font-medium">
                            {initialData ? t('pages.prep.lastEdited', 'Editing existing preparation') : t('pages.prep.newDraft', 'Creating new preparation')}
                        </div>
                        <div className="flex gap-3">
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isLoading}
                                >
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                            )}
                            <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? t('pages.prep.update', 'Update Preparation') : t('pages.prep.create', 'Create Preparation')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </FormLanguageProvider >
    )
}


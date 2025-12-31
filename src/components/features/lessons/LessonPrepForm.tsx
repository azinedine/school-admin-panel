import { useForm, type FieldErrors } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
    Loader2,
    FileText,
    Target,
    Box,
    Book
} from 'lucide-react'
import { PhaseEditor } from './PhaseEditor'
import { DynamicList } from './DynamicList'
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
    FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { LessonPrepElements } from './LessonPrepElements'
import { LessonPrepEvaluation } from './LessonPrepEvaluation'

interface LessonPrepFormProps {
    initialData?: LessonPreparation | null
    subjects?: string[]
    levels?: string[]
    onCancel?: () => void
    isLoading?: boolean
    language?: string
    onSubmit: (data: LessonPreparationApiPayload) => Promise<void>
}

export function LessonPrepForm({
    initialData,
    subjects = [],
    levels = [],
    onCancel,
    isLoading,
    language,
    onSubmit
}: LessonPrepFormProps) {
    const { t: originalT, i18n } = useTranslation()
    // Use fixed language if provided, otherwise default to i18n
    const t = language ? i18n.getFixedT(language) : originalT

    const form = useForm<LessonPreparationFormData>({
        resolver: zodResolver(lessonPreparationFormSchema),
        defaultValues: initialData ? toFormData(initialData) : defaultFormValues,
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
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* LEFT COLUMN: Context & Objectives (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b">
                                        <Target className="h-4 w-4 text-primary" />
                                        <h3 className="font-semibold text-sm">{t('pages.prep.contextObjectives', 'Context & Objectives')}</h3>
                                    </div>

                                    {/* Duration Field here as it relates to planning */}
                                    <FormField
                                        control={form.control}
                                        name="duration_minutes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('pages.prep.duration', 'Total Duration (min)')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <LessonPrepPedagogicalContext
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />

                                    {/* Legacy Fields (Objectives) are now in Header, so we skip them here to avoid duplication. 
                                            The user asked to "return to the previous design" but "fix layout". 
                                            Keeping objectives in header is cleaner, but if they want strict revert, they go here.
                                            But "fix header" suggests looking at LessonHeader. LessonHeader HAS objectives.
                                            So we do NOT put them here. */}

                                    <DynamicList
                                        control={form.control}
                                        name="targeted_knowledge"
                                        label={t('pages.prep.targetedKnowledge', 'Targeted Knowledge')}
                                        placeholder={t('pages.prep.knowledgePlaceholder', 'Enter knowledge point...')}
                                        emptyMessage={t('pages.prep.noKnowledge', 'No targeted knowledge added')}
                                        icon={Target}
                                        isLoading={isLoading}
                                        language={language}
                                    />

                                    <div className="grid grid-cols-1 gap-4">
                                        <DynamicList
                                            control={form.control}
                                            name="used_materials"
                                            label={t('pages.prep.usedMaterials', 'Used Materials')}
                                            placeholder={t('pages.prep.materialPlaceholder', 'Enter material...')}
                                            emptyMessage={t('pages.prep.noMaterials', 'No materials listed')}
                                            icon={Box}
                                            isLoading={isLoading}
                                            language={language}
                                        />
                                        <DynamicList
                                            control={form.control}
                                            name="references"
                                            label={t('pages.prep.references', 'References')}
                                            placeholder={t('pages.prep.referencePlaceholder', 'Enter reference...')}
                                            emptyMessage={t('pages.prep.noReferences', 'No references added')}
                                            icon={Book}
                                            isLoading={isLoading}
                                            language={language}
                                        />
                                    </div>
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

                                    <LessonPrepEvaluation
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


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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormLanguageProvider,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
                <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)} className="flex flex-col h-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                    {/* 1. Compact Header - Basic Info & Status */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/20 items-end">
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="lesson_number"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs text-muted-foreground">{t('pages.prep.lessonNumber', 'Lesson Number')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="h-8 bg-background"
                                                placeholder="#"
                                                {...field}
                                                disabled={isLoading}
                                                min={1}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-3">
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs text-muted-foreground">{t('pages.prep.subject', 'Subject')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger className="h-8 bg-background">
                                                    <SelectValue placeholder={t('pages.prep.selectSubject')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {subjects.length > 0 ? (
                                                    subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)
                                                ) : <SelectItem value="General" disabled>{t('pages.prep.noSubjects')}</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-3">
                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs text-muted-foreground">{t('pages.prep.level', 'Level')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger className="h-8 bg-background">
                                                    <SelectValue placeholder={t('pages.prep.selectLevel')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {levels.length > 0 ? (
                                                    levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)
                                                ) : <SelectItem value="none" disabled>{t('pages.prep.noLevels')}</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs text-muted-foreground">{t('pages.prep.date', 'Date')}</FormLabel>
                                        <FormControl>
                                            <Input type="date" className="h-8 bg-background" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs text-muted-foreground">{t('pages.prep.preparationStatus')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger className="h-8 bg-background border-primary/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="draft">{t('pages.prep.status.draft', 'Draft')}</SelectItem>
                                                <SelectItem value="ready">{t('pages.prep.status.ready', 'Ready')}</SelectItem>
                                                <SelectItem value="delivered">{t('pages.prep.status.delivered', 'Delivered')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
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

                                    <LessonPrepLegacyFields
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />

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
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center px-6 py-4 border-t bg-muted/20">
                        <div className="text-xs text-muted-foreground">
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {initialData ? t('pages.prep.update', 'Update Preparation') : t('pages.prep.create', 'Create Preparation')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </FormLanguageProvider>
    )
}


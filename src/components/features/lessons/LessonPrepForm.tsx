import { useForm, type FieldErrors } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
    Loader2
} from 'lucide-react'
// import { useSubjects, useLevels } from '@/hooks/use-subjects' // Removed as we only use teacher's subjects
import { PhaseEditor } from './PhaseEditor'
import { Button } from '@/components/ui/button'
import { LessonPrepHeader } from './lesson-prep-header'
import {
    Form,
    FormLanguageProvider,
} from '@/components/ui/form'
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
import { LessonPrepObjectives } from './LessonPrepObjectives'
import { LessonPrepMethods } from './LessonPrepMethods'
import { LessonPrepElements } from './LessonPrepElements'
import { LessonSupportMaterial } from './LessonSupportMaterial'
import { LessonPrepNotes } from './LessonPrepNotes'

const STORAGE_KEY = 'lesson_prep_draft'

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

    // Use connected user's subjects and levels passed via props
    const availableSubjects = subjects
    const availableLevels = levels

    // Auto-select first subject and level for new preparations
    const defaultSubject = subjects.length > 0 ? subjects[0] : ''
    const defaultLevel = levels.length > 0 ? levels[0] : ''

    const form = useForm<LessonPreparationFormData>({
        resolver: zodResolver(lessonPreparationFormSchema),
        defaultValues: initialData
            ? toFormData(initialData)
            : {
                ...defaultFormValues,
                lesson_number: nextLessonNumber || '',
                subject: defaultSubject,
                level: defaultLevel,
            },
    })

    // Restore saved draft from localStorage on mount (only for new preparations)
    const hasRestoredDraft = useRef(false)

    useEffect(() => {
        if (initialData || hasRestoredDraft.current) return // Don't restore if editing existing or already restored

        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const savedDraft = JSON.parse(saved) as Partial<LessonPreparationFormData>
                // Reset form with merged values
                form.reset({
                    ...defaultFormValues,
                    ...savedDraft,
                    lesson_number: nextLessonNumber || savedDraft.lesson_number || '',
                    // Preserve the user's subject/level selections from draft, or use defaults
                    subject: savedDraft.subject || defaultSubject,
                    level: savedDraft.level || defaultLevel,
                })
                hasRestoredDraft.current = true
                console.log('Draft restored from localStorage')
            }
        } catch (e) {
            console.warn('Failed to load draft from localStorage:', e)
        }
    }, []) // Only run once on mount

    // Auto-save to localStorage with debounce
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (initialData) return // Don't auto-save when editing existing

        const subscription = form.watch(() => {
            // Clear previous timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }

            // Debounce save - wait 2 seconds after last change
            saveTimeoutRef.current = setTimeout(() => {
                try {
                    // Use getValues() to get the complete form state
                    const allFormData = form.getValues()
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFormData))
                    console.log('Draft saved to localStorage:', Object.keys(allFormData))
                } catch (e) {
                    console.warn('Failed to save draft to localStorage:', e)
                }
            }, 2000)
        })

        return () => {
            subscription.unsubscribe()
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [form, initialData])

    // Clear localStorage on successful submit
    const clearDraft = () => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            console.warn('Failed to clear draft from localStorage:', e)
        }
    }

    const handleSubmit = async (data: LessonPreparationFormData) => {
        const payload = toApiPayload(data)
        await onSubmit(payload)
        clearDraft() // Clear draft after successful submission
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
                    <LessonPrepHeader
                        control={form.control}
                        isLoading={isLoading}
                        language={language}
                        subjects={availableSubjects}
                        levels={availableLevels}
                    />

                    {/* MAIN CONTENT - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* LEFT COLUMN: Context & Objectives (4 cols) */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="space-y-4">
                                    <LessonSupportMaterial
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />
                                    <LessonPrepPedagogicalContext
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />
                                    <LessonPrepObjectives
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />
                                    <LessonPrepMethods
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

                                    <LessonPrepNotes
                                        control={form.control}
                                        isLoading={isLoading}
                                        language={language}
                                    />
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


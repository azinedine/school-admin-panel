import { useForm, type FieldErrors, type UseFormReturn } from 'react-hook-form'
import { useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { logger } from '@/lib/logger'
import {
    type LessonPreparationFormData,
    type LessonPreparationApiPayload,
    type LessonPreparation,
    lessonPreparationFormSchema,
    defaultFormValues,
    toFormData,
    toApiPayload,
} from '@/schemas/lesson-preparation'

const STORAGE_KEY = 'lesson_prep_draft'

interface UseLessonPrepFormOptions {
    initialData?: LessonPreparation | null
    subjects?: string[]
    levels?: string[]
    nextLessonNumber?: string
    language?: string
    onSubmit: (data: LessonPreparationApiPayload) => Promise<void>
}

interface UseLessonPrepFormReturn {
    form: UseFormReturn<LessonPreparationFormData>
    handleSubmit: (data: LessonPreparationFormData) => Promise<void>
    onInvalid: (errors: FieldErrors<LessonPreparationFormData>) => void
    availableSubjects: string[]
    availableLevels: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any
}

export function useLessonPrepForm({
    initialData,
    subjects = [],
    levels = [],
    nextLessonNumber,
    language,
    onSubmit,
}: UseLessonPrepFormOptions): UseLessonPrepFormReturn {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

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
        if (initialData || hasRestoredDraft.current) return

        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                const savedDraft = JSON.parse(saved) as Partial<LessonPreparationFormData>
                form.reset({
                    ...defaultFormValues,
                    ...savedDraft,
                    lesson_number: nextLessonNumber || savedDraft.lesson_number || '',
                    subject: savedDraft.subject || defaultSubject,
                    level: savedDraft.level || defaultLevel,
                })
                hasRestoredDraft.current = true
                logger.debug('Draft restored from localStorage', 'LessonPreparation')
            }
        } catch (e) {
            logger.warn('Failed to load draft from localStorage', 'LessonPreparation', e)
        }
    }, [initialData, form, nextLessonNumber, defaultSubject, defaultLevel])

    // Auto-save to localStorage with debounce
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (initialData) return

        const subscription = form.watch(() => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }

            saveTimeoutRef.current = setTimeout(() => {
                try {
                    const allFormData = form.getValues()
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFormData))
                    logger.debug('Draft saved to localStorage', 'LessonPreparation', { keys: Object.keys(allFormData) })
                } catch (e) {
                    logger.warn('Failed to save draft to localStorage', 'LessonPreparation', e)
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

    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            logger.warn('Failed to clear draft from localStorage', 'LessonPreparation', e)
        }
    }, [])

    const handleSubmit = useCallback(
        async (data: LessonPreparationFormData) => {
            const payload = toApiPayload(data)
            await onSubmit(payload)
            clearDraft()
        },
        [onSubmit, clearDraft]
    )

    const onInvalid = useCallback(
        (errors: FieldErrors<LessonPreparationFormData>) => {
            logger.warn('Form validation errors', 'LessonPreparation', errors)
            const errorFields = Object.keys(errors)
                .map((key) => t(`pages.prep.${key}`, key))
                .join(', ')
            toast.error(t('common.formErrors', 'Please check the form for errors'), {
                description: errorFields
                    ? `${t('common.errorsIn', 'Errors in')}: ${errorFields}`
                    : undefined,
            })
        },
        [t]
    )

    return {
        form,
        handleSubmit,
        onInvalid,
        availableSubjects: subjects,
        availableLevels: levels,
        t,
    }
}

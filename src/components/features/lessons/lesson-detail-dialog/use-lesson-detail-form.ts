import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePrepStore, type DailyPlanEntry, type LessonTemplate } from '@/store/prep-store'
import {
    type LessonDetailFormData,
    DEFAULT_FORM_DATA,
    DEFAULT_GROUP_TIMES,
    type GroupTimesType,
    type ActiveGroupsType,
} from './dialog-config.ts'

interface UseLessonDetailFormProps {
    existingLesson?: DailyPlanEntry
    prefilledClass?: string
    initialTemplate?: LessonTemplate | null
    day: string
    timeSlot: string
    group: string
    enableScheduling: boolean
    onSave: (lesson: Omit<DailyPlanEntry, 'id'>) => void
    onUpdate?: (id: string, updates: Partial<DailyPlanEntry>) => void
    onOpenChange: (open: boolean) => void
    open: boolean
}

/**
 * Hook for LessonDetailDialog form logic
 * Dependency Inversion: All stateful logic extracted from component
 */
export function useLessonDetailForm({
    existingLesson,
    prefilledClass,
    initialTemplate,
    day,
    timeSlot,
    group,
    enableScheduling,
    onSave,
    onUpdate,
    onOpenChange,
    open,
}: UseLessonDetailFormProps) {
    const { t } = useTranslation()
    const getAllLessonTemplates = usePrepStore((state) => state.getAllLessonTemplates)
    const planEntries = usePrepStore((state) => state.planEntries)

    const [selectorOpen, setSelectorOpen] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(
        initialTemplate || null
    )
    const [activeGroups, setActiveGroups] = useState<ActiveGroupsType>(['first'])
    const [groupTimes, setGroupTimes] = useState<GroupTimesType>(DEFAULT_GROUP_TIMES)
    const [formData, setFormData] = useState<LessonDetailFormData>(DEFAULT_FORM_DATA)

    const availableTemplates = getAllLessonTemplates()

    // Initialize form when dialog opens
    useEffect(() => {
        if (existingLesson) {
            const [start, end] = existingLesson.timeSlot.split('-')
            setFormData({
                class: existingLesson.class,
                lessonNumber: existingLesson.lessonNumber,
                lessonContent: existingLesson.lessonContent,
                practiceNotes: existingLesson.practiceNotes,
                date: existingLesson.date || '',
                startTime: start || existingLesson.timeSlot,
                endTime: end || '',
                mode: existingLesson.mode,
                group: existingLesson.group || 'first',
                status: existingLesson.status,
                statusNote: existingLesson.statusNote || '',
                field: existingLesson.field || '',
                learningSegment: existingLesson.learningSegment || '',
                knowledgeResource: existingLesson.knowledgeResource || '',
                lessonElements: existingLesson.lessonElements || [],
                assessment: existingLesson.assessment || '',
                targetedKnowledge: existingLesson.targetedKnowledge?.join('\n') || '',
                usedMaterials: existingLesson.usedMaterials?.join(', ') || '',
                references: existingLesson.references?.join('\n') || '',
            })
            setSelectedTemplate(null)
            setActiveGroups([existingLesson.group || 'first'])
        } else if (initialTemplate) {
            setFormData({
                ...DEFAULT_FORM_DATA,
                class: prefilledClass || '',
                lessonNumber: initialTemplate.lessonNumber,
                lessonContent: initialTemplate.lessonContent,
                practiceNotes: initialTemplate.practiceNotes,
                date: new Date().toISOString().split('T')[0],
                field: initialTemplate.field,
                learningSegment: initialTemplate.learningSegment,
                knowledgeResource: initialTemplate.knowledgeResource,
                lessonElements: [...initialTemplate.lessonElements],
                assessment: initialTemplate.assessment,
                targetedKnowledge: initialTemplate.targetedKnowledge?.join('\n') || '',
                usedMaterials: initialTemplate.usedMaterials?.join(', ') || '',
                references: initialTemplate.references?.join('\n') || '',
            })
            setSelectedTemplate(initialTemplate)
            setActiveGroups(['first'])
        } else {
            setFormData({
                ...DEFAULT_FORM_DATA,
                class: prefilledClass || '',
            })
            setSelectedTemplate(null)
            setActiveGroups(['first'])
        }
    }, [existingLesson, prefilledClass, open, initialTemplate])

    const updateFormField = useCallback(
        <K extends keyof LessonDetailFormData>(field: K, value: LessonDetailFormData[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
        },
        []
    )

    const handleTemplateSelect = useCallback(
        (template: LessonTemplate) => {
            const lessonData = {
                class: prefilledClass || formData.class,
                lessonNumber: template.lessonNumber,
                lessonContent: template.lessonContent,
                practiceNotes: template.practiceNotes,
                date: formData.date || new Date().toISOString().split('T')[0],
                field: template.field,
                learningSegment: template.learningSegment,
                knowledgeResource: template.knowledgeResource,
                lessonElements: [...template.lessonElements],
                assessment: template.assessment,
                targetedKnowledge: template.targetedKnowledge,
                usedMaterials: template.usedMaterials,
                references: template.references,
                mode: formData.mode,
                group: formData.group,
                status: undefined,
                statusNote: '',
            }

            const isDuplicate = planEntries.some(
                (entry) =>
                    entry.class === lessonData.class &&
                    entry.lessonNumber === lessonData.lessonNumber &&
                    (!existingLesson || entry.id !== existingLesson.id)
            )

            if (isDuplicate) {
                toast.error(t('pages.prep.lessonAlreadyAssigned'))
                return
            }

            let finalTimeSlot = timeSlot
            let finalGroup = group as DailyPlanEntry['group']
            let finalMode = 'groups' as DailyPlanEntry['mode']

            if (enableScheduling) {
                finalTimeSlot = `${formData.startTime}-${formData.endTime}`
                finalMode = formData.mode
                finalGroup = formData.mode === 'groups' ? formData.group : undefined
            }

            onSave({
                day: day as DailyPlanEntry['day'],
                timeSlot: finalTimeSlot,
                ...lessonData,
                mode: finalMode,
                group: finalGroup,
            })

            toast.success(t('pages.prep.addLesson'), {
                description: template.lessonNumber,
            })

            setSelectorOpen(false)
        },
        [
            formData,
            prefilledClass,
            planEntries,
            existingLesson,
            timeSlot,
            group,
            enableScheduling,
            day,
            onSave,
            t,
        ]
    )

    const handleClearTemplate = useCallback(() => {
        setSelectedTemplate(null)
        setFormData((prev) => ({
            ...prev,
            lessonNumber: '',
            field: '',
            learningSegment: '',
            knowledgeResource: '',
            lessonElements: [],
            assessment: '',
            lessonContent: '',
            practiceNotes: '',
            targetedKnowledge: '',
            usedMaterials: '',
            references: '',
        }))
    }, [])

    const getCleanData = useCallback(() => {
        return {
            ...formData,
            targetedKnowledge: formData.targetedKnowledge
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            usedMaterials: formData.usedMaterials
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            references: formData.references
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            phases: existingLesson?.phases,
        }
    }, [formData, existingLesson])

    const handleSave = useCallback(() => {
        if (!formData.class.trim() || !formData.lessonNumber.trim() || !formData.date.trim()) {
            return
        }

        const isDuplicate = planEntries.some(
            (entry) =>
                entry.class === formData.class &&
                entry.lessonNumber === formData.lessonNumber &&
                (!existingLesson || entry.id !== existingLesson.id)
        )

        if (isDuplicate) {
            toast.error(t('pages.prep.lessonAlreadyAssigned'))
            return
        }

        let finalTimeSlot = timeSlot
        let finalGroup = group as DailyPlanEntry['group']
        let finalMode = 'groups' as DailyPlanEntry['mode']

        if (enableScheduling) {
            finalTimeSlot = `${formData.startTime}-${formData.endTime}`
            finalMode = formData.mode
            finalGroup = formData.mode === 'groups' ? formData.group : undefined
        }

        if (existingLesson && onUpdate) {
            onUpdate(existingLesson.id, {
                ...getCleanData(),
                timeSlot: enableScheduling ? finalTimeSlot : undefined,
                mode: enableScheduling ? finalMode : undefined,
                group: enableScheduling ? finalGroup : undefined,
            })
        } else {
            if (enableScheduling && formData.mode === 'groups') {
                activeGroups.forEach((g) => {
                    const groupTime = groupTimes[g]
                    const entryTimeSlot = `${groupTime.start}-${groupTime.end}`

                    onSave({
                        day: day as DailyPlanEntry['day'],
                        timeSlot: entryTimeSlot,
                        ...getCleanData(),
                        mode: 'groups',
                        group: g,
                    })
                })
            } else {
                onSave({
                    day: day as DailyPlanEntry['day'],
                    timeSlot: finalTimeSlot,
                    ...getCleanData(),
                    mode: finalMode,
                    group: finalGroup,
                })
            }
        }

        onOpenChange(false)
    }, [
        formData,
        planEntries,
        existingLesson,
        onUpdate,
        getCleanData,
        enableScheduling,
        timeSlot,
        group,
        activeGroups,
        groupTimes,
        day,
        onSave,
        onOpenChange,
        t,
    ])

    const toggleGroup = useCallback((g: 'first' | 'second') => {
        setActiveGroups((prev) =>
            prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
        )
    }, [])

    const updateGroupTime = useCallback(
        (g: 'first' | 'second', type: 'start' | 'end', value: string) => {
            setGroupTimes((prev) => ({
                ...prev,
                [g]: { ...prev[g], [type]: value },
            }))
        },
        []
    )

    const addLessonElement = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            lessonElements: [...prev.lessonElements, ''],
        }))
    }, [])

    const updateLessonElement = useCallback((index: number, value: string) => {
        setFormData((prev) => {
            const newElements = [...prev.lessonElements]
            newElements[index] = value
            return { ...prev, lessonElements: newElements }
        })
    }, [])

    const removeLessonElement = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            lessonElements: prev.lessonElements.filter((_, i) => i !== index),
        }))
    }, [])

    const isFormValid =
        formData.class.trim() !== '' &&
        formData.lessonNumber.trim() !== '' &&
        formData.date.trim() !== ''

    return {
        t,
        formData,
        updateFormField,
        selectedTemplate,
        setSelectedTemplate,
        selectorOpen,
        setSelectorOpen,
        availableTemplates,
        activeGroups,
        groupTimes,
        handleTemplateSelect,
        handleClearTemplate,
        handleSave,
        toggleGroup,
        updateGroupTime,
        addLessonElement,
        updateLessonElement,
        removeLessonElement,
        isFormValid,
    }
}

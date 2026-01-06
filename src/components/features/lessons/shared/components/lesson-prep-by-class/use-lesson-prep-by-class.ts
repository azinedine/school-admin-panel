import { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrepStore, type DailyPlanEntry, type LessonTemplate } from '@/store/prep-store'
import { useGradesStore } from '@/store/grades-store'
import { useLessonPreps } from '@/hooks/use-lesson-preparation'
import { useCurrentUser } from '@/store/auth-store'
import { toast } from 'sonner'

/**
 * Hook for LessonPrepByClass state and logic
 * Dependency Inversion: All stateful logic extracted from component
 */
export function useLessonPrepByClass() {
    const { t } = useTranslation()
    const { planEntries, addPlanEntry, deletePlanEntry, updatePlanEntry } = usePrepStore()
    const user = useCurrentUser()
    const { data: lessonPreps = [] } = useLessonPreps()
    const { classes: gradesClasses } = useGradesStore()

    // Class selection
    const classes = useMemo(() => gradesClasses.map((c) => c.name).sort(), [gradesClasses])
    const [selectedClass, setSelectedClass] = useState<string>(classes[0] || '')

    // Dialog states
    const [selectorOpen, setSelectorOpen] = useState(false)
    const [statusNoteOpen, setStatusNoteOpen] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)

    // Selection states
    const [selectedStatusLesson, setSelectedStatusLesson] = useState<DailyPlanEntry | null>(null)
    const [statusNote, setStatusNote] = useState('')
    const [pendingStatus, setPendingStatus] = useState<DailyPlanEntry['status'] | null>(null)
    const [detailsLesson, setDetailsLesson] = useState<DailyPlanEntry | null>(null)
    const [editMode, setEditMode] = useState(false)

    // Available years for selector based on teacher's levels
    const availableSelectorYears = useMemo(() => {
        if (!user?.levels || user.levels.length === 0) {
            return ['1st', '2nd', '3rd', '4th']
        }

        const years = new Set<string>()
        user.levels.forEach((level) => {
            if (level.startsWith('1')) years.add('1st')
            if (level.startsWith('2')) years.add('2nd')
            if (level.startsWith('3')) years.add('3rd')
            if (level.startsWith('4')) years.add('4th')
        })

        const sortedYears = Array.from(years).sort()
        return sortedYears.length > 0 ? sortedYears : ['1st', '2nd', '3rd', '4th']
    }, [user])

    // Lessons for selected class
    const classLessons = useMemo(() => {
        return planEntries
            .filter((lesson) => lesson.class === selectedClass)
            .sort((a, b) => {
                if (a.date && b.date) {
                    const dateCompare = a.date.localeCompare(b.date)
                    if (dateCompare !== 0) return dateCompare
                }
                if (a.timeSlot < b.timeSlot) return -1
                if (a.timeSlot > b.timeSlot) return 1
                return 0
            })
    }, [planEntries, selectedClass])

    // Already-added lesson numbers for duplicate prevention
    const addedLessonNumbers = useMemo(() => {
        return planEntries.filter((entry) => entry.class === selectedClass).map((entry) => entry.lessonNumber)
    }, [planEntries, selectedClass])

    // Default year for selector based on class grade
    const defaultSelectorYear = useMemo(() => {
        const classData = gradesClasses.find((c) => c.name === selectedClass)
        const grade = classData?.grade || ''

        if (grade.startsWith('1')) return '1st'
        if (grade.startsWith('2')) return '2nd'
        if (grade.startsWith('3')) return '3rd'
        if (grade.startsWith('4')) return '4th'
        return '1st'
    }, [selectedClass, gradesClasses])

    // Template data from lesson preps
    const templates = useMemo(() => {
        return lessonPreps.map((prep) => ({
            id: prep.id.toString(),
            academicYear: '1st' as const,
            lessonNumber: prep.lesson_number,
            field: prep.subject,
            learningSegment: prep.learning_objectives?.[0] || '',
            knowledgeResource: prep.knowledge_resource || '',
            lessonElements: prep.learning_objectives || [],
            assessment: prep.evaluation_content || '',
            lessonContent: prep.notes || '',
            practiceNotes: prep.notes || '',
            createdAt: prep.created_at,
        }))
    }, [lessonPreps])

    // Format date for display
    const formatDate = useCallback(
        (date?: string) => {
            if (!date) return t('pages.prep.noDate')

            if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const parts = date.split('-')
                const year = parseInt(parts[0], 10)
                const month = parseInt(parts[1], 10) - 1
                const day = parseInt(parts[2], 10)
                const localDate = new Date(year, month, day)

                return localDate.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                })
            }

            return new Date(date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            })
        },
        [t]
    )

    // Handlers
    const handleAddLesson = useCallback(() => {
        setSelectorOpen(true)
    }, [])

    const handleTemplateSelected = useCallback(
        (template: LessonTemplate) => {
            const lessonData = {
                day: 'monday' as DailyPlanEntry['day'],
                timeSlot: '08:00-09:00',
                class: selectedClass,
                lessonNumber: template.lessonNumber,
                lessonContent: template.lessonContent,
                practiceNotes: template.practiceNotes,
                date: new Date().toISOString().split('T')[0],
                field: template.field,
                learningSegment: template.learningSegment,
                knowledgeResource: template.knowledgeResource,
                lessonElements: [...template.lessonElements],
                assessment: template.assessment,
                mode: 'fullClass' as DailyPlanEntry['mode'],
                group: undefined,
                status: undefined,
                statusNote: '',
            }

            const isDuplicate = planEntries.some(
                (entry) =>
                    entry.class === lessonData.class && entry.lessonNumber === lessonData.lessonNumber
            )

            if (isDuplicate) {
                toast.error(t('pages.prep.lessonAlreadyAssigned'))
                return
            }

            addPlanEntry(lessonData)
            toast.success(t('pages.prep.addLesson'), {
                description: template.lessonNumber,
            })
        },
        [selectedClass, planEntries, addPlanEntry, t]
    )

    const handleDelete = useCallback(
        (id: string) => {
            deletePlanEntry(id)
        },
        [deletePlanEntry]
    )

    const handleViewDetails = useCallback((lesson: DailyPlanEntry) => {
        setDetailsLesson(lesson)
        setEditMode(false)
        setDetailsOpen(true)
    }, [])

    const handleEdit = useCallback((lesson: DailyPlanEntry) => {
        setDetailsLesson(lesson)
        setEditMode(true)
        setDetailsOpen(true)
    }, [])

    const handleSaveDetails = useCallback(
        (id: string, updates: Partial<DailyPlanEntry>) => {
            updatePlanEntry(id, updates)
        },
        [updatePlanEntry]
    )

    const handleStatusChange = useCallback(
        (lesson: DailyPlanEntry, newStatus: string) => {
            const status = newStatus as DailyPlanEntry['status']

            if (status === 'custom' || status === 'postponed') {
                setSelectedStatusLesson(lesson)
                setPendingStatus(status)
                setStatusNote(lesson.statusNote || '')
                setStatusNoteOpen(true)
                return
            }

            updatePlanEntry(lesson.id, {
                status,
                statusNote: undefined,
            })
        },
        [updatePlanEntry]
    )

    const handleSaveStatusNote = useCallback(() => {
        if (selectedStatusLesson && pendingStatus) {
            updatePlanEntry(selectedStatusLesson.id, {
                status: pendingStatus,
                statusNote: statusNote,
            })
            setStatusNoteOpen(false)
            setSelectedStatusLesson(null)
            setPendingStatus(null)
            setStatusNote('')
        }
    }, [selectedStatusLesson, pendingStatus, statusNote, updatePlanEntry])

    return {
        t,
        // Class data
        classes,
        selectedClass,
        setSelectedClass,
        classLessons,
        // Selector data
        selectorOpen,
        setSelectorOpen,
        templates,
        addedLessonNumbers,
        defaultSelectorYear,
        availableSelectorYears,
        // Status note dialog
        statusNoteOpen,
        setStatusNoteOpen,
        statusNote,
        setStatusNote,
        pendingStatus,
        // Details sheet
        detailsOpen,
        setDetailsOpen,
        detailsLesson,
        editMode,
        // Utilities
        formatDate,
        // Handlers
        handleAddLesson,
        handleTemplateSelected,
        handleDelete,
        handleViewDetails,
        handleEdit,
        handleSaveDetails,
        handleStatusChange,
        handleSaveStatusNote,
    }
}

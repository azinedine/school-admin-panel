import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import {
    useLessonPreps,
    useCreateLessonPrep,
    useUpdateLessonPrep,
    useDeleteLessonPrep,
    useGenericUpdateLessonPrep,
} from '@/hooks/use-lesson-preparation'
import type { LessonPreparation, LessonPreparationApiPayload } from '@/schemas/lesson-preparation'

export type StatusFilter = 'all' | 'draft' | 'ready' | 'delivered'

/**
 * Hook for PreparationTab state and logic
 * Dependency Inversion: All stateful logic extracted from component
 */
export function usePreparationTab() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)

    // Dialog state
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [formLanguage, setFormLanguage] = useState(i18n.language)

    // Selection state
    const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
    const [prepToDelete, setPrepToDelete] = useState<LessonPreparation | null>(null)

    // Filter state
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Queries & Mutations
    const { data: allPreps = [], isLoading } = useLessonPreps()
    const createMutation = useCreateLessonPrep()
    const updateMutation = useUpdateLessonPrep(selectedPrep?.id || 0)
    const genericUpdateMutation = useGenericUpdateLessonPrep()
    const deleteMutation = useDeleteLessonPrep()

    // Teacher data from user profile
    const teacherSubjects = user?.subjects || []
    const teacherLevels = user?.levels || []

    // Filtered preparations
    const filteredPreps = useMemo(() => {
        return allPreps.filter((prep) => {
            const matchesStatus = statusFilter === 'all' || prep.status === statusFilter
            const query = searchQuery.toLowerCase()
            const matchesSearch =
                (prep.lesson_number && prep.lesson_number.toLowerCase().includes(query)) ||
                (prep.level && prep.level.toLowerCase().includes(query)) ||
                (prep.subject && prep.subject.toLowerCase().includes(query))
            return matchesStatus && (searchQuery === '' || matchesSearch)
        })
    }, [allPreps, statusFilter, searchQuery])

    // Status counts for filter badges
    const statusCounts = useMemo(
        () => ({
            all: allPreps.length,
            draft: allPreps.filter((p) => p.status === 'draft').length,
            ready: allPreps.filter((p) => p.status === 'ready').length,
            delivered: allPreps.filter((p) => p.status === 'delivered').length,
        }),
        [allPreps]
    )

    // Next lesson number for new preps
    const nextLessonNumber = useMemo(() => {
        let num = 1
        const existing = new Set(allPreps.map((p) => p.lesson_number))
        while (existing.has(String(num))) {
            num++
        }
        return String(num)
    }, [allPreps])

    // Handlers
    const handleCreate = useCallback(() => {
        setSelectedPrep(null)
        setFormDialogOpen(true)
    }, [])

    const handleEdit = useCallback((prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setFormDialogOpen(true)
    }, [])

    const handleView = useCallback((prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setViewDialogOpen(true)
    }, [])

    const handleViewMemo = useCallback(
        (prep: LessonPreparation) => {
            navigate({ to: '/teacher/lessons/$lessonId/memo', params: { lessonId: String(prep.id) } })
        },
        [navigate]
    )

    const handleDeleteClick = useCallback((prep: LessonPreparation) => {
        setPrepToDelete(prep)
        setDeleteDialogOpen(true)
    }, [])

    const handleStatusChange = useCallback(
        async (prep: LessonPreparation, status: 'draft' | 'ready' | 'delivered') => {
            await genericUpdateMutation.mutateAsync({
                id: prep.id,
                data: { status },
            })
        },
        [genericUpdateMutation]
    )

    const confirmDelete = useCallback(async () => {
        if (prepToDelete) {
            await deleteMutation.mutateAsync(prepToDelete.id)
            setDeleteDialogOpen(false)
            setPrepToDelete(null)
        }
    }, [prepToDelete, deleteMutation])

    const handleFormSubmit = useCallback(
        async (data: LessonPreparationApiPayload) => {
            if (selectedPrep) {
                await updateMutation.mutateAsync(data)
            } else {
                await createMutation.mutateAsync(data)
            }
            setFormDialogOpen(false)
        },
        [selectedPrep, updateMutation, createMutation]
    )

    const clearFilters = useCallback(() => {
        setSearchQuery('')
        setStatusFilter('all')
    }, [])

    return {
        // Translation
        t,
        i18n,
        // Data
        allPreps,
        filteredPreps,
        isLoading,
        statusCounts,
        teacherSubjects,
        teacherLevels,
        nextLessonNumber,
        // Dialog state
        viewDialogOpen,
        setViewDialogOpen,
        formDialogOpen,
        setFormDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        formLanguage,
        setFormLanguage,
        // Selection
        selectedPrep,
        prepToDelete,
        // Filters
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        // Mutations
        createMutation,
        updateMutation,
        deleteMutation,
        // Handlers
        handleCreate,
        handleEdit,
        handleView,
        handleViewMemo,
        handleDeleteClick,
        handleStatusChange,
        confirmDelete,
        handleFormSubmit,
        clearFilters,
    }
}

import { useState, useMemo } from 'react'
import { useLessonPreps } from '@/hooks/use-lesson-preparation'
import type { LessonPreparation } from '@/schemas/lesson-preparation'

export function useLessonsTab() {
    const { data: readyPreps = [], isLoading } = useLessonPreps({ status: 'ready' })

    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredPreps = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return readyPreps.filter(
            (prep) =>
                prep.lesson_number.toLowerCase().includes(query) ||
                (prep.level && prep.level.toLowerCase().includes(query)) ||
                (prep.subject && prep.subject.toLowerCase().includes(query))
        )
    }, [readyPreps, searchQuery])

    const handleView = (prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setViewDialogOpen(true)
    }

    const closeViewDialog = () => {
        setViewDialogOpen(false)
    }

    return {
        isLoading,
        filteredPreps,
        searchQuery,
        setSearchQuery,
        viewDialogOpen,
        selectedPrep,
        handleView,
        closeViewDialog,
    }
}

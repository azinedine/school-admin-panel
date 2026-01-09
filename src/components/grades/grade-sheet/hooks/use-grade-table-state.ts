import { useState } from 'react'
import type { SortField, SortDirection } from '../types'

/**
 * Hook to manage local table state.
 *
 * Responsibility:
 * - Manages Sort Field & Direction.
 * - Manages Search Query.
 * - Manages Edit State (which cell is currently being edited).
 * - Manages Toggles (Show Groups, Show Special Cases).
 */
export function useGradeTableState() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortField, setSortField] = useState<SortField>('lastName')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
    const [showGroups, setShowGroups] = useState(false)
    const [showSpecialCasesOnly, setShowSpecialCasesOnly] = useState(false)
    const [showAbsencesOnly, setShowAbsencesOnly] = useState(false)
    const [absenceFilterDate, setAbsenceFilterDate] = useState<Date | undefined>(new Date())
    const [showLatenessOnly, setShowLatenessOnly] = useState(false)

    const [editingCell, setEditingCell] = useState<{
        id: string
        field: string
    } | null>(null)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    return {
        searchQuery,
        setSearchQuery,
        sortField,
        setSortField, // Direct setter exposed if needed, but handleSort is preferred
        sortDirection,
        setSortDirection,
        handleSort,
        showGroups,
        setShowGroups,
        showSpecialCasesOnly,
        setShowSpecialCasesOnly,
        showAbsencesOnly,
        setShowAbsencesOnly,
        absenceFilterDate,
        setAbsenceFilterDate,
        showLatenessOnly,
        setShowLatenessOnly,
        editingCell,
        setEditingCell
    }
}

import { useMemo } from 'react'
import type { CalculatedStudentGrade, SortField, SortDirection } from '../types'
import type { AttendanceRecord } from '@/store/attendance-store'
import { format } from "date-fns"

interface UseGradeFilteringProps {
    students: CalculatedStudentGrade[]
    searchQuery: string
    sortField: SortField
    sortDirection: SortDirection
    showGroups: boolean
    showSpecialCasesOnly: boolean
    showAbsencesOnly: boolean
    showLatenessOnly: boolean
    absenceFilterDate?: Date
    attendanceRecords?: AttendanceRecord[]
}

/**
 * Hook to filter, sort, and group students.
 *
 * Responsibility:
 * - Filters students by search query and special cases.
 * - Sorts students based on selected field and direction.
 * - Manages group assignments (Group 1 / Group 2) logic.
 * - Filters by specific absence date if enabled.
 */
export function useGradeFiltering({
    students,
    searchQuery,
    sortField,
    sortDirection,
    showSpecialCasesOnly,
    showAbsencesOnly,
    showLatenessOnly,
    absenceFilterDate,
    attendanceRecords = []
}: UseGradeFilteringProps) {

    const processedStudents = useMemo(() => {
        let result = [...students]

        // 1. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (s) =>
                    s.firstName.toLowerCase().includes(query) ||
                    s.lastName.toLowerCase().includes(query) ||
                    s.id.toLowerCase().includes(query)
            )
        }

        // 2. Special Cases Filter
        if (showSpecialCasesOnly) {
            result = result.filter((s) => !!s.specialCase)
        }

        // 3. Absences Filter
        if (showAbsencesOnly) {
            if (absenceFilterDate) {
                // Return students who have an *absence* record on the specific date
                const dateStr = format(absenceFilterDate, 'yyyy-MM-dd')
                const absentStudentIds = new Set(
                    attendanceRecords
                        .filter(r => r.type === 'absence' && r.date === dateStr)
                        .map(r => r.studentId)
                )
                result = result.filter(s => absentStudentIds.has(s.id))
            } else {
                // Fallback (shouldn't really happen if default is set): show any absence count > 0
                result = result.filter((s) => (s.absences || 0) > 0)
            }
        }

        // 4. Lateness Filter
        if (showLatenessOnly) {
            // Logic for lateness filter (currently just any lateness)
            result = result.filter((s) => (s.lateness || 0) > 0)
        }

        // 5. Sorting
        result.sort((a, b) => {
            let aValue = a[sortField]
            let bValue = b[sortField]

            // Handle undefined/null values for special cases or dates
            if (aValue === undefined || aValue === null) aValue = ''
            if (bValue === undefined || bValue === null) bValue = ''

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [
        students,
        searchQuery,
        sortField,
        sortDirection,
        showSpecialCasesOnly,
        showAbsencesOnly,
        showLatenessOnly,
        absenceFilterDate,
        attendanceRecords
    ])

    // Group Logic (Memoized helper for group splitting)
    // Note: We don't change the processedStudents structure for groups, 
    // but we provide helper data or we could return grouped structure if UI demanded it.
    // The current UI just displays group number based on index.

    const groupSplitIndex = Math.ceil(processedStudents.length / 2)

    return {
        processedStudents,
        groupSplitIndex
    }
}

import { useState, useMemo, useEffect } from 'react'
import type { LessonTemplate } from '@/store/prep-store'

interface UseLessonSelectorFiltersOptions {
    templates: LessonTemplate[]
    defaultYear: string
    availableYears: string[]
    open: boolean
}

export function useLessonSelectorFilters({
    templates,
    defaultYear,
    availableYears,
    open,
}: UseLessonSelectorFiltersOptions) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedField, setSelectedField] = useState<string>('all')
    const [selectedYear, setSelectedYear] = useState<string>(availableYears[0] || defaultYear)

    useEffect(() => {
        if (open) {
            if (availableYears.includes(defaultYear)) {
                setSelectedYear(defaultYear)
            } else if (availableYears.length > 0) {
                setSelectedYear(availableYears[0])
            }
        }
    }, [open, defaultYear, availableYears])

    // Get unique fields for filter
    const fields = useMemo(() => {
        const uniqueFields = new Set(templates.map((t) => t.field).filter(Boolean))
        return Array.from(uniqueFields).sort()
    }, [templates])

    // Filter templates
    const filteredTemplates = useMemo(() => {
        return templates.filter((template) => {
            const matchesSearch = template.lessonNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            const matchesField =
                selectedField === 'all' || template.field === selectedField
            const matchesYear = template.academicYear === selectedYear

            return matchesSearch && matchesField && matchesYear
        })
    }, [templates, searchTerm, selectedField, selectedYear])

    return {
        searchTerm,
        setSearchTerm,
        selectedField,
        setSelectedField,
        selectedYear,
        setSelectedYear,
        fields,
        filteredTemplates,
    }
}

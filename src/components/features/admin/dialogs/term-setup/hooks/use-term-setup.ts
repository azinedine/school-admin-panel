import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface UseTermSetupProps {
    onOpenChange: (open: boolean) => void
    onSave: (startDate: string, endDate: string) => void
    existingStartDate?: string
    existingEndDate?: string
}

export function useTermSetup({
    onOpenChange,
    onSave,
    existingStartDate,
    existingEndDate,
}: UseTermSetupProps) {
    const { t } = useTranslation()
    const [startDate, setStartDate] = useState(existingStartDate || '')
    const [endDate, setEndDate] = useState(existingEndDate || '')
    const [error, setError] = useState('')

    // Reset state when props change
    useEffect(() => {
        setStartDate(existingStartDate || '')
        setEndDate(existingEndDate || '')
    }, [existingStartDate, existingEndDate])

    const handleSave = () => {
        // Validation
        if (!startDate || !endDate) {
            setError(t('pages.prep.termSetup.errors.required'))
            return
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (start >= end) {
            setError(t('pages.prep.termSetup.errors.invalidRange'))
            return
        }

        // Calculate weeks
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const weekCount = Math.ceil(diffDays / 7)

        if (weekCount > 52) {
            setError(t('pages.prep.termSetup.errors.tooLong'))
            return
        }

        onSave(startDate, endDate)
        onOpenChange(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setError('')
        onOpenChange(newOpen)
    }

    const calculateWeeks = () => {
        if (!startDate || !endDate || error) return null

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (start < end) {
            const diffTime = Math.abs(end.getTime() - start.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return Math.ceil(diffDays / 7)
        }
        return null
    }

    return {
        t,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        error,
        setError,
        handleSave,
        handleOpenChange,
        weekCount: calculateWeeks()
    }
}

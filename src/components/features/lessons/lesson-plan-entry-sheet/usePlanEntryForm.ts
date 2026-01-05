import { useState, useEffect, useCallback } from 'react'
import type { DailyPlanEntry } from '@/store/prep-store'

export const TIME_SLOTS = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '13:30-14:30',
    '14:30-15:30',
    '15:30-16:30',
]

interface UsePlanEntryFormOptions {
    lesson: DailyPlanEntry | null
    onSave?: (id: string, updates: Partial<DailyPlanEntry>) => void
    onOpenChange: (open: boolean) => void
}

export function usePlanEntryForm({
    lesson,
    onSave,
    onOpenChange,
}: UsePlanEntryFormOptions) {
    const [date, setDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('')
    const [secondaryTimeSlot, setSecondaryTimeSlot] = useState<string>('none')
    const [practicalWork, setPracticalWork] = useState(false)
    const [homework, setHomework] = useState(false)
    const [mode, setMode] = useState<'fullClass' | 'groups'>('fullClass')

    // Initialize state when lesson changes
    useEffect(() => {
        if (lesson) {
            setDate(lesson.date || '')
            setTimeSlot(lesson.timeSlot || '')
            setSecondaryTimeSlot(lesson.secondaryTimeSlot || 'none')
            setPracticalWork(lesson.practicalWork || false)
            setHomework(lesson.homework || false)
            setMode(lesson.mode || 'fullClass')
        }
    }, [lesson])

    const handleSave = useCallback(() => {
        if (lesson && onSave) {
            onSave(lesson.id, {
                date,
                timeSlot,
                secondaryTimeSlot:
                    mode === 'groups' && secondaryTimeSlot !== 'none'
                        ? secondaryTimeSlot
                        : undefined,
                practicalWork,
                homework,
                mode,
            })
            onOpenChange(false)
        }
    }, [lesson, onSave, date, timeSlot, secondaryTimeSlot, practicalWork, homework, mode, onOpenChange])

    return {
        // State
        date,
        setDate,
        timeSlot,
        setTimeSlot,
        secondaryTimeSlot,
        setSecondaryTimeSlot,
        practicalWork,
        setPracticalWork,
        homework,
        setHomework,
        mode,
        setMode,
        // Actions
        handleSave,
    }
}

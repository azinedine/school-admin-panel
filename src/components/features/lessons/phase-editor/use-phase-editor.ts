import { useEffect, useRef } from 'react'
import { type Control, useFieldArray, useWatch } from 'react-hook-form'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { createDefaultPhases, type PhaseData } from './phase-config'

interface UsePhaseEditorOptions {
    control: Control<LessonPreparationFormData>
    totalDuration: number
}

interface UsePhaseEditorReturn {
    fields: { id: string; type: PhaseData['type']; content: string; duration_minutes: number }[]
    phases: PhaseData[] | undefined
    replace: (phases: PhaseData[]) => void
    currentTotalDuration: number
    isDurationMismatch: boolean
}

/**
 * Custom hook for phase editor logic
 * Single Responsibility: Handles all phase-related state and initialization
 */
export function usePhaseEditor({
    control,
    totalDuration,
}: UsePhaseEditorOptions): UsePhaseEditorReturn {
    const { fields, replace } = useFieldArray({
        control,
        name: 'phases',
    })

    const phases = useWatch({
        control,
        name: 'phases',
    })

    // Track initialization to avoid overwriting restored data
    const hasInitialized = useRef(false)

    // Auto-initialize phases with delay for localStorage restoration
    useEffect(() => {
        if (hasInitialized.current) return

        const timeout = setTimeout(() => {
            const hasContent = phases?.some(p => p.content?.trim().length > 0)

            if (fields.length === 0 && !hasContent) {
                replace(createDefaultPhases())
            }

            hasInitialized.current = true
        }, 150)

        return () => clearTimeout(timeout)
    }, [fields.length, phases, replace])

    // Calculate duration metrics
    const currentTotalDuration = phases?.reduce(
        (acc, curr) => acc + (Number(curr.duration_minutes) || 0),
        0
    ) ?? 0

    const isDurationMismatch = currentTotalDuration !== totalDuration

    return {
        fields: fields as UsePhaseEditorReturn['fields'],
        phases,
        replace,
        currentTotalDuration,
        isDurationMismatch,
    }
}

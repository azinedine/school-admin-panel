import { useState, memo, useEffect } from 'react'
import { useTimetable, useUpdateTimetable } from '@/hooks/use-timetable'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import { LessonPrepByClass } from '../lesson-prep-by-class/index.ts'
import { usePrepStore } from '@/store/prep-store'
import { TimetableLoading } from './TimetableLoading'
import { TimetableActions } from './TimetableActions'

/**
 * TimetableTab - Timetable and lesson planning
 * Part of unified Lesson Management feature
 */
export const TimetableTab = memo(function TimetableTab() {
    const {
        getAllTimetableSlots,
        initializeTimetable,
        setTimetable,
    } = usePrepStore()

    const { data: remoteTimetable, isLoading } = useTimetable()
    const updateTimetableMutation = useUpdateTimetable()

    // Sync remote data to store on load
    useEffect(() => {
        if (remoteTimetable && remoteTimetable.length > 0) {
            initializeTimetable(remoteTimetable)
        }
    }, [remoteTimetable, initializeTimetable])

    const [timetableDialogOpen, setTimetableDialogOpen] = useState(false)

    // Loading State
    if (isLoading) {
        return <TimetableLoading />
    }

    // Show lesson prep organized by class with optional edit button if timetable exists
    const hasTimetable = remoteTimetable && remoteTimetable.length > 0

    return (
        <div className="space-y-6">
            {hasTimetable && <TimetableActions onEditClick={() => setTimetableDialogOpen(true)} />}

            <LessonPrepByClass />

            {/* Timetable Setup/Edit Dialog */}
            <TimetableSetupDialog
                open={timetableDialogOpen}
                onOpenChange={setTimetableDialogOpen}
                existingTimetable={hasTimetable ? getAllTimetableSlots() : undefined}
                onSave={async (entries) => {
                    await updateTimetableMutation.mutateAsync(entries)
                    if (hasTimetable) {
                        setTimetable(entries)
                    } else {
                        initializeTimetable(entries)
                    }
                    setTimetableDialogOpen(false)
                }}
            />
        </div>
    )
})

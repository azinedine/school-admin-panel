import { useState, memo, useEffect } from 'react'
import { useTimetable, useUpdateTimetable } from '@/hooks/use-timetable'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import { LessonPrepByClass } from '../lesson-prep-by-class/index.ts'
import { usePrepStore } from '@/store/prep-store'
import { TimetableLoading } from './TimetableLoading'
import { TimetableActions } from './TimetableActions'
import { TimetableSetup } from './TimetableSetup'

/**
 * TimetableTab - Timetable and lesson planning
 * Part of unified Lesson Management feature
 */
export const TimetableTab = memo(function TimetableTab() {
    const {
        isTimetableInitialized,
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

    // If no timetable, show timetable setup
    if (!isTimetableInitialized && (!remoteTimetable || remoteTimetable.length === 0)) {
        return (
            <TimetableSetup
                open={timetableDialogOpen}
                onOpenChange={setTimetableDialogOpen}
                onSave={async (entries) => {
                    await updateTimetableMutation.mutateAsync(entries)
                    initializeTimetable(entries)
                }}
            />
        )
    }

    // Show lesson prep organized by class
    return (
        <div className="space-y-6">
            <TimetableActions onEditClick={() => setTimetableDialogOpen(true)} />

            <LessonPrepByClass />

            {/* Edit Timetable Dialog */}
            <TimetableSetupDialog
                open={timetableDialogOpen}
                onOpenChange={setTimetableDialogOpen}
                existingTimetable={getAllTimetableSlots()}
                onSave={async (entries) => {
                    await updateTimetableMutation.mutateAsync(entries)
                    setTimetable(entries)
                    setTimetableDialogOpen(false)
                }}
            />
        </div>
    )
})

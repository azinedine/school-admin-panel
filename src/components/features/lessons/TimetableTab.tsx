import { useState, memo, useEffect } from 'react'
import { useTimetable, useUpdateTimetable } from '@/hooks/use-timetable'
import { useTranslation } from 'react-i18next'
import { Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TimetableEmptyState } from '@/components/TimetableEmptyState'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import { LessonPrepByClass } from './lesson-prep-by-class/index.ts'
import { usePrepStore } from '@/store/prep-store'

/**
 * TimetableTab - Timetable and lesson planning
 * Part of unified Lesson Management feature
 */
export const TimetableTab = memo(function TimetableTab() {
    const { t } = useTranslation()
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
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // If no timetable, show timetable setup
    if (!isTimetableInitialized && (!remoteTimetable || remoteTimetable.length === 0)) {
        return (
            <div className="space-y-6">
                <TimetableEmptyState onSetupClick={() => setTimetableDialogOpen(true)} />

                <TimetableSetupDialog
                    open={timetableDialogOpen}
                    onOpenChange={setTimetableDialogOpen}
                    onSave={async (entries) => {
                        await updateTimetableMutation.mutateAsync(entries)
                        initializeTimetable(entries)
                    }}
                />
            </div>
        )
    }

    // Show lesson prep organized by class
    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimetableDialogOpen(true)}
                >
                    <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('pages.prep.timetable.edit')}
                </Button>
            </div>

            {/* Lessons Organized by Class */}
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

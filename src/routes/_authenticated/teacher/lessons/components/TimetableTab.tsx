import { useState, memo, useEffect } from 'react'
import { useTimetable, useUpdateTimetable } from '@/hooks/use-timetable'
import { useTranslation } from 'react-i18next'
import { Calendar, Settings, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TimetableEmptyState } from '@/components/TimetableEmptyState'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import { TermSetupDialog } from '@/components/TermSetupDialog'
import { LessonPrepByClass } from './LessonPrepByClass'
import { usePrepStore } from '@/store/prep-store'

/**
 * TimetableTab - Timetable and term planning context
 * Part of unified Lesson Management feature
 */
export const TimetableTab = memo(function TimetableTab() {
    const { t } = useTranslation()
    const {
        isTimetableInitialized,
        getAllTimetableSlots,
        initializeTimetable,
        setTimetable,
        getTermDates,
        setTermDates,
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
    const [termDialogOpen, setTermDialogOpen] = useState(false)

    const termDates = getTermDates()
    const hasTermDates = termDates.startDate && termDates.endDate

    // Loading State
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Step 1: If no timetable, show timetable setup
    if (!isTimetableInitialized && (!remoteTimetable || remoteTimetable.length === 0)) {
        return (
            <div className="space-y-6">
                <TimetableEmptyState onSetupClick={() => setTimetableDialogOpen(true)} />

                <TimetableSetupDialog
                    open={timetableDialogOpen}
                    onOpenChange={setTimetableDialogOpen}
                    onSave={async (entries) => {
                        // Save to backend
                        await updateTimetableMutation.mutateAsync(entries)
                        // Store update handles by the effect or manually if optimistic
                        initializeTimetable(entries)
                        // After timetable is set, prompt for term dates
                        setTermDialogOpen(true)
                    }}
                />

                <TermSetupDialog
                    open={termDialogOpen}
                    onOpenChange={setTermDialogOpen}
                    onSave={(startDate, endDate) => {
                        setTermDates(startDate, endDate)
                    }}
                />
            </div>
        )
    }

    // Step 2: If timetable exists but no term dates, show term setup
    if (!hasTermDates) {
        return (
            <div className="space-y-6">
                <Card className="p-8">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <Calendar className="h-16 w-16 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">
                                {t('pages.prep.termSetup.title')}
                            </h2>
                            <p className="text-muted-foreground">
                                {t('pages.prep.termSetup.description')}
                            </p>
                        </div>
                        <Button onClick={() => setTermDialogOpen(true)} size="lg">
                            <Calendar className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                            {t('pages.prep.termSetup.title')}
                        </Button>
                    </div>
                </Card>

                <TermSetupDialog
                    open={termDialogOpen}
                    onOpenChange={setTermDialogOpen}
                    onSave={(startDate, endDate) => {
                        setTermDates(startDate, endDate)
                    }}
                />
            </div>
        )
    }

    // Step 3: Show lesson prep organized by class
    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTermDialogOpen(true)}
                >
                    <Calendar className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('pages.prep.termSetup.title')}
                </Button>
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

            {/* Edit Term Dates Dialog */}
            <TermSetupDialog
                open={termDialogOpen}
                onOpenChange={setTermDialogOpen}
                existingStartDate={termDates.startDate || undefined}
                existingEndDate={termDates.endDate || undefined}
                onSave={(startDate, endDate) => {
                    setTermDates(startDate, endDate)
                }}
            />
        </div>
    )
})

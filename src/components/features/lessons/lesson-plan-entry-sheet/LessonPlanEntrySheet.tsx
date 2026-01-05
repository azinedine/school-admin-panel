import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import type { DailyPlanEntry } from '@/store/prep-store'
import { usePlanEntryForm } from './usePlanEntryForm'
import { PlanEntryHeader } from './PlanEntryHeader'
import { PlanEntryExecutionEdit } from './PlanEntryExecutionEdit'
import { PlanEntryExecutionView } from './PlanEntryExecutionView'
import { PlanEntryCoreContent } from './PlanEntryCoreContent'
import { PlanEntryElements } from './PlanEntryElements'
import { PlanEntryAssessment } from './PlanEntryAssessment'
import { PlanEntryFooter } from './PlanEntryFooter'

interface LessonPlanEntrySheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    lesson: DailyPlanEntry | null
    editMode?: boolean
    onSave?: (id: string, updates: Partial<DailyPlanEntry>) => void
}

export function LessonPlanEntrySheet({
    open,
    onOpenChange,
    lesson,
    editMode = false,
    onSave,
}: LessonPlanEntrySheetProps) {
    const { i18n } = useTranslation()
    const isRTL = i18n.dir() === 'rtl'

    const form = usePlanEntryForm({ lesson, onSave, onOpenChange })

    if (!lesson) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-[400px] sm:w-[540px] p-0 flex flex-col"
            >
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <PlanEntryHeader lesson={lesson} editMode={editMode} />

                        <Separator />

                        {/* Execution Details */}
                        {editMode ? (
                            <PlanEntryExecutionEdit
                                mode={form.mode}
                                setMode={form.setMode}
                                date={form.date}
                                setDate={form.setDate}
                                timeSlot={form.timeSlot}
                                setTimeSlot={form.setTimeSlot}
                                secondaryTimeSlot={form.secondaryTimeSlot}
                                setSecondaryTimeSlot={form.setSecondaryTimeSlot}
                                practicalWork={form.practicalWork}
                                setPracticalWork={form.setPracticalWork}
                                homework={form.homework}
                                setHomework={form.setHomework}
                            />
                        ) : (
                            <PlanEntryExecutionView lesson={lesson} />
                        )}

                        <Separator />

                        {/* Core Content */}
                        <PlanEntryCoreContent lesson={lesson} editMode={editMode} />

                        {/* Lesson Elements */}
                        <PlanEntryElements lesson={lesson} editMode={editMode} />

                        <Separator />

                        {/* Assessment */}
                        <PlanEntryAssessment lesson={lesson} editMode={editMode} />
                    </div>
                </div>

                {/* Footer - Only in Edit Mode */}
                {editMode && <PlanEntryFooter onSave={form.handleSave} />}
            </SheetContent>
        </Sheet>
    )
}

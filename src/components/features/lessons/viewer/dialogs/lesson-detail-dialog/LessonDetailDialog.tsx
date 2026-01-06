import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { type DailyPlanEntry, type LessonTemplate } from '@/store/prep-store'
import { LessonSelector } from '@/components/features/lessons'
import { useLessonDetailForm } from './use-lesson-detail-form.ts'
import { TemplateSelectorButton } from './TemplateSelectorButton.tsx'
import {
    BasicInfoSection,
    SchedulingSection,
    StructureSection,
    ElementsSection,
} from './sections/index.ts'

export interface LessonDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (lesson: Omit<DailyPlanEntry, 'id'>) => void
    onUpdate?: (id: string, updates: Partial<DailyPlanEntry>) => void
    day: string
    timeSlot: string
    group: string
    prefilledClass?: string
    existingLesson?: DailyPlanEntry
    initialTemplate?: LessonTemplate | null
    enableScheduling?: boolean
}

/**
 * Lesson Detail Dialog - SOLID Architecture
 * Now a thin presentation layer using extracted hook and section components
 */
export function LessonDetailDialog({
    open,
    onOpenChange,
    onSave,
    onUpdate,
    day,
    timeSlot,
    group,
    prefilledClass,
    existingLesson,
    initialTemplate,
    enableScheduling = false,
}: LessonDetailDialogProps) {
    const {
        t,
        formData,
        updateFormField,
        selectedTemplate,
        selectorOpen,
        setSelectorOpen,
        availableTemplates,
        activeGroups,
        groupTimes,
        handleTemplateSelect,
        handleClearTemplate,
        handleSave,
        toggleGroup,
        updateGroupTime,
        addLessonElement,
        updateLessonElement,
        removeLessonElement,
        isFormValid,
    } = useLessonDetailForm({
        existingLesson,
        prefilledClass,
        initialTemplate,
        day,
        timeSlot,
        group,
        enableScheduling,
        onSave,
        onUpdate,
        onOpenChange,
        open,
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {existingLesson ? t('pages.prep.editLesson') : t('pages.prep.addLesson')}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Template Selection */}
                    {availableTemplates.length > 0 && !existingLesson && (
                        <div className="space-y-4 pb-6 border-b">
                            <h3 className="text-sm font-semibold text-foreground">
                                {t('pages.prep.templateSection')}
                            </h3>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <TemplateSelectorButton
                                        t={t}
                                        selectedTemplate={selectedTemplate}
                                        onOpenSelector={() => setSelectorOpen(true)}
                                        onClearTemplate={handleClearTemplate}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <LessonSelector
                        open={selectorOpen}
                        onOpenChange={setSelectorOpen}
                        onSelect={handleTemplateSelect}
                        templates={availableTemplates}
                    />

                    {/* Section 1: Basic Information */}
                    <BasicInfoSection
                        t={t}
                        formData={formData}
                        updateFormField={updateFormField}
                    />

                    {/* Section 2: Scheduling (conditional) */}
                    {enableScheduling && (
                        <SchedulingSection
                            t={t}
                            formData={formData}
                            updateFormField={updateFormField}
                            activeGroups={activeGroups}
                            groupTimes={groupTimes}
                            toggleGroup={toggleGroup}
                            updateGroupTime={updateGroupTime}
                            existingLesson={existingLesson}
                        />
                    )}

                    {/* Section 3: Structure */}
                    <StructureSection
                        t={t}
                        formData={formData}
                        updateFormField={updateFormField}
                    />

                    {/* Section 4: Elements & Evaluation */}
                    <ElementsSection
                        t={t}
                        formData={formData}
                        updateFormField={updateFormField}
                        addLessonElement={addLessonElement}
                        updateLessonElement={updateLessonElement}
                        removeLessonElement={removeLessonElement}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={!isFormValid}>
                        {t('common.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

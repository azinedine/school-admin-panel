import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LessonSelector } from '../LessonSelector.tsx'
import { LessonPlanEntrySheet } from '../LessonPlanEntrySheet'
import { useLessonPrepByClass } from './use-lesson-prep-by-class.ts'
import { LessonsTable } from './LessonsTable.tsx'
import { StatusNoteDialog } from './StatusNoteDialog.tsx'

/**
 * LessonPrepByClass - SOLID Architecture
 * Uses extracted hook and sub-components
 */
export function LessonPrepByClass() {
    const {
        t,
        classes,
        selectedClass,
        setSelectedClass,
        classLessons,
        selectorOpen,
        setSelectorOpen,
        templates,
        addedLessonNumbers,
        defaultSelectorYear,
        availableSelectorYears,
        statusNoteOpen,
        setStatusNoteOpen,
        statusNote,
        setStatusNote,
        pendingStatus,
        detailsOpen,
        setDetailsOpen,
        detailsLesson,
        editMode,
        formatDate,
        handleAddLesson,
        handleTemplateSelected,
        handleDelete,
        handleViewDetails,
        handleEdit,
        handleSaveDetails,
        handleStatusChange,
        handleSaveStatusNote,
    } = useLessonPrepByClass()

    // Empty state when no classes
    if (classes.length === 0) {
        return (
            <Card className="p-8">
                <div className="text-center text-muted-foreground">
                    <p>{t('pages.prep.timetable.noSlotsForDay')}</p>
                </div>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Class Selector */}
                <Tabs value={selectedClass} onValueChange={setSelectedClass}>
                    <TabsList className="w-full justify-start">
                        {classes.map((className) => (
                            <TabsTrigger key={className} value={className}>
                                {className}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Lessons Table */}
                <LessonsTable
                    t={t}
                    lessons={classLessons}
                    formatDate={formatDate}
                    onView={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                    onAdd={handleAddLesson}
                />
            </div>

            {/* Lesson Selector */}
            <LessonSelector
                open={selectorOpen}
                onOpenChange={setSelectorOpen}
                onSelect={handleTemplateSelected}
                templates={templates}
                addedLessonNumbers={addedLessonNumbers}
                defaultYear={defaultSelectorYear as '1st' | '2nd' | '3rd' | '4th'}
                availableYears={availableSelectorYears}
            />

            {/* Status Note Dialog */}
            <StatusNoteDialog
                t={t}
                open={statusNoteOpen}
                onOpenChange={setStatusNoteOpen}
                pendingStatus={pendingStatus}
                statusNote={statusNote}
                onNoteChange={setStatusNote}
                onSave={handleSaveStatusNote}
            />

            {/* Lesson Details Sheet */}
            <LessonPlanEntrySheet
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                lesson={detailsLesson}
                editMode={editMode}
                onSave={handleSaveDetails}
            />
        </>
    )
}

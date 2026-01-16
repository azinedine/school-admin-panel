import { useMemo, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDirection } from "@/hooks/use-direction"
import { useAttendanceStore } from "@/store/attendance-store"
import { useGradeStudents, useUpdatePedagogicalTracking } from "@/features/grades"
import type { CalculatedStudentGrade } from "../grade-sheet/types"
import {
  type GradeSheetTableProps,
} from "../grade-sheet/types"
import {
  AttendanceDialog,
  AttendanceHistoryDialog,
  MoveStudentDialog,
  RemoveStudentDialog,
  AddStudentDialog,
} from "../grade-sheet/dialogs"
import {
  SortableStudentRow,
  SortableHeader,
  StudentInfoSidebar,
  GradeSheetToolbar,
  ClassSelector,
} from "../grade-sheet/components"
import {
  useGradeCalculations,
  useGradeFiltering,
  useGradeStatistics,
  useGradeMutations,
  useGradeDialogs,
  useGradeDnD,
  useGradeTableState
} from "../grade-sheet/hooks"

export function GradeSheetTable({ classId: selectedClassId, term: selectedTerm, classes, onClassSelect, isReadOnly = false }: GradeSheetTableProps) {
  const { t } = useTranslation()
  const { isRTL } = useDirection()

  // --- 1. Data Layer ---
  const { data: studentsRaw = [] } = useGradeStudents(selectedClassId || '', selectedTerm)

  // Calculate academic year
  const selectedYear = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const startYear = month >= 8 ? year : year - 1
    return `${startYear}-${startYear + 1}`
  }, [])

  // Attendance Store (Legacy store integration)
  const {
    getStudentAbsenceCount,
    getStudentTardinessCount,
    addRecord,
    removeRecord,
    getStudentRecords,
    records // Subscribe to all records to trigger re-renders on change
  } = useAttendanceStore()

  const { calculatedStudents } = useGradeCalculations(
    studentsRaw,
    selectedClassId || '',
    getStudentAbsenceCount,
    getStudentTardinessCount,
    selectedYear,
    selectedTerm,
    records // Pass full records to force recalculation when they change
  )


  // Integrate Attendance Counts into Students
  // This is the last step of data prep before filtering



  // --- 2. State Layer ---
  const tableState = useGradeTableState()
  const dialogs = useGradeDialogs()

  // --- 5. Interaction Layer ---
  const {
    handleCreateStudent,
    handleUpdateStudent,
    handleCellEdit,
    handleRemoveStudent,
    handleMoveStudent,
    handleReorderStudents
  } = useGradeMutations(selectedClassId || '', String(selectedTerm))

  // Pedagogical Tracking Mutations
  const updateTrackingMutation = useUpdatePedagogicalTracking()
  const [trackingLoading, setTrackingLoading] = useState<{ studentId: string; field: 'oral_interrogation' | 'notebook_checked' } | null>(null)

  const handleToggleOralInterrogation = useCallback((student: CalculatedStudentGrade) => {
    setTrackingLoading({ studentId: student.id, field: 'oral_interrogation' })
    updateTrackingMutation.mutate(
      {
        studentId: student.id,
        term: selectedTerm,
        oral_interrogation: !student.oralInterrogation,
      },
      {
        onSettled: () => setTrackingLoading(null),
      }
    )
  }, [updateTrackingMutation, selectedTerm])

  const handleToggleNotebookChecked = useCallback((student: CalculatedStudentGrade) => {
    setTrackingLoading({ studentId: student.id, field: 'notebook_checked' })
    updateTrackingMutation.mutate(
      {
        studentId: student.id,
        term: selectedTerm,
        notebook_checked: !student.notebookChecked,
      },
      {
        onSettled: () => setTrackingLoading(null),
      }
    )
  }, [updateTrackingMutation, selectedTerm])

  const statistics = useGradeStatistics(calculatedStudents)

  // --- 4. Filtering & Stats Layer ---
  const { processedStudents, groupSplitIndex } = useGradeFiltering({
    students: calculatedStudents,
    searchQuery: tableState.searchQuery,
    sortField: tableState.sortField,
    sortDirection: tableState.sortDirection,
    showGroups: tableState.showGroups,
    showSpecialCasesOnly: tableState.showSpecialCasesOnly,
    showAbsencesOnly: tableState.showAbsencesOnly,
    showLatenessOnly: tableState.showLatenessOnly,
    absenceFilterDate: tableState.absenceFilterDate,
    attendanceRecords: records
  })




  // --- 5. Interaction Layer ---

  // Drag and Drop
  const { sensors, handleDragEnd } = useGradeDnD(
    processedStudents,
    handleReorderStudents
  )

  // Class Selection
  const handleClassSelect = useCallback((classIdToSelect: string) => {
    onClassSelect(classIdToSelect)
    window.history.replaceState(null, '', `${window.location.pathname}?class=${classIdToSelect}`)
  }, [onClassSelect])

  // Get student count helper
  const getClassStudentCount = useCallback((classIdToCheck: string) => {
    const cls = classes.find(c => c.id === classIdToCheck)
    return cls?.students?.length ?? 0
  }, [classes])


  // --- 6. Event Handlers (Connecting UI to Mutations/Dialogs) ---

  // Custom wrapper for Add Dialog to handle the form data which is currently local to the dialog
  // The AddStudentDialog component manages its own form state?
  // Checking previous code: No, GradeSheetTable managed `newStudent` state.
  // We need to restore that state.
  const [newStudent, setNewStudent] = useState<{
    id: string
    lastName: string
    firstName: string
    dateOfBirth: string
  }>({
    id: '',
    lastName: '',
    firstName: '',
    dateOfBirth: '2013-01-01',
  })

  const onAddStudentConfirm = async () => {
    if (!selectedClassId) return
    await handleCreateStudent({
      classId: selectedClassId,
      id: newStudent.id.trim() || undefined, // Pass id as valid StudentGrade property
      lastName: newStudent.lastName.trim(),
      firstName: newStudent.firstName.trim(),
      dateOfBirth: newStudent.dateOfBirth
    })
    dialogs.setAddStudentOpen(false)
    setNewStudent({ id: '', lastName: '', firstName: '', dateOfBirth: '2013-01-01' })
  }

  // Attendance Confirm Handler
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceTime, setAttendanceTime] = useState(new Date().toTimeString().slice(0, 5))

  const onAttendanceConfirm = () => {
    if (!dialogs.attendanceDialog.student) return

    addRecord({
      studentId: dialogs.attendanceDialog.student.id,
      studentName: `${dialogs.attendanceDialog.student.firstName} ${dialogs.attendanceDialog.student.lastName}`,
      classId: selectedClassId || '',
      date: attendanceDate,
      time: attendanceTime,
      year: selectedYear,
      term: selectedTerm,
      type: dialogs.attendanceDialog.type
    })
    dialogs.setAttendanceDialog(prev => ({ ...prev, open: false }))
  }


  // Compute records for history dialog
  const historyRecords = useMemo(() => {
    if (!dialogs.historyDialog.student) return []
    return getStudentRecords(
      dialogs.historyDialog.student.id,
      selectedYear,
      selectedTerm
    )
  }, [dialogs.historyDialog.student, selectedYear, selectedTerm, records])

  // --- 7. Render ---

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-lg text-muted-foreground">{t('pages.grades.empty.title')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('pages.grades.empty.description')}</p>
      </div>
    )
  }

  // Guard: If no class is selected, show a prompt or empty state, but still show the class selector
  if (!selectedClassId) {
    return (
      <div className="flex flex-col gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10" />
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
            getClassStudentCount={getClassStudentCount}
            t={t}
          />
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-md border-dashed">
          <p className="text-lg text-muted-foreground font-medium">{t('pages.grades.selectClass.title')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('pages.grades.selectClass.description')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Class Navigation */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10" />
        <ClassSelector
          classes={classes}
          selectedClassId={selectedClassId}
          onClassSelect={handleClassSelect}
          getClassStudentCount={getClassStudentCount}
          t={t}
        />
      </div>

      <div className="space-y-4">
        <GradeSheetToolbar
          statistics={statistics}
          searchQuery={tableState.searchQuery}
          onSearchChange={tableState.setSearchQuery}
          showGroups={tableState.showGroups}
          onToggleGroups={() => tableState.setShowGroups(!tableState.showGroups)}
          showSpecialCasesOnly={tableState.showSpecialCasesOnly}
          onToggleSpecialCases={() => tableState.setShowSpecialCasesOnly(!tableState.showSpecialCasesOnly)}
          showAbsencesOnly={tableState.showAbsencesOnly}
          onToggleAbsences={() => tableState.setShowAbsencesOnly(!tableState.showAbsencesOnly)}
          showLatenessOnly={tableState.showLatenessOnly}
          onToggleLateness={() => tableState.setShowLatenessOnly(!tableState.showLatenessOnly)}
          absenceFilterDate={tableState.absenceFilterDate}
          onAbsenceFilterDateChange={tableState.setAbsenceFilterDate}
          canAddStudent={!!selectedClassId}
          onAddStudent={() => dialogs.setAddStudentOpen(true)}
          t={t}
        />

        <div className="hidden sm:block text-sm text-muted-foreground">
          <p>* {t('pages.grades.hints.clickToEdit')}</p>
          <p>* {t('pages.grades.hints.autoCalculate')}</p>
        </div>

        <div className="rounded-md border overflow-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-12 text-center">#</TableHead>
                  {tableState.showGroups && <TableHead className="w-20 text-center">{t('pages.grades.table.group')}</TableHead>}
                  <TableHead className="w-10"></TableHead>
                  <SortableHeader field="id" onSort={tableState.handleSort}>{t('pages.grades.table.id')}</SortableHeader>
                  <SortableHeader field="lastName" onSort={tableState.handleSort}>{t('pages.grades.table.lastName')}</SortableHeader>
                  <SortableHeader field="firstName" onSort={tableState.handleSort}>{t('pages.grades.table.firstName')}</SortableHeader>
                  <SortableHeader field="dateOfBirth" onSort={tableState.handleSort}>{t('pages.grades.table.dateOfBirth')}</SortableHeader>
                  <SortableHeader field="behavior" onSort={tableState.handleSort}>{t('pages.grades.table.behavior')}</SortableHeader>
                  <SortableHeader field="applications" onSort={tableState.handleSort}>{t('pages.grades.table.applications')}</SortableHeader>
                  <SortableHeader field="notebook" onSort={tableState.handleSort}>{t('pages.grades.table.notebook')}</SortableHeader>
                  <SortableHeader field="oralInterrogation" onSort={tableState.handleSort}>{t('pages.grades.table.oralInterrogation')}</SortableHeader>
                  <SortableHeader field="notebookChecked" onSort={tableState.handleSort}>{t('pages.grades.table.notebookChecked')}</SortableHeader>
                  <SortableHeader field="lateness" onSort={tableState.handleSort}>{t('pages.grades.table.lateness')}</SortableHeader>
                  <SortableHeader field="absences" onSort={tableState.handleSort}>{t('pages.grades.table.absences')}</SortableHeader>
                  <SortableHeader field="activityAverage" highlight onSort={tableState.handleSort}>{t('pages.grades.table.activityAverage')}</SortableHeader>
                  <SortableHeader field="assignment" highlight onSort={tableState.handleSort}>{t('pages.grades.table.assignment')}</SortableHeader>
                  <SortableHeader field="exam" highlight onSort={tableState.handleSort}>{t('pages.grades.table.exam')}</SortableHeader>
                  <SortableHeader field="finalAverage" highlight onSort={tableState.handleSort}>{t('pages.grades.table.finalAverage')}</SortableHeader>
                  <SortableHeader field="remarks" onSort={tableState.handleSort}>{t('pages.grades.table.remarks')}</SortableHeader>
                </TableRow>
              </TableHeader>
              <SortableContext items={processedStudents.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <TableBody>
                  {processedStudents.map((student, index) => {
                    const studentNumber = index + 1
                    const groupNumber = studentNumber <= groupSplitIndex ? 1 : 2

                    return (
                      <SortableStudentRow
                        key={student.id}
                        student={student}
                        index={index}
                        studentNumber={studentNumber}
                        groupNumber={groupNumber}
                        showGroups={tableState.showGroups}
                        editingCell={tableState.editingCell}
                        setEditingCell={tableState.setEditingCell}
                        handleCellEdit={handleCellEdit}
                        updateStudent={handleUpdateStudent}
                        onMoveStudent={dialogs.openMove}
                        onRemoveStudent={dialogs.openRemove}
                        onViewStudentInfo={dialogs.openStudentInfo}
                        onOpenAttendanceDialog={dialogs.openAttendance}
                        onOpenHistoryDialog={dialogs.openHistory}
                        onToggleOralInterrogation={handleToggleOralInterrogation}
                        onToggleNotebookChecked={handleToggleNotebookChecked}
                        trackingLoading={trackingLoading}
                        isReadOnly={isReadOnly}
                        t={t}
                      />
                    )
                  })}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </div>
      </div>

      {/* --- Dialogs --- */}

      <AttendanceDialog
        open={dialogs.attendanceDialog.open}
        onOpenChange={(open) => dialogs.setAttendanceDialog(prev => ({ ...prev, open }))}
        student={dialogs.attendanceDialog.student}
        type={dialogs.attendanceDialog.type}
        date={attendanceDate}
        time={attendanceTime}
        onDateChange={setAttendanceDate}
        onTimeChange={setAttendanceTime}
        onConfirm={onAttendanceConfirm}
        t={t}
      />

      <AttendanceHistoryDialog
        open={dialogs.historyDialog.open}
        onOpenChange={(open) => dialogs.setHistoryDialog(prev => ({ ...prev, open }))}
        student={dialogs.historyDialog.student}
        records={historyRecords}
        // Simplified deletions - pass state or handler if needed, currently reusing local logic
        recordToDelete={dialogs.historyDialog.recordToDelete}
        onDeleteClick={(id) => dialogs.setHistoryDialog(prev => ({ ...prev, recordToDelete: id }))}
        onDeleteConfirm={(id) => {
          removeRecord(id)
          dialogs.setHistoryDialog(prev => ({ ...prev, recordToDelete: null }))
        }}
        t={t}
      />

      <MoveStudentDialog
        open={dialogs.moveStudentDialog.open}
        onOpenChange={(open) => dialogs.setMoveStudentDialog({ open, student: open ? dialogs.moveStudentDialog.student : null })}
        student={dialogs.moveStudentDialog.student}
        classes={classes}
        onMove={async (sid, tid) => {
          const success = await handleMoveStudent(sid, tid)
          if (success) {
            dialogs.setMoveStudentDialog({ open: false, student: null })
            if (tid !== selectedClassId) handleClassSelect(tid)
          }
        }}
        t={t}
      />

      <RemoveStudentDialog
        open={dialogs.removeStudentDialog.open}
        onOpenChange={(open) => dialogs.setRemoveStudentDialog({ open, student: open ? dialogs.removeStudentDialog.student : null })}
        student={dialogs.removeStudentDialog.student}
        onConfirm={async (id) => {
          const success = await handleRemoveStudent(id)
          if (success) dialogs.setRemoveStudentDialog({ open: false, student: null })
        }}
        t={t}
      />

      <AddStudentDialog
        open={dialogs.addStudentOpen}
        onOpenChange={dialogs.setAddStudentOpen}
        newStudent={newStudent}
        onStudentChange={setNewStudent}
        onAdd={onAddStudentConfirm}
        t={t}
      />

      <StudentInfoSidebar
        open={dialogs.studentInfoSidebar.open}
        onOpenChange={(open) => dialogs.setStudentInfoSidebar({ open, student: open ? dialogs.studentInfoSidebar.student : null })}
        student={dialogs.studentInfoSidebar.student}
        selectedYear={selectedYear}
        selectedTerm={selectedTerm}
        isRTL={isRTL}
        t={t}
        className={classes.find(c => c.id === selectedClassId)?.name}
      />
    </div>
  )
}

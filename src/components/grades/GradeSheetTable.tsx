import { useMemo, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDirection } from "@/hooks/use-direction"
import { useAttendanceStore } from "@/store/attendance-store"
import { toast } from "sonner"
import {
  useGradeStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useMoveStudent,
  useReorderStudents,
  useUpdateGrade,
} from "@/features/grades"
import type {
  StudentGrade,
  CalculatedStudentGrade,
  GradeSheetTableProps,
  SortField,
  SortDirection,
} from "./grade-sheet/types"
import {
  calculateContinuousAssessment,
  calculateFinalAverage,
  getRemarksKey,
} from "./grade-sheet/utils"
import {
  AttendanceDialog,
  AttendanceHistoryDialog,
  MoveStudentDialog,
  RemoveStudentDialog,
  AddStudentDialog,
} from "./grade-sheet/dialogs"
import {
  SortableStudentRow,
  SortableHeader,
  StudentInfoSidebar,
  GradeSheetToolbar,
  ClassSelector,
} from "./grade-sheet/components"



export function GradeSheetTable({ classId: selectedClassId, term: selectedTerm, classes, onClassSelect }: GradeSheetTableProps) {
  const { t } = useTranslation()
  const { isRTL } = useDirection()

  // Calculate academic year (same logic as GradesPage)
  const selectedYear = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const startYear = month >= 8 ? year : year - 1
    return `${startYear}-${startYear + 1}`
  }, [])

  // API hooks
  const { data: studentsRaw = [] } = useGradeStudents(selectedClassId || '', selectedTerm)
  const createStudentMutation = useCreateStudent()
  const updateStudentMutation = useUpdateStudent()
  const deleteStudentMutation = useDeleteStudent()
  const moveStudentMutation = useMoveStudent()
  const reorderStudentsMutation = useReorderStudents()
  const updateGradeMutation = useUpdateGrade()

  // Convert API students to local format with classId
  const students: StudentGrade[] = useMemo(() => {
    return studentsRaw.map(s => ({
      id: s.id,
      classId: selectedClassId || '',
      lastName: s.last_name,
      firstName: s.first_name,
      dateOfBirth: s.date_of_birth || '',
      behavior: Number(s.behavior) || 5,
      applications: Number(s.applications) || 5,
      notebook: Number(s.notebook) || 5,
      assignment: Number(s.assignment) || 0,
      exam: Number(s.exam) || 0,
      specialCase: s.special_case || undefined,
    }))
  }, [studentsRaw, selectedClassId])

  const { addRecord, removeRecord, getStudentRecords, getStudentAbsenceCount, getStudentTardinessCount, records } = useAttendanceStore()

  // Handle class selection - updates URL
  const handleClassSelect = useCallback((classIdToSelect: string) => {
    onClassSelect(classIdToSelect)
    window.history.replaceState(null, '', `${window.location.pathname}?class=${classIdToSelect}`)
  }, [onClassSelect])

  // Get student count for a class
  const getClassStudentCount = useCallback((classIdToCheck: string) => {
    const cls = classes.find(c => c.id === classIdToCheck)
    return cls?.students?.length ?? 0
  }, [classes])

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [showGroups, setShowGroups] = useState(true)
  const [showSpecialCasesOnly, setShowSpecialCasesOnly] = useState(false)

  // Attendance dialog state
  const [attendanceDialog, setAttendanceDialog] = useState<{
    open: boolean
    student: CalculatedStudentGrade | null
    type: 'absence' | 'tardiness'
  }>({ open: false, student: null, type: 'absence' })
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceTime, setAttendanceTime] = useState(new Date().toTimeString().slice(0, 5))

  // History dialog state
  const [historyDialog, setHistoryDialog] = useState<{
    open: boolean
    student: CalculatedStudentGrade | null
  }>({ open: false, student: null })
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)

  // Student management dialog state
  const [moveStudentDialog, setMoveStudentDialog] = useState<{
    open: boolean
    student: CalculatedStudentGrade | null
  }>({ open: false, student: null })
  const [removeStudentDialog, setRemoveStudentDialog] = useState<{
    open: boolean
    student: CalculatedStudentGrade | null
  }>({ open: false, student: null })
  const [addStudentDialog, setAddStudentDialog] = useState(false)
  const [studentInfoSidebar, setStudentInfoSidebar] = useState<{
    open: boolean
    student: CalculatedStudentGrade | null
  }>({ open: false, student: null })
  const [newStudent, setNewStudent] = useState({
    id: '',
    lastName: '',
    firstName: '',
    dateOfBirth: '2013-01-01',
  })

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px drag before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => d === "asc" ? "desc" : d === "desc" ? null : "asc")
        return field
      }
      setSortDirection("asc")
      return field
    })
  }, [])

  // Calculate student grades with attendance data - filter by selected class
  const calculatedStudents = useMemo((): CalculatedStudentGrade[] => {
    return students
      .filter(student => student.classId === selectedClassId)
      .map(student => {
        const absenceCount = getStudentAbsenceCount(student.id, selectedYear, selectedTerm)
        const tardinessCount = getStudentTardinessCount(student.id, selectedYear, selectedTerm)

        const activityAverage = calculateContinuousAssessment(
          student.behavior,
          student.applications,
          student.notebook,
          tardinessCount,
          absenceCount
        )

        const finalAverage = calculateFinalAverage(activityAverage, student.assignment, student.exam)

        return {
          ...student,
          lateness: tardinessCount,
          absences: absenceCount,
          activityAverage,
          finalAverage,
          remarks: getRemarksKey(finalAverage)
        }
      })
  }, [students, records, selectedClassId, getStudentAbsenceCount, getStudentTardinessCount, selectedYear, selectedTerm])

  const handleCellEdit = useCallback(async (id: string, field: keyof StudentGrade, value: string, keepOpen: boolean = false) => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return

    // Update via API
    try {
      await updateGradeMutation.mutateAsync({
        studentId: id,
        term: selectedTerm,
        [field]: numValue,
      })
    } catch (error) {
      toast.error(t('common.error'))
    }
    if (!keepOpen) {
      setEditingCell(null)
    }
  }, [updateGradeMutation, selectedTerm, t])

  const handleRecordAttendance = useCallback(() => {
    if (!attendanceDialog.student) return

    const student = attendanceDialog.student
    const studentName = `${student.firstName} ${student.lastName}`

    // Add to persistent store - triggers immediate recalculation
    addRecord({
      studentId: student.id,
      studentName,
      classId: 'class-1',
      date: attendanceDate,
      time: attendanceTime,
      year: selectedYear,
      term: selectedTerm,
      type: attendanceDialog.type
    })

    const messageKey = attendanceDialog.type === 'absence'
      ? 'pages.grades.attendance.absenceRecorded'
      : 'pages.grades.attendance.tardinessRecorded'

    toast.success(t(messageKey, { name: studentName }))
    setAttendanceDialog({ open: false, student: null, type: 'absence' })
  }, [attendanceDialog, attendanceDate, attendanceTime, addRecord, t, selectedYear, selectedTerm])

  const openAttendanceDialog = useCallback((student: CalculatedStudentGrade, type: 'absence' | 'tardiness') => {
    setAttendanceDate(new Date().toISOString().split('T')[0])
    setAttendanceTime(new Date().toTimeString().slice(0, 5))
    setAttendanceDialog({ open: true, student, type })
  }, [])

  const openHistoryDialog = useCallback((student: CalculatedStudentGrade) => {
    setHistoryDialog({ open: true, student })
  }, [])

  const handleDeleteRecord = useCallback((id: string) => {
    removeRecord(id)
    toast.success(t('pages.grades.attendance.deleted'))
    setRecordToDelete(null)
  }, [removeRecord, t])

  const handleMoveStudent = useCallback(async (studentId: string, newClassId: string) => {
    try {
      await moveStudentMutation.mutateAsync({ studentId, grade_class_id: newClassId })
      toast.success(t('pages.grades.studentManagement.moved'))
      setMoveStudentDialog({ open: false, student: null })
      // Switch to the new class if it's different from current
      if (newClassId !== selectedClassId) {
        handleClassSelect(newClassId)
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [moveStudentMutation, t, selectedClassId, handleClassSelect])

  const handleRemoveStudent = useCallback(async (studentId: string) => {
    try {
      await deleteStudentMutation.mutateAsync(studentId)
      toast.success(t('pages.grades.studentManagement.removed'))
      setRemoveStudentDialog({ open: false, student: null })
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [deleteStudentMutation, t])

  const handleAddStudent = useCallback(async () => {
    if (!selectedClassId) {
      toast.error(t('pages.grades.addStudent.noClassSelected'))
      return
    }

    // Validation
    if (!newStudent.lastName.trim() || !newStudent.firstName.trim()) {
      toast.error(t('pages.grades.addStudent.nameRequired'))
      return
    }

    try {
      await createStudentMutation.mutateAsync({
        classId: selectedClassId,
        student_number: newStudent.id.trim() || undefined,
        last_name: newStudent.lastName.trim(),
        first_name: newStudent.firstName.trim(),
        date_of_birth: newStudent.dateOfBirth,
      })

      toast.success(t('pages.grades.addStudent.success'))
      setAddStudentDialog(false)
      setNewStudent({
        id: '',
        lastName: '',
        firstName: '',
        dateOfBirth: '2013-01-01',
      })
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [selectedClassId, newStudent, createStudentMutation, t])

  // Handler for updating student special case (used by SortableStudentRow)
  const updateStudent = useCallback(async (studentId: string, updates: { specialCase?: string }) => {
    try {
      await updateStudentMutation.mutateAsync({
        studentId,
        special_case: updates.specialCase || null,
      })
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [updateStudentMutation, t])

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...calculatedStudents]

    // Filter by special cases if toggle is on
    if (showSpecialCasesOnly) {
      result = result.filter(student => student.specialCase !== undefined && student.specialCase !== '')
    }

    if (searchQuery) {
      result = result.filter(student =>
        student.lastName.includes(searchQuery) ||
        student.firstName.includes(searchQuery)
      )
    }

    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal, 'ar')
            : bVal.localeCompare(aVal, 'ar')
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }

        return 0
      })
    }

    return result
  }, [calculatedStudents, searchQuery, sortField, sortDirection, showSpecialCasesOnly])

  // Handle drag end - reorder students and persist
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id || !selectedClassId) return

    const oldIndex = filteredAndSortedStudents.findIndex(s => s.id === active.id)
    const newIndex = filteredAndSortedStudents.findIndex(s => s.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(filteredAndSortedStudents, oldIndex, newIndex)
      try {
        await reorderStudentsMutation.mutateAsync({
          classId: selectedClassId,
          order: reordered.map(s => s.id)
        })
      } catch (error) {
        toast.error(t('common.error'))
      }
    }
  }, [filteredAndSortedStudents, selectedClassId, reorderStudentsMutation, t])

  const statistics = useMemo(() => {
    // Exclude special cases from statistics
    const normalStudents = calculatedStudents.filter(s => !s.specialCase || s.specialCase === '')
    const total = normalStudents.length
    const specialCaseCount = calculatedStudents.length - total

    if (total === 0) return { total: 0, specialCaseCount, classAverage: '0', passRate: '0', failRate: '0' }

    const classAverage = normalStudents.reduce((sum, s) => sum + s.finalAverage, 0) / total
    const passCount = normalStudents.filter(s => s.finalAverage >= 10).length
    const failCount = total - passCount

    return {
      total,
      specialCaseCount,
      classAverage: classAverage.toFixed(2),
      passRate: ((passCount / total) * 100).toFixed(1),
      failRate: ((failCount / total) * 100).toFixed(1),
    }
  }, [calculatedStudents])



  // If no classes, show empty state message
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="text-lg text-muted-foreground">
          {t('pages.grades.empty.title')}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('pages.grades.empty.description')}
        </p>
      </div>
    )
  }


  return (
    <div className="flex flex-col gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Class Navigation Tabs */}
      <div className="relative">
        {/* Gradient scroll indicators */}
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

      {/* Content Area */}
      <div className="space-y-4">
        <GradeSheetToolbar
          statistics={statistics}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showGroups={showGroups}
          onToggleGroups={() => setShowGroups(!showGroups)}
          showSpecialCasesOnly={showSpecialCasesOnly}
          onToggleSpecialCases={() => setShowSpecialCasesOnly(!showSpecialCasesOnly)}
          canAddStudent={!!selectedClassId}
          onAddStudent={() => setAddStudentDialog(true)}
          t={t}
        />

        {/* Hints - hidden on mobile */}
        <div className="hidden sm:block text-sm text-muted-foreground">
          <p>* {t('pages.grades.hints.clickToEdit')}</p>
          <p>* {t('pages.grades.hints.autoCalculate')}</p>
        </div>

        {/* Table - scrollable container */}
        <div className="rounded-md border overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className="min-w-[800px]">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-12 text-center">#</TableHead>
                  {showGroups && <TableHead className="w-20 text-center">{t('pages.grades.table.group')}</TableHead>}
                  <TableHead className="w-10"></TableHead>
                  <SortableHeader field="id" onSort={handleSort}>{t('pages.grades.table.id')}</SortableHeader>
                  <SortableHeader field="lastName" onSort={handleSort}>{t('pages.grades.table.lastName')}</SortableHeader>
                  <SortableHeader field="firstName" onSort={handleSort}>{t('pages.grades.table.firstName')}</SortableHeader>
                  <SortableHeader field="dateOfBirth" onSort={handleSort}>{t('pages.grades.table.dateOfBirth')}</SortableHeader>
                  <SortableHeader field="behavior" onSort={handleSort}>{t('pages.grades.table.behavior')}</SortableHeader>
                  <SortableHeader field="applications" onSort={handleSort}>{t('pages.grades.table.applications')}</SortableHeader>
                  <SortableHeader field="notebook" onSort={handleSort}>{t('pages.grades.table.notebook')}</SortableHeader>
                  <SortableHeader field="lateness" onSort={handleSort}>{t('pages.grades.table.lateness')}</SortableHeader>
                  <SortableHeader field="absences" onSort={handleSort}>{t('pages.grades.table.absences')}</SortableHeader>
                  <SortableHeader field="activityAverage" highlight onSort={handleSort}>{t('pages.grades.table.activityAverage')}</SortableHeader>
                  <SortableHeader field="assignment" highlight onSort={handleSort}>{t('pages.grades.table.assignment')}</SortableHeader>
                  <SortableHeader field="exam" highlight onSort={handleSort}>{t('pages.grades.table.exam')}</SortableHeader>
                  <SortableHeader field="finalAverage" highlight onSort={handleSort}>{t('pages.grades.table.finalAverage')}</SortableHeader>
                  <SortableHeader field="remarks" onSort={handleSort}>{t('pages.grades.table.remarks')}</SortableHeader>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={filteredAndSortedStudents.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {filteredAndSortedStudents.map((student, index) => {
                    const studentNumber = index + 1
                    const totalStudents = filteredAndSortedStudents.length
                    const midpoint = Math.ceil(totalStudents / 2)
                    const groupNumber = studentNumber <= midpoint ? 1 : 2

                    return (
                      <SortableStudentRow
                        key={student.id}
                        student={student}
                        index={index}
                        studentNumber={studentNumber}
                        groupNumber={groupNumber}
                        showGroups={showGroups}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        handleCellEdit={handleCellEdit}
                        updateStudent={updateStudent}
                        onMoveStudent={(s) => setMoveStudentDialog({ open: true, student: s })}
                        onRemoveStudent={(s) => setRemoveStudentDialog({ open: true, student: s })}
                        onViewStudentInfo={(s) => setStudentInfoSidebar({ open: true, student: s })}
                        onOpenAttendanceDialog={openAttendanceDialog}
                        onOpenHistoryDialog={openHistoryDialog}
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

      {/* Attendance Dialog */}
      <AttendanceDialog
        open={attendanceDialog.open}
        onOpenChange={(open) => setAttendanceDialog(prev => ({ ...prev, open }))}
        student={attendanceDialog.student}
        type={attendanceDialog.type}
        date={attendanceDate}
        time={attendanceTime}
        onDateChange={setAttendanceDate}
        onTimeChange={setAttendanceTime}
        onConfirm={handleRecordAttendance}
        t={t}
      />

      {/* History Dialog */}
      <AttendanceHistoryDialog
        open={historyDialog.open}
        onOpenChange={(open) => setHistoryDialog(prev => ({ ...prev, open }))}
        student={historyDialog.student}
        getStudentRecords={getStudentRecords}
        selectedYear={selectedYear}
        selectedTerm={selectedTerm}
        recordToDelete={recordToDelete}
        onDeleteClick={setRecordToDelete}
        onDeleteConfirm={handleDeleteRecord}
        t={t}
      />

      {/* Move Student Dialog */}
      <MoveStudentDialog
        open={moveStudentDialog.open}
        onOpenChange={(open) => setMoveStudentDialog({ open, student: open ? moveStudentDialog.student : null })}
        student={moveStudentDialog.student}
        classes={classes}
        onMove={handleMoveStudent}
        t={t}
      />

      {/* Remove Student Dialog */}
      <RemoveStudentDialog
        open={removeStudentDialog.open}
        onOpenChange={(open) => setRemoveStudentDialog({ open, student: open ? removeStudentDialog.student : null })}
        student={removeStudentDialog.student}
        onConfirm={handleRemoveStudent}
        t={t}
      />

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={addStudentDialog}
        onOpenChange={setAddStudentDialog}
        newStudent={newStudent}
        onStudentChange={setNewStudent}
        onAdd={handleAddStudent}
        t={t}
      />

      {/* Student Info Sidebar */}
      <StudentInfoSidebar
        open={studentInfoSidebar.open}
        onOpenChange={(open) => setStudentInfoSidebar({ open, student: open ? studentInfoSidebar.student : null })}
        student={studentInfoSidebar.student}
        selectedYear={selectedYear}
        selectedTerm={selectedTerm}
        isRTL={isRTL}
        t={t}
      />
    </div>
  )
}

import { useMemo, useCallback, useState } from "react"
import { ArrowUpDown, Search, Users, TrendingUp, CheckCircle, XCircle, UserMinus, Clock, History, GripVertical, Star, MoreVertical, Move, UserX, UserPlus, Info } from "lucide-react"
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
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
import { FIELD_CONFIG } from "./grade-sheet/constants"
import {
  calculateContinuousAssessment,
  calculateFinalAverage,
  getRemarksKey,
  getRowColor,
} from "./grade-sheet/utils"
import {
  AttendanceDialog,
  AttendanceHistoryDialog,
  MoveStudentDialog,
  RemoveStudentDialog,
  AddStudentDialog,
} from "./grade-sheet/dialogs"



// Sortable student row component - extracted to use useSortable hook properly
interface SortableStudentRowProps {
  student: CalculatedStudentGrade
  index: number
  studentNumber: number
  groupNumber: number
  showGroups: boolean
  editingCell: { id: string; field: string } | null
  setEditingCell: (cell: { id: string; field: string } | null) => void
  handleCellEdit: (id: string, field: keyof StudentGrade, value: string) => void
  updateStudent: (id: string, updates: Partial<StudentGrade>) => void
  EditableCell: React.FC<{ student: CalculatedStudentGrade; field: keyof StudentGrade; value: number }>
  AttendanceCell: React.FC<{ student: CalculatedStudentGrade; type: 'lateness' | 'absences'; count: number }>
  onMoveStudent: (student: CalculatedStudentGrade) => void
  onRemoveStudent: (student: CalculatedStudentGrade) => void
  onViewStudentInfo: (student: CalculatedStudentGrade) => void
  t: (key: string, opts?: Record<string, unknown>) => string
}

function SortableStudentRow({
  student,
  index,
  studentNumber,
  groupNumber,
  showGroups,
  editingCell,
  setEditingCell,
  handleCellEdit,
  updateStudent,
  EditableCell,
  AttendanceCell,
  onMoveStudent,
  onRemoveStudent,
  onViewStudentInfo,
  t,
}: SortableStudentRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: student.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Check if student has special case
  const hasSpecialCase = !!student.specialCase

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`
        ${!hasSpecialCase ? getRowColor(student.finalAverage) : ''} 
        ${index % 2 === 0 ? 'bg-opacity-50' : ''}
        ${student.specialCase === 'autism'
          ? 'border-s-4 border-s-blue-500 dark:border-s-blue-400 bg-blue-50/40 dark:bg-blue-950/30 hover:bg-blue-100/50 dark:hover:bg-blue-950/40'
          : student.specialCase === 'diabetes'
            ? 'border-s-4 border-s-orange-500 dark:border-s-orange-400 bg-orange-50/40 dark:bg-orange-950/30 hover:bg-orange-100/50 dark:hover:bg-orange-950/40'
            : hasSpecialCase
              ? 'border-s-4 border-s-purple-500 dark:border-s-purple-400 bg-purple-50/40 dark:bg-purple-950/30 hover:bg-purple-100/50 dark:hover:bg-purple-950/40'
              : ''}
      `}
    >
      <TableCell className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="text-center font-semibold">{studentNumber}</TableCell>
      {showGroups && (
        <TableCell className={`text-center font-bold ${groupNumber === 1 ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-green-600 bg-green-50 dark:bg-green-950'}`}>
          {t('pages.grades.groups.groupLabel', { number: groupNumber })}
        </TableCell>
      )}
      {/* Student Management Menu Column */}
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center p-1 rounded hover:bg-muted opacity-60 hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
              aria-label={t('pages.grades.studentManagement.menu')}
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onViewStudentInfo(student)}>
              <Info className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.grades.studentManagement.viewInfo')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMoveStudent(student)}>
              <Move className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.grades.studentManagement.moveToClass')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRemoveStudent(student)}
              className="text-destructive focus:text-destructive"
            >
              <UserX className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.grades.studentManagement.removeFromClass')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TableCell className="font-mono text-xs max-w-[60px] truncate cursor-help">{student.id.slice(0, 8)}...</TableCell>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-mono text-xs">{student.id}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TableCell className="font-semibold whitespace-nowrap truncate max-w-[120px]">{student.lastName}</TableCell>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{student.lastName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TableCell className="whitespace-nowrap max-w-[140px]">
        <span className="flex items-center gap-1">
          <span className="truncate">{student.firstName}</span>
          {/* Special Case Menu */}
          <DropdownMenu>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <button
                      className={`shrink-0 p-0.5 rounded hover:bg-muted ${hasSpecialCase ? '' : 'opacity-40 hover:opacity-100'}`}
                    >
                      <Star className={`h-3 w-3 ${student.specialCase === 'longAbsence'
                        ? 'text-red-500 fill-red-500'
                        : student.specialCase === 'exemption'
                          ? 'text-blue-500 fill-blue-500'
                          : student.specialCase === 'medical'
                            ? 'text-orange-500 fill-orange-500'
                            : student.specialCase === 'transfer'
                              ? 'text-green-500 fill-green-500'
                              : hasSpecialCase
                                ? 'text-purple-500 fill-purple-500'
                                : 'text-muted-foreground'
                        }`} />
                    </button>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                {hasSpecialCase && (
                  <TooltipContent side="top" sideOffset={5} className={`text-xs font-medium ${student.specialCase === 'longAbsence'
                    ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200'
                    : student.specialCase === 'exemption'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200'
                      : student.specialCase === 'medical'
                        ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200'
                        : student.specialCase === 'transfer'
                          ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200'
                          : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200'
                    }`}>
                    {['longAbsence', 'exemption', 'medical', 'transfer'].includes(student.specialCase || '')
                      ? t(`pages.grades.specialCase.${student.specialCase}`)
                      : student.specialCase
                    }
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => updateStudent(student.id, { specialCase: 'longAbsence' })}
                className={student.specialCase === 'longAbsence' ? 'bg-red-50 dark:bg-red-950' : ''}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.specialCase.longAbsence')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateStudent(student.id, { specialCase: 'exemption' })}
                className={student.specialCase === 'exemption' ? 'bg-blue-50 dark:bg-blue-950' : ''}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.specialCase.exemption')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateStudent(student.id, { specialCase: 'medical' })}
                className={student.specialCase === 'medical' ? 'bg-orange-50 dark:bg-orange-950' : ''}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.specialCase.medical')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateStudent(student.id, { specialCase: 'transfer' })}
                className={student.specialCase === 'transfer' ? 'bg-green-50 dark:bg-green-950' : ''}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.specialCase.transfer')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const customName = prompt(t('pages.grades.specialCase.enterCustom'))
                  if (customName && customName.trim()) {
                    updateStudent(student.id, { specialCase: customName.trim() })
                  }
                }}
                className={hasSpecialCase && !['longAbsence', 'exemption', 'medical', 'transfer'].includes(student.specialCase || '') ? 'bg-purple-50 dark:bg-purple-950' : ''}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.specialCase.custom')}
              </DropdownMenuItem>
              {hasSpecialCase && (
                <>
                  <DropdownMenuItem
                    onClick={() => updateStudent(student.id, { specialCase: undefined })}
                    className="text-muted-foreground"
                  >
                    {t('pages.grades.specialCase.clear')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </TableCell>
      <TableCell className="text-center">{student.dateOfBirth}</TableCell>
      <EditableCell student={student} field="behavior" value={student.behavior} />
      <EditableCell student={student} field="applications" value={student.applications} />
      <EditableCell student={student} field="notebook" value={student.notebook} />
      <AttendanceCell student={student} type="lateness" count={student.lateness} />
      <AttendanceCell student={student} type="absences" count={student.absences} />
      <TableCell
        className="text-center font-semibold bg-primary/5 dark:bg-primary/10 text-primary cursor-not-allowed"
        onClick={() => toast.info(t('pages.grades.validation.caAutoCalculated'))}
      >
        {student.activityAverage}
      </TableCell>
      <TableCell className="text-center font-semibold bg-primary/5 dark:bg-primary/10 cursor-pointer" onClick={() => setEditingCell({ id: student.id, field: 'assignment' })}>
        {editingCell?.id === student.id && editingCell?.field === 'assignment' ? (
          <Input
            type="number"
            defaultValue={student.assignment}
            autoFocus
            className="w-16 h-8 text-center"
            onFocus={(e) => e.target.select()}
            onBlur={(e) => {
              const newValue = e.target.value.trim()
              if (newValue === '') {
                setEditingCell(null)
              } else {
                const numValue = parseFloat(newValue)
                if (!isNaN(numValue)) {
                  if (numValue > 20) {
                    toast.warning(t('pages.grades.validation.exceedsMax'))
                    handleCellEdit(student.id, 'assignment', '20')
                  } else if (numValue < 0) {
                    handleCellEdit(student.id, 'assignment', '0')
                  } else {
                    handleCellEdit(student.id, 'assignment', newValue)
                  }
                } else {
                  setEditingCell(null)
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newValue = (e.target as HTMLInputElement).value.trim()
                if (newValue === '') {
                  setEditingCell(null)
                } else {
                  const numValue = parseFloat(newValue)
                  if (!isNaN(numValue)) {
                    if (numValue > 20) {
                      toast.warning(t('pages.grades.validation.exceedsMax'))
                      handleCellEdit(student.id, 'assignment', '20')
                    } else if (numValue < 0) {
                      handleCellEdit(student.id, 'assignment', '0')
                    } else {
                      handleCellEdit(student.id, 'assignment', newValue)
                    }
                  } else {
                    setEditingCell(null)
                  }
                }
              }
              if (e.key === 'Escape') setEditingCell(null)
            }}
            min={0} max={20} step={0.5}
          />
        ) : student.assignment}
      </TableCell>
      <TableCell className="text-center font-semibold bg-primary/5 dark:bg-primary/10 cursor-pointer" onClick={() => setEditingCell({ id: student.id, field: 'exam' })}>
        {editingCell?.id === student.id && editingCell?.field === 'exam' ? (
          <Input
            type="number"
            defaultValue={student.exam}
            autoFocus
            className="w-16 h-8 text-center"
            onFocus={(e) => e.target.select()}
            onBlur={(e) => {
              const newValue = e.target.value.trim()
              if (newValue === '') {
                setEditingCell(null)
              } else {
                const numValue = parseFloat(newValue)
                if (!isNaN(numValue)) {
                  if (numValue > 20) {
                    toast.warning(t('pages.grades.validation.exceedsMax'))
                    handleCellEdit(student.id, 'exam', '20')
                  } else if (numValue < 0) {
                    handleCellEdit(student.id, 'exam', '0')
                  } else {
                    handleCellEdit(student.id, 'exam', newValue)
                  }
                } else {
                  setEditingCell(null)
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newValue = (e.target as HTMLInputElement).value.trim()
                if (newValue === '') {
                  setEditingCell(null)
                } else {
                  const numValue = parseFloat(newValue)
                  if (!isNaN(numValue)) {
                    if (numValue > 20) {
                      toast.warning(t('pages.grades.validation.exceedsMax'))
                      handleCellEdit(student.id, 'exam', '20')
                    } else if (numValue < 0) {
                      handleCellEdit(student.id, 'exam', '0')
                    } else {
                      handleCellEdit(student.id, 'exam', newValue)
                    }
                  } else {
                    setEditingCell(null)
                  }
                }
              }
              if (e.key === 'Escape') setEditingCell(null)
            }}
            min={0} max={20} step={0.5}
          />
        ) : student.exam}
      </TableCell>
      <TableCell className="text-center font-bold text-lg bg-primary/10 dark:bg-primary/20 text-primary">{student.finalAverage.toFixed(2)}</TableCell>
      <TableCell className="font-semibold whitespace-nowrap truncate max-w-[140px]">{t(`pages.grades.remarks.${student.remarks}`)}</TableCell>
    </TableRow>
  )
}

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

  // Header with optional highlight for major grade columns
  const SortableHeader = useCallback(({ field, children, highlight }: { field: SortField; children: React.ReactNode; highlight?: boolean }) => (
    <TableHead className={`text-center font-bold ${highlight ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className={`h-auto p-0 hover:bg-transparent font-bold ${highlight ? 'text-primary' : ''}`}
      >
        {children}
        <ArrowUpDown className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
      </Button>
    </TableHead>
  ), [handleSort])

  const EditableCell = useCallback(({
    student,
    field,
    value
  }: {
    student: CalculatedStudentGrade;
    field: keyof StudentGrade;
    value: number
  }) => {
    const isEditing = editingCell?.id === student.id && editingCell?.field === field
    const config = FIELD_CONFIG[field] || { min: 0, max: 20, step: 0.5, labelKey: field }

    const handleValidatedEdit = (newValue: string, keepOpen: boolean = false) => {
      const numValue = parseFloat(newValue)
      if (isNaN(numValue)) {
        if (!keepOpen) setEditingCell(null)
        return
      }

      // Clamp value to valid range
      const clampedValue = Math.min(config.max, Math.max(config.min, numValue))

      // Show warning if value was clamped
      if (numValue > config.max) {
        toast.warning(t('pages.grades.validation.maxReached', {
          field: t(config.labelKey),
          max: config.max
        }))
      } else if (numValue < config.min) {
        toast.warning(t('pages.grades.validation.minReached', {
          field: t(config.labelKey),
          min: config.min
        }))
      }

      handleCellEdit(student.id, field, clampedValue.toString(), keepOpen)
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TableCell
              className="text-center cursor-pointer hover:bg-muted/50"
              onClick={() => setEditingCell({ id: student.id, field })}
            >
              {isEditing ? (
                <Input
                  type="number"
                  defaultValue={value}
                  autoFocus
                  className="w-16 h-8 text-center"
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => {
                    const newValue = e.target.value.trim()
                    // If empty, revert to original value
                    if (newValue === '') {
                      setEditingCell(null)
                    } else {
                      handleValidatedEdit(newValue)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newValue = (e.target as HTMLInputElement).value.trim()
                      if (newValue === '') {
                        setEditingCell(null)
                      } else {
                        handleValidatedEdit(newValue)
                      }
                    }
                    if (e.key === 'Escape') {
                      setEditingCell(null)
                    }
                  }}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                />
              ) : (
                <span>{value}</span>
              )}
            </TableCell>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">
              {t(config.labelKey)}: {config.min} - {config.max}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }, [editingCell, handleCellEdit, t])

  const AttendanceCell = useCallback(({
    student,
    type,
    count
  }: {
    student: CalculatedStudentGrade
    type: 'absences' | 'lateness'
    count: number
  }) => (
    <TableCell className="text-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 ${count > 0 ? 'text-red-600 font-bold' : ''}`}
          >
            {count}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => openAttendanceDialog(student, type === 'absences' ? 'absence' : 'tardiness')}>
            {type === 'absences' ? <UserMinus className="h-4 w-4 ltr:mr-2 rtl:ml-2" /> : <Clock className="h-4 w-4 ltr:mr-2 rtl:ml-2" />}
            {type === 'absences' ? t('pages.grades.attendance.recordAbsence') : t('pages.grades.attendance.recordTardiness')}
          </DropdownMenuItem>
          {count > 0 && (
            <DropdownMenuItem onClick={() => openHistoryDialog(student)}>
              <History className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.grades.attendance.viewHistory')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  ), [openAttendanceDialog, openHistoryDialog, t])

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

        {/* Scrollable class tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {classes.map((cls) => {
            const isActive = cls.id === selectedClassId
            const studentCount = getClassStudentCount(cls.id)
            const validLevels = ['1AP', '2AP', '3AP', '4AP', '5AP']
            const hasValidLevel = cls.grade_level && validLevels.includes(cls.grade_level)

            return (
              <button
                key={cls.id}
                onClick={() => handleClassSelect(cls.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                  whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex-shrink-0
                  ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <span className="font-medium">{cls.name}</span>

                {/* Student count badge */}
                <span className={`
                  inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 text-[10px] font-bold rounded-full
                  ${isActive ? 'bg-white/20' : 'bg-muted'}
                `}>
                  {studentCount}
                </span>

                {/* Level indicator - only show warning on mobile */}
                {!hasValidLevel && (
                  <span className="text-[10px] text-amber-500 font-bold">!</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 p-2 sm:p-4 rounded-lg border bg-muted/30">
          {/* Statistics - compact horizontal scroll on mobile */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.totalStudents')}</p>
                <p className="text-sm sm:text-lg font-bold">{statistics.total}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.classAverage')}</p>
                <p className="text-sm sm:text-lg font-bold">{statistics.classAverage}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.successRate')}</p>
                <p className="text-sm sm:text-lg font-bold text-green-600">{statistics.passRate}%</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.failureRate')}</p>
                <p className="text-sm sm:text-lg font-bold text-red-600">{statistics.failRate}%</p>
              </div>
            </div>
          </div>

          {/* Search and Controls - compact on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full">
            <div className="flex-1 max-w-[200px] sm:max-w-none sm:flex-none sm:min-w-[280px]">
              <div className="relative">
                <Search className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-2.5 sm:ltr:left-3 rtl:right-2.5 sm:rtl:right-3" />
                <Input
                  placeholder={t('pages.grades.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 sm:h-10 text-sm ltr:pl-8 sm:ltr:pl-9 rtl:pr-8 sm:rtl:pr-9"
                />
              </div>
            </div>

            {/* Add Student Button */}
            {selectedClassId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setAddStudentDialog(true)}
                      className="h-8 w-8"
                      aria-label={t('pages.grades.addStudent.button')}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{t('pages.grades.addStudent.button')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Compact Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Group Split Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showGroups ? "default" : "outline"}
                      size="icon"
                      onClick={() => setShowGroups(!showGroups)}
                      className="h-8 w-8"
                      aria-label={showGroups ? t('pages.grades.groups.hideGroups') : t('pages.grades.groups.showGroups')}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{showGroups ? t('pages.grades.groups.hideGroups') : t('pages.grades.groups.showGroups')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Special Cases Filter */}
              {statistics.specialCaseCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showSpecialCasesOnly ? "default" : "outline"}
                        size="icon"
                        onClick={() => setShowSpecialCasesOnly(!showSpecialCasesOnly)}
                        className="h-8 w-8 relative"
                        aria-label={t('pages.grades.specialCase.showOnly')}
                      >
                        <Star className="h-4 w-4" />
                        {statistics.specialCaseCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground border-2 border-background">
                            {statistics.specialCaseCount}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{t('pages.grades.specialCase.showOnly')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

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
                  <SortableHeader field="id">{t('pages.grades.table.id')}</SortableHeader>
                  <SortableHeader field="lastName">{t('pages.grades.table.lastName')}</SortableHeader>
                  <SortableHeader field="firstName">{t('pages.grades.table.firstName')}</SortableHeader>
                  <SortableHeader field="dateOfBirth">{t('pages.grades.table.dateOfBirth')}</SortableHeader>
                  <SortableHeader field="behavior">{t('pages.grades.table.behavior')}</SortableHeader>
                  <SortableHeader field="applications">{t('pages.grades.table.applications')}</SortableHeader>
                  <SortableHeader field="notebook">{t('pages.grades.table.notebook')}</SortableHeader>
                  <SortableHeader field="lateness">{t('pages.grades.table.lateness')}</SortableHeader>
                  <SortableHeader field="absences">{t('pages.grades.table.absences')}</SortableHeader>
                  <SortableHeader field="activityAverage" highlight>{t('pages.grades.table.activityAverage')}</SortableHeader>
                  <SortableHeader field="assignment" highlight>{t('pages.grades.table.assignment')}</SortableHeader>
                  <SortableHeader field="exam" highlight>{t('pages.grades.table.exam')}</SortableHeader>
                  <SortableHeader field="finalAverage" highlight>{t('pages.grades.table.finalAverage')}</SortableHeader>
                  <SortableHeader field="remarks">{t('pages.grades.table.remarks')}</SortableHeader>
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
                        EditableCell={EditableCell}
                        AttendanceCell={AttendanceCell}
                        onMoveStudent={(s) => setMoveStudentDialog({ open: true, student: s })}
                        onRemoveStudent={(s) => setRemoveStudentDialog({ open: true, student: s })}
                        onViewStudentInfo={(s) => setStudentInfoSidebar({ open: true, student: s })}
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
      <Sheet
        open={studentInfoSidebar.open}
        onOpenChange={(open) => setStudentInfoSidebar({ open, student: open ? studentInfoSidebar.student : null })}
      >
        <SheetContent side={isRTL ? 'left' : 'right'} className="w-full sm:max-w-md overflow-y-auto">
          {studentInfoSidebar.student && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {studentInfoSidebar.student.firstName} {studentInfoSidebar.student.lastName}
                </SheetTitle>
                <SheetDescription>
                  {t('pages.grades.studentInfo.description')}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('pages.grades.studentInfo.basicInfo')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.studentInfo.id')}</span>
                      <span className="font-mono font-medium">{studentInfoSidebar.student.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.studentInfo.dateOfBirth')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.dateOfBirth}</span>
                    </div>
                    {studentInfoSidebar.student.specialCase && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('pages.grades.studentInfo.specialCase')}</span>
                        <span className="font-medium">
                          {['longAbsence', 'exemption', 'medical', 'transfer'].includes(studentInfoSidebar.student.specialCase)
                            ? t(`pages.grades.specialCase.${studentInfoSidebar.student.specialCase}`)
                            : studentInfoSidebar.student.specialCase}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grades */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('pages.grades.studentInfo.grades')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.behavior')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.behavior}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.applications')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.applications}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.notebook')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.notebook}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.assignment')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.assignment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.exam')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.exam}</span>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('pages.grades.studentInfo.attendance')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.lateness')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.lateness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.absences')}</span>
                      <span className="font-medium">{studentInfoSidebar.student.absences}</span>
                    </div>
                  </div>
                </div>

                {/* Averages */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('pages.grades.studentInfo.averages')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.activityAverage')}</span>
                      <span className="font-medium text-primary">{studentInfoSidebar.student.activityAverage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.finalAverage')}</span>
                      <span className="font-bold text-lg text-primary">{studentInfoSidebar.student.finalAverage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.table.remarks')}</span>
                      <span className="font-medium">{t(`pages.grades.remarks.${studentInfoSidebar.student.remarks}`)}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Context */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('pages.grades.studentInfo.academicContext')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.studentInfo.year')}</span>
                      <span className="font-medium">{selectedYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('pages.grades.studentInfo.term')}</span>
                      <span className="font-medium">{t(`pages.grades.term${selectedTerm}`)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

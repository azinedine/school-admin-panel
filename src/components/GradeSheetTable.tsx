import { useMemo, useCallback, useState, useEffect } from "react"
import { ArrowUpDown, Search, Users, TrendingUp, CheckCircle, XCircle, UserMinus, Clock, History, Trash2, GripVertical, Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "@tanstack/react-router"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDirection } from "@/hooks/use-direction"
import { useAttendanceStore } from "@/store/attendance-store"
import { useGradesStore, type StudentGrade } from "@/store/grades-store"
import { toast } from "sonner"

// Calculated student grade with computed fields
interface CalculatedStudentGrade extends StudentGrade {
  lateness: number
  absences: number
  activityAverage: number
  finalAverage: number
  remarks: string
}

type SortField = keyof CalculatedStudentGrade
type SortDirection = "asc" | "desc" | null

// Field configuration with min/max values for validation
const FIELD_CONFIG: Record<string, { min: number; max: number; step: number; labelKey: string }> = {
  behavior: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.behavior' },
  applications: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.applications' },
  notebook: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.notebook' },
  assignment: { min: 0, max: 20, step: 0.5, labelKey: 'pages.grades.table.assignment' },
  exam: { min: 0, max: 20, step: 0.5, labelKey: 'pages.grades.table.exam' },
}

// Calculate continuous assessment from all 5 components
// Each component contributes 0-5 points for a total of 0-25, scaled to 0-20
// Components: Behavior, Participation (applications), Notebook, Tardiness (5 - count), Absences (5 - count)
function calculateContinuousAssessment(
  behavior: number,       // 0-5 score
  participation: number,  // 0-5 score (applications)
  notebook: number,       // 0-5 score
  tardinessCount: number, // number of tardiness records
  absenceCount: number    // number of absence records
): number {
  // Behavior, Participation, Notebook are direct scores (0-5)
  const behaviorScore = Math.min(5, Math.max(0, behavior))
  const participationScore = Math.min(5, Math.max(0, participation))
  const notebookScore = Math.min(5, Math.max(0, notebook))
  
  // Tardiness and Absences start at 5, deduct 1 per record (min 0)
  const tardinessScore = Math.max(0, 5 - tardinessCount)
  const absenceScore = Math.max(0, 5 - absenceCount)
  
  // Total out of 25, scaled to 20
  const total = behaviorScore + participationScore + notebookScore + tardinessScore + absenceScore
  return Number((total * 20 / 25).toFixed(2))
}

function calculateFinalAverage(activityAverage: number, assignment: number, exam: number): number {
  return Number(((activityAverage + assignment + exam) / 3).toFixed(2))
}

function getRemarksKey(average: number): string {
  if (average >= 16) return "excellent"
  if (average >= 14) return "veryGood"
  if (average >= 12) return "good"
  if (average >= 10) return "average"
  return "poor"
}

function getRowColor(average: number): string {
  if (average < 10) return "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30"
  if (average < 14) return "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
  return "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
}

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
        ${getRowColor(student.finalAverage)} 
        ${index % 2 === 0 ? 'bg-opacity-50' : ''}
        ${student.specialCase === 'autism' 
          ? 'border-s-4 border-s-blue-500 dark:border-s-blue-400' 
          : student.specialCase === 'diabetes' 
            ? 'border-s-4 border-s-orange-500 dark:border-s-orange-400' 
            : hasSpecialCase 
              ? 'border-s-4 border-s-purple-500 dark:border-s-purple-400' 
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
      <TableCell className="font-mono text-xs">{student.id}</TableCell>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className={`shrink-0 p-0.5 rounded hover:bg-muted ${hasSpecialCase ? '' : 'opacity-40 hover:opacity-100'}`}
                    >
                      <Heart className={`h-3 w-3 ${
                        student.specialCase === 'autism' 
                          ? 'text-blue-500 fill-blue-500' 
                          : student.specialCase === 'diabetes' 
                            ? 'text-orange-500 fill-orange-500' 
                            : hasSpecialCase 
                              ? 'text-purple-500 fill-purple-500' 
                              : 'text-muted-foreground'
                      }`} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem 
                      onClick={() => updateStudent(student.id, { specialCase: 'autism' })}
                      className={student.specialCase === 'autism' ? 'bg-blue-50 dark:bg-blue-950' : ''}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 ltr:mr-2 rtl:ml-2" />
                      {t('pages.grades.specialCase.autism')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateStudent(student.id, { specialCase: 'diabetes' })}
                      className={student.specialCase === 'diabetes' ? 'bg-orange-50 dark:bg-orange-950' : ''}
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-500 ltr:mr-2 rtl:ml-2" />
                      {t('pages.grades.specialCase.diabetes')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        const customName = prompt(t('pages.grades.specialCase.enterCustom'))
                        if (customName && customName.trim()) {
                          updateStudent(student.id, { specialCase: customName.trim() })
                        }
                      }}
                      className={hasSpecialCase && student.specialCase !== 'autism' && student.specialCase !== 'diabetes' ? 'bg-purple-50 dark:bg-purple-950' : ''}
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
              </TooltipTrigger>
              {hasSpecialCase && (
                <TooltipContent side="top" className={`text-xs font-medium ${
                  student.specialCase === 'autism' 
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200' 
                    : student.specialCase === 'diabetes' 
                      ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200' 
                      : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200'
                }`}>
                  {student.specialCase === 'autism' || student.specialCase === 'diabetes' 
                    ? t(`pages.grades.specialCase.${student.specialCase}`)
                    : student.specialCase
                  }
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
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

export function GradeSheetTable() {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const navigate = useNavigate()
  
  // Persistent stores
  const students = useGradesStore((state) => state.students)
  const classes = useGradesStore((state) => state.classes)
  const selectedClassId = useGradesStore((state) => state.selectedClassId)
  const setSelectedClass = useGradesStore((state) => state.setSelectedClass)
  const updateStudentField = useGradesStore((state) => state.updateStudentField)
  const updateStudent = useGradesStore((state) => state.updateStudent)
  const reorderStudents = useGradesStore((state) => state.reorderStudents)
  const { addRecord, removeRecord, getStudentRecords, getStudentAbsenceCount, getStudentTardinessCount, records } = useAttendanceStore()

  // Handle class selection - updates URL and store stays in sync via GradesPage URL effect
  const handleClassSelect = useCallback((classId: string) => {
    // Update store immediately for instant UI feedback
    setSelectedClass(classId)
    // Update URL to keep sidebar in sync
    navigate({ to: '/grades', search: { class: classId } })
  }, [setSelectedClass, navigate])
  
  // Get student count for a class
  const getClassStudentCount = useCallback((classId: string) => {
    return students.filter(s => s.classId === classId).length
  }, [students])

  // Auto-select first class when classes exist but none selected
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClass(classes[0].id)
    }
  }, [classes, selectedClassId, setSelectedClass])

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [showGroups, setShowGroups] = useState(false)
  
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
        const absenceCount = getStudentAbsenceCount(student.id)
        const tardinessCount = getStudentTardinessCount(student.id)
        
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
  }, [students, records, selectedClassId, getStudentAbsenceCount, getStudentTardinessCount])

  const handleCellEdit = useCallback((id: string, field: keyof StudentGrade, value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 20) return
    
    // Update in persistent store immediately
    updateStudentField(id, field, numValue)
    setEditingCell(null)
  }, [updateStudentField])

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
      type: attendanceDialog.type
    })
    
    const messageKey = attendanceDialog.type === 'absence' 
      ? 'pages.grades.attendance.absenceRecorded' 
      : 'pages.grades.attendance.tardinessRecorded'
    
    toast.success(t(messageKey, { name: studentName }))
    setAttendanceDialog({ open: false, student: null, type: 'absence' })
  }, [attendanceDialog, attendanceDate, attendanceTime, addRecord, t])

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

  const studentRecords = useMemo(() => {
    if (!historyDialog.student) return []
    return getStudentRecords(historyDialog.student.id).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [historyDialog.student, getStudentRecords, records])

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...calculatedStudents]
    
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
  }, [calculatedStudents, searchQuery, sortField, sortDirection])

  // Handle drag end - reorder students and persist
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id || !selectedClassId) return
    
    const oldIndex = filteredAndSortedStudents.findIndex(s => s.id === active.id)
    const newIndex = filteredAndSortedStudents.findIndex(s => s.id === over.id)
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(filteredAndSortedStudents, oldIndex, newIndex)
      reorderStudents(selectedClassId, reordered.map(s => s.id))
    }
  }, [filteredAndSortedStudents, selectedClassId, reorderStudents])

  const statistics = useMemo(() => {
    const total = calculatedStudents.length
    if (total === 0) return { total: 0, classAverage: '0', passRate: '0', failRate: '0' }
    
    const classAverage = calculatedStudents.reduce((sum, s) => sum + s.finalAverage, 0) / total
    const passCount = calculatedStudents.filter(s => s.finalAverage >= 10).length
    const failCount = total - passCount
    
    return {
      total,
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
    
    const handleValidatedEdit = (newValue: string) => {
      const numValue = parseFloat(newValue)
      if (isNaN(numValue)) {
        setEditingCell(null)
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
      
      handleCellEdit(student.id, field, clampedValue.toString())
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
    <div className="flex flex-col h-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Class Navigation - Modern Pill Switcher */}
      <div className="flex-shrink-0 mb-4 relative">
        {/* Gradient scroll indicators */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10" />
        
        {/* Scrollable class pills - hidden scrollbar */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {classes.map((cls) => {
            const isActive = cls.id === selectedClassId
            const studentCount = getClassStudentCount(cls.id)
            
            return (
              <button
                key={cls.id}
                onClick={() => handleClassSelect(cls.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  whitespace-nowrap transition-all duration-150 ease-out cursor-pointer select-none
                  ${isActive 
                    ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm border border-border' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <span>{cls.name}</span>
                <span className={`
                  px-1.5 py-0.5 text-xs rounded-md
                  ${isActive 
                    ? 'bg-muted text-muted-foreground font-medium' 
                    : 'text-muted-foreground/70'
                  }
                `}>
                  {studentCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30">
        {/* Statistics */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('pages.grades.stats.totalStudents')}</p>
              <p className="text-lg font-bold">{statistics.total}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('pages.grades.stats.classAverage')}</p>
              <p className="text-lg font-bold">{statistics.classAverage}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('pages.grades.stats.successRate')}</p>
              <p className="text-lg font-bold text-green-600">{statistics.passRate}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('pages.grades.stats.failureRate')}</p>
              <p className="text-lg font-bold text-red-600">{statistics.failRate}%</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-auto md:min-w-[280px]">
          <div className="relative">
            <Search className="absolute h-4 w-4 top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
            <Input
              placeholder={t('pages.grades.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ltr:pl-9 rtl:pr-9"
            />
          </div>
        </div>

        {/* Group Split Toggle */}
        <Button
          variant={showGroups ? "default" : "outline"}
          size="sm"
          onClick={() => setShowGroups(!showGroups)}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          {showGroups ? t('pages.grades.groups.hideGroups') : t('pages.grades.groups.showGroups')}
        </Button>
      </div>

      {/* Hints */}
      <div className="text-sm text-muted-foreground">
        <p>* {t('pages.grades.hints.clickToEdit')}</p>
        <p>* {t('pages.grades.hints.autoCalculate')}</p>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-12 text-center">#</TableHead>
                {showGroups && <TableHead className="w-20 text-center">{t('pages.grades.table.group')}</TableHead>}
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
                      t={t}
                    />
                  )
                })}
              </TableBody>
            </SortableContext>
          </Table>
        </DndContext>
      </div>

      {/* Attendance Dialog */}
      <Dialog open={attendanceDialog.open} onOpenChange={(open) => setAttendanceDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {attendanceDialog.type === 'absence' 
                ? t('pages.grades.attendance.recordAbsence') 
                : t('pages.grades.attendance.recordTardiness')}
            </DialogTitle>
          </DialogHeader>
          
          {attendanceDialog.student && (
            <div className="space-y-4 py-4">
              <p className="font-medium">
                {attendanceDialog.student.firstName} {attendanceDialog.student.lastName}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{t('pages.grades.attendance.date')}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{t('pages.grades.attendance.time')}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={attendanceTime}
                    onChange={(e) => setAttendanceTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttendanceDialog({ open: false, student: null, type: 'absence' })}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleRecordAttendance}>
              {t('pages.grades.attendance.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialog.open} onOpenChange={(open) => setHistoryDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('pages.grades.attendance.history')}
              {historyDialog.student && ` - ${historyDialog.student.firstName} ${historyDialog.student.lastName}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto py-4">
            {studentRecords.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('pages.grades.attendance.noRecords')}
              </p>
            ) : (
              studentRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {record.type === 'absence' ? (
                      <UserMinus className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {t(`pages.grades.attendance.${record.type}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.date} • {record.time}
                      </p>
                    </div>
                  </div>
                  
                  {recordToDelete === record.id ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        {t('pages.grades.attendance.confirm')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setRecordToDelete(null)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setRecordToDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialog({ open: false, student: null })}>
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End of Scrollable Content Area */}
      </div>
    </div>
  )
}

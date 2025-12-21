import { useMemo, useCallback, useState } from "react"
import { ArrowUpDown, Search, Users, TrendingUp, CheckCircle, XCircle, UserMinus, Clock, History, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
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

// Calculate continuous assessment from all 5 components
function calculateContinuousAssessment(
  behavior: number,
  applications: number,
  notebook: number,
  tardinessCount: number,
  absenceCount: number
): number {
  const behaviorScore = behavior / 4
  const applicationsScore = applications / 4
  const notebookScore = notebook / 4
  const tardinessScore = Math.max(0, 5 - tardinessCount)
  const absenceScore = Math.max(0, 5 - absenceCount)
  
  const total = behaviorScore + applicationsScore + notebookScore + tardinessScore + absenceScore
  return Number((total * 4 / 5).toFixed(2))
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

export function GradeSheetTable() {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  
  // Persistent stores
  const students = useGradesStore((state) => state.students)
  const classes = useGradesStore((state) => state.classes)
  const selectedClassId = useGradesStore((state) => state.selectedClassId)
  const setSelectedClass = useGradesStore((state) => state.setSelectedClass)
  const updateStudentField = useGradesStore((state) => state.updateStudentField)
  const { addRecord, removeRecord, getStudentRecords, getStudentAbsenceCount, getStudentTardinessCount, records } = useAttendanceStore()
  
  // Get student count for a class
  const getClassStudentCount = useCallback((classId: string) => {
    return students.filter(s => s.classId === classId).length
  }, [students])

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  
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

    return (
      <TableCell 
        className="text-center cursor-pointer"
        onClick={() => setEditingCell({ id: student.id, field })}
      >
        {isEditing ? (
          <Input
            type="number"
            defaultValue={value}
            autoFocus
            className="w-16 h-8 text-center"
            onBlur={(e) => handleCellEdit(student.id, field, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(student.id, field, (e.target as HTMLInputElement).value)
              }
              if (e.key === 'Escape') {
                setEditingCell(null)
              }
            }}
            min={0}
            max={20}
            step={0.5}
          />
        ) : (
          <span>{value}</span>
        )}
      </TableCell>
    )
  }, [editingCell, handleCellEdit])

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
      {/* Scrollable Class Tabs */}
      <div className="flex-shrink-0 mb-4 overflow-x-auto pb-1">
        <Tabs value={selectedClassId || undefined} onValueChange={setSelectedClass}>
          <TabsList className="inline-flex w-max gap-1 p-1 bg-muted rounded-lg">
            {classes.map((cls) => (
              <TabsTrigger 
                key={cls.id} 
                value={cls.id} 
                className="px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {cls.name}
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-muted-foreground/20">
                  {getClassStudentCount(cls.id)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
      </div>

      {/* Hints */}
      <div className="text-sm text-muted-foreground">
        <p>* {t('pages.grades.hints.clickToEdit')}</p>
        <p>* {t('pages.grades.hints.autoCalculate')}</p>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
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
          <TableBody>
            {filteredAndSortedStudents.map((student, index) => (
              <TableRow 
                key={student.id + '-' + index}
                className={`${getRowColor(student.finalAverage)} ${index % 2 === 0 ? 'bg-opacity-50' : ''}`}
              >
                <TableCell className="font-mono text-xs">{student.id}</TableCell>
                <TableCell className="font-semibold">{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell className="text-center">{student.dateOfBirth}</TableCell>
                <EditableCell student={student} field="behavior" value={student.behavior} />
                <EditableCell student={student} field="applications" value={student.applications} />
                <EditableCell student={student} field="notebook" value={student.notebook} />
                <AttendanceCell student={student} type="lateness" count={student.lateness} />
                <AttendanceCell student={student} type="absences" count={student.absences} />
                <TableCell className="text-center font-semibold bg-primary/5 dark:bg-primary/10 text-primary">{student.activityAverage}</TableCell>
                <TableCell className="text-center font-semibold bg-primary/5 dark:bg-primary/10 cursor-pointer" onClick={() => setEditingCell({ id: student.id, field: 'assignment' })}>
                  {editingCell?.id === student.id && editingCell?.field === 'assignment' ? (
                    <Input
                      type="number"
                      defaultValue={student.assignment}
                      autoFocus
                      className="w-16 h-8 text-center"
                      onBlur={(e) => handleCellEdit(student.id, 'assignment', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCellEdit(student.id, 'assignment', (e.target as HTMLInputElement).value)
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
                      onBlur={(e) => handleCellEdit(student.id, 'exam', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCellEdit(student.id, 'exam', (e.target as HTMLInputElement).value)
                        if (e.key === 'Escape') setEditingCell(null)
                      }}
                      min={0} max={20} step={0.5}
                    />
                  ) : student.exam}
                </TableCell>
                <TableCell className="text-center font-bold text-lg bg-primary/10 dark:bg-primary/20 text-primary">{student.finalAverage.toFixed(2)}</TableCell>
                <TableCell className="font-semibold">{t(`pages.grades.remarks.${student.remarks}`)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

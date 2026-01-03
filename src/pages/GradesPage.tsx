import { useRef, useState, useCallback, useEffect } from "react"
import { Upload, Plus, Trash2, MoreVertical, Calendar, ChevronDown, BookOpen, Loader2, Download } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation } from "@tanstack/react-router"
import { GradeSheetTable } from "@/components/GradeSheetTable"
import { ContentPage } from "@/components/layout/content-page"
import { useDirection } from "@/hooks/use-direction"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import {
  useGradeClasses,
  useCreateGradeClass,
  useUpdateGradeClass,
  useDeleteGradeClass,
  useDeleteAllGradeClasses,
  useBatchCreateStudents,
} from "@/features/grades"
import type { CreateStudentRequest, GradeClass } from "@/features/grades"

// Term type
type Term = 1 | 2 | 3

export default function GradesPage() {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const location = useLocation()

  // Calculate current academic year
  const getAcademicYear = useCallback(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const startYear = month >= 8 ? year : year - 1
    return `${startYear}-${startYear + 1}`
  }, [])

  // State
  const [selectedYear] = useState(getAcademicYear())
  const [selectedTerm, setSelectedTerm] = useState<Term>(1)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)

  // API hooks
  const { data: classes = [], isLoading: isLoadingClasses } = useGradeClasses(selectedYear)
  const createClassMutation = useCreateGradeClass()
  const updateClassMutation = useUpdateGradeClass()
  const deleteClassMutation = useDeleteGradeClass()
  const deleteAllClassesMutation = useDeleteAllGradeClasses()
  const batchCreateStudentsMutation = useBatchCreateStudents()

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dialog states
  const [addClassDialog, setAddClassDialog] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [newClassSubject, setNewClassSubject] = useState('')
  const [newClassGrade, setNewClassGrade] = useState('')
  const [deleteClassDialog, setDeleteClassDialog] = useState<{ open: boolean; classId: string | null }>({
    open: false,
    classId: null,
  })
  const [editLevelDialog, setEditLevelDialog] = useState<{ open: boolean; classData: GradeClass | null }>({
    open: false,
    classData: null,
  })
  const [editingLevel, setEditingLevel] = useState('')

  // Auto-select first class or sync from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const classParam = params.get('class')

    if (classParam && classes.some(c => c.id === classParam)) {
      setSelectedClassId(classParam)
    } else if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id)
    }
  }, [location.search, classes, selectedClassId])

  // Check if selected class has level set
  const selectedClass = classes.find(c => c.id === selectedClassId)
  const classLevelMissing = selectedClass && !selectedClass.grade_level

  // Get student count for a class
  const getClassStudentCount = useCallback((classId: string) => {
    const cls = classes.find(c => c.id === classId)
    return cls?.students?.length ?? 0
  }, [classes])

  // Handle Excel file upload
  const handleExcelUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        let totalStudents = 0
        let totalClasses = 0

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName]
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | boolean | null | undefined)[][]
          if (!rawData || rawData.length < 2) continue

          // Find header row
          let headerRowIndex = 0
          for (let i = 0; i < Math.min(10, rawData.length); i++) {
            const row = rawData[i]
            if (!row) continue
            const stringCellCount = row.filter(cell => typeof cell === 'string' && cell.trim().length > 0).length
            if (stringCellCount >= 2) {
              headerRowIndex = i
              break
            }
          }

          const headers = rawData[headerRowIndex]
          if (!headers) continue

          // Column finder
          const findCol = (exactPatterns: string[], partialPatterns: string[]): number => {
            const idx = headers.findIndex(h => {
              if (typeof h !== 'string') return false
              const hClean = h.trim().toLowerCase()
              return exactPatterns.some(p => hClean === p.toLowerCase())
            })
            if (idx !== -1) return idx

            return headers.findIndex(h => {
              if (typeof h !== 'string') return false
              const hClean = h.trim().toLowerCase()
              return partialPatterns.some(p => hClean.includes(p.toLowerCase()))
            })
          }

          const lastNameIdx = findCol(
            ['اللقب', 'Nom', 'LastName', 'Last Name', 'Surname', 'Family Name'],
            ['lقب', 'last', 'family', 'surname']
          )

          let firstNameIdx = findCol(
            ['الاسم', 'Prénom', 'FirstName', 'First Name', 'Given Name'],
            ['اسم', 'prénom', 'first', 'given']
          )
          if (firstNameIdx === lastNameIdx || firstNameIdx === -1) {
            firstNameIdx = headers.findIndex((h, idx) => {
              if (idx === lastNameIdx) return false
              if (typeof h !== 'string') return false
              const hLower = h.toLowerCase()
              return hLower.includes('name') || hLower.includes('nom') || hLower.includes('اسم')
            })
          }

          const idIdx = findCol(['ID', 'Matricule', 'Code'], ['id', 'matricule', 'code', 'ref'])
          const dobIdx = findCol(['تاريخ الميلاد', 'Date'], ['birth', 'naissance', 'تاريخ'])

          const sheetStudents: CreateStudentRequest[] = []

          for (let i = headerRowIndex + 1; i < rawData.length; i++) {
            const row = rawData[i]
            if (!row || row.length === 0) continue

            const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== null && cell !== '').length
            if (nonEmptyCells < 2) continue

            const lastName = lastNameIdx !== -1 ? String(row[lastNameIdx] || '') : ''
            const firstName = firstNameIdx !== -1 ? String(row[firstNameIdx] || '') : ''
            const studentNumber = idIdx !== -1 ? String(row[idIdx] || '') : undefined
            const dob = dobIdx !== -1 ? String(row[dobIdx] || '') : undefined

            if (!lastName && !firstName) continue
            const combinedNames = (lastName + firstName).toLowerCase()
            if (combinedNames.includes('name') || combinedNames.includes('nom') || combinedNames.includes('اسم')) continue

            sheetStudents.push({
              student_number: studentNumber,
              last_name: lastName || 'Unknown',
              first_name: firstName || 'Unknown',
              date_of_birth: dob,
            })
          }

          if (sheetStudents.length > 0) {
            // Create class first
            const newClass = await createClassMutation.mutateAsync({
              name: sheetName,
              subject: 'Mathematics',
              grade_level: sheetName,
              academic_year: selectedYear,
            })
            totalClasses++

            // Then add students
            await batchCreateStudentsMutation.mutateAsync({
              classId: newClass.id,
              students: sheetStudents,
            })
            totalStudents += sheetStudents.length
          }
        }

        if (totalClasses > 0) {
          toast.success(t('pages.grades.excel.multiSuccess', { classes: totalClasses, students: totalStudents }))
        } else {
          toast.error(t('pages.grades.excel.noData'))
        }
      } catch (error) {
        console.error('Error parsing Excel:', error)
        toast.error(t('pages.grades.excel.parseError'))
      }
    }
    reader.readAsBinaryString(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [createClassMutation, batchCreateStudentsMutation, selectedYear, t])

  // Handle manual class creation
  const handleCreateClass = useCallback(async () => {
    if (!newClassName.trim()) return

    // Check for duplicate class name
    const isDuplicate = classes.some(
      c => c.name.toLowerCase().trim() === newClassName.toLowerCase().trim()
    )
    if (isDuplicate) {
      toast.error(t('pages.grades.addClass.duplicate', 'A class with this name already exists'))
      return
    }

    try {
      const newClass = await createClassMutation.mutateAsync({
        name: newClassName,
        subject: newClassSubject || 'Mathematics',
        grade_level: newClassGrade || newClassName,
        academic_year: selectedYear,
      })

      toast.success(t('pages.grades.addClass.success'))
      setAddClassDialog(false)
      setNewClassName('')
      setNewClassSubject('')
      setNewClassGrade('')
      setSelectedClassId(newClass.id)
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [createClassMutation, newClassName, newClassSubject, newClassGrade, selectedYear, t])

  // Handle delete class
  const handleDeleteClass = useCallback(async () => {
    if (!deleteClassDialog.classId) return

    try {
      await deleteClassMutation.mutateAsync(deleteClassDialog.classId)
      toast.success(t('pages.grades.deleteClass.success'))
      setDeleteClassDialog({ open: false, classId: null })

      // Select another class if available
      const remainingClasses = classes.filter(c => c.id !== deleteClassDialog.classId)
      setSelectedClassId(remainingClasses[0]?.id || null)
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [deleteClassDialog.classId, deleteClassMutation, classes, t])

  // Handle update class level
  const handleUpdateLevel = useCallback(async () => {
    if (!editLevelDialog.classData) return

    try {
      await updateClassMutation.mutateAsync({
        id: editLevelDialog.classData.id,
        grade_level: editingLevel,
      })
      toast.success(t('pages.grades.editLevel.success', 'Level updated'))
      setEditLevelDialog({ open: false, classData: null })
      setEditingLevel('')
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [editLevelDialog.classData, editingLevel, updateClassMutation, t])

  // Handle delete all classes
  const [deleteAllDialog, setDeleteAllDialog] = useState(false)

  const handleDeleteAllClasses = useCallback(async () => {
    if (classes.length === 0) return

    try {
      await deleteAllClassesMutation.mutateAsync()
      toast.success(t('pages.grades.deleteAll.success', 'All classes deleted'))
      setDeleteAllDialog(false)
      setSelectedClassId(null)
    } catch (error) {
      toast.error(t('common.error'))
    }
  }, [classes.length, deleteAllClassesMutation, t])

  // Open edit level dialog
  const openEditLevel = useCallback((cls: GradeClass) => {
    setEditLevelDialog({ open: true, classData: cls })
    setEditingLevel(cls.grade_level || '')
  }, [])

  // Handle Excel export
  const handleExcelExport = useCallback(() => {
    const selectedClass = classes.find(c => c.id === selectedClassId)
    if (!selectedClass || !selectedClass.students || selectedClass.students.length === 0) {
      toast.error(t('pages.grades.export.noData', 'No data to export'))
      return
    }

    // Create worksheet data with headers
    const headers = [
      t('pages.grades.table.id', '#'),
      t('pages.grades.table.lastName', 'Last Name'),
      t('pages.grades.table.firstName', 'First Name'),
      t('pages.grades.table.behavior', 'Behavior'),
      t('pages.grades.table.applications', 'Applications'),
      t('pages.grades.table.notebook', 'Notebook'),
      t('pages.grades.table.assignment', 'Assignment'),
      t('pages.grades.table.exam', 'Exam'),
    ]

    const data = selectedClass.students.map((student, index) => [
      index + 1,
      student.last_name,
      student.first_name,
      student.behavior ?? 5,
      student.applications ?? 5,
      student.notebook ?? 5,
      student.assignment ?? 0,
      student.exam ?? 0,
    ])

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // #
      { wch: 20 }, // Last Name
      { wch: 20 }, // First Name
      { wch: 10 }, // Behavior
      { wch: 12 }, // Applications
      { wch: 10 }, // Notebook
      { wch: 12 }, // Assignment
      { wch: 10 }, // Exam
    ]

    XLSX.utils.book_append_sheet(wb, worksheet, selectedClass.name)

    // Generate filename with class name and term
    const filename = `${selectedClass.name}_Term${selectedTerm}_${selectedYear}.xlsx`
    XLSX.writeFile(wb, filename)

    toast.success(t('pages.grades.export.success', 'Grades exported successfully'))
  }, [classes, selectedClassId, selectedTerm, selectedYear, t])

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 ltr:mr-2 rtl:ml-2">
        {/* Class Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <BookOpen className="h-4 w-4" />
              <span className="ltr:mr-1 rtl:ml-1 max-w-[100px] truncate">
                {classes.find(c => c.id === selectedClassId)?.name || t('common.selectClass')}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {classes.length > 0 ? (
              classes.map((cls) => (
                <DropdownMenuItem
                  key={cls.id}
                  className={`flex justify-between gap-4 ${selectedClassId === cls.id ? "bg-accent" : ""}`}
                >
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => setSelectedClassId(cls.id)}
                  >
                    {cls.name}
                    {cls.grade_level && (
                      <span className="text-xs text-muted-foreground ml-2">({cls.grade_level})</span>
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditLevel(cls)
                    }}
                    className="text-xs text-primary hover:underline px-1"
                  >
                    {t('common.edit', 'Edit')}
                  </button>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                {t('common.noClasses')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Year Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <Calendar className="h-4 w-4" />
              <span className="ltr:mr-1 rtl:ml-1">{selectedYear}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-bold">
              {selectedYear}
              <span className="ltr:ml-2 rtl:mr-2 text-xs text-muted-foreground">
                ({t('pages.grades.yearSelector.current')})
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Term Selector */}
        <Tabs value={String(selectedTerm)} onValueChange={(v) => setSelectedTerm(Number(v) as Term)} className="w-auto">
          <TabsList className="h-9">
            <TabsTrigger value="1" className="text-xs px-3">{t('pages.grades.term1')}</TabsTrigger>
            <TabsTrigger value="2" className="text-xs px-3">{t('pages.grades.term2')}</TabsTrigger>
            <TabsTrigger value="3" className="text-xs px-3">{t('pages.grades.term3')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleExcelUpload}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('pages.grades.empty.uploadExcel')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAddClassDialog(true)}>
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('pages.grades.empty.createManually')}
          </DropdownMenuItem>
          {selectedClassId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExcelExport}>
                <Download className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.export.button', 'Export to Excel')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteClassDialog({ open: true, classId: selectedClassId })}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.deleteClass.title')}
              </DropdownMenuItem>
            </>
          )}
          {classes.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteAllDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.deleteAll.title', 'Delete All Classes')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  // Loading state
  if (isLoadingClasses) {
    return (
      <ContentPage title={t('pages.grades.title')} description={t('pages.grades.description')} rtl={isRTL}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ContentPage>
    )
  }

  return (
    <>
      <ContentPage
        title={t('pages.grades.title')}
        description={t('pages.grades.description')}
        rtl={isRTL}
        headerActions={headerActions}
      >
        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('pages.grades.empty.noClasses', 'No Classes Yet')}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {t('pages.grades.empty.noClassesDescription', 'Create your first class to start managing student grades and attendance.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setAddClassDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('pages.grades.empty.createManually', 'Create Class')}
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {t('pages.grades.empty.uploadExcel', 'Import from Excel')}
              </Button>
            </div>
          </div>
        ) : classLevelMissing ? (
          /* Warning: Level not set */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('pages.grades.levelMissing.title', 'Set Class Level First')}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {t('pages.grades.levelMissing.description', 'You need to set the grade level for this class before managing grades. This helps organize lessons and assessments correctly.')}
            </p>
            <Button onClick={() => selectedClass && openEditLevel(selectedClass)}>
              {t('pages.grades.levelMissing.action', 'Set Level Now')}
            </Button>
          </div>
        ) : (
          <GradeSheetTable
            classId={selectedClassId}
            term={selectedTerm}
            classes={classes}
            onClassSelect={setSelectedClassId}
          />
        )}
      </ContentPage>

      {/* Add Class Dialog */}
      <Dialog open={addClassDialog} onOpenChange={setAddClassDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.grades.addClass.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="className">{t('pages.grades.addClass.name')}</Label>
              <Input
                id="className"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={t('pages.grades.addClass.namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classSubject">{t('pages.grades.addClass.subject')}</Label>
              <Input
                id="classSubject"
                value={newClassSubject}
                onChange={(e) => setNewClassSubject(e.target.value)}
                placeholder={t('pages.grades.addClass.subjectPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classGrade">{t('pages.grades.addClass.grade')}</Label>
              <Input
                id="classGrade"
                value={newClassGrade}
                onChange={(e) => setNewClassGrade(e.target.value)}
                placeholder={t('pages.grades.addClass.gradePlaceholder')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClassDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateClass}
              disabled={!newClassName.trim() || createClassMutation.isPending}
            >
              {createClassMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('common.add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Class Dialog */}
      <Dialog open={deleteClassDialog.open} onOpenChange={(open) => setDeleteClassDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.grades.deleteClass.title')}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-muted-foreground">
              {deleteClassDialog.classId && getClassStudentCount(deleteClassDialog.classId) > 0
                ? t('pages.grades.deleteClass.hasStudents', { count: getClassStudentCount(deleteClassDialog.classId) })
                : t('pages.grades.deleteClass.confirm')
              }
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteClassDialog({ open: false, classId: null })}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteClass}
              disabled={deleteClassMutation.isPending}
            >
              {deleteClassMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Level Dialog */}
      <Dialog open={editLevelDialog.open} onOpenChange={(open) => setEditLevelDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('pages.grades.editLevel.title', 'Edit Class Level')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {t('pages.grades.editLevel.description', 'Set the grade level for')} <strong>{editLevelDialog.classData?.name}</strong>
            </p>
            <div className="space-y-2">
              <Label htmlFor="editLevel">{t('pages.grades.addClass.grade', 'Grade Level')}</Label>
              <select
                id="editLevel"
                value={editingLevel}
                onChange={(e) => setEditingLevel(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{t('common.selectLevel', 'Select Level')}</option>
                <option value="1AP">1AP - 1ère Année Primaire</option>
                <option value="2AP">2AP - 2ème Année Primaire</option>
                <option value="3AP">3AP - 3ème Année Primaire</option>
                <option value="4AP">4AP - 4ème Année Primaire</option>
                <option value="5AP">5AP - 5ème Année Primaire</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLevelDialog({ open: false, classData: null })}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleUpdateLevel}
              disabled={updateClassMutation.isPending || !editingLevel}
            >
              {updateClassMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Classes Dialog */}
      <Dialog open={deleteAllDialog} onOpenChange={setDeleteAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {t('pages.grades.deleteAll.title', 'Delete All Classes')}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-muted-foreground">
              {t('pages.grades.deleteAll.confirm', 'Are you sure you want to delete ALL classes? This will permanently remove {{count}} classes and all their students.', { count: classes.length })}
            </p>
            <p className="text-destructive font-medium mt-2">
              {t('pages.grades.deleteAll.warning', 'This action cannot be undone!')}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllClasses}
              disabled={deleteAllClassesMutation.isPending}
            >
              {deleteAllClassesMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('pages.grades.deleteAll.action', 'Delete All')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

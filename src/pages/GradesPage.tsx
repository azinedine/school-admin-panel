import { useRef, useState, useCallback, useEffect } from "react"
import { Upload, Plus, Trash2, MoreVertical, Calendar, ChevronDown, CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation } from "@tanstack/react-router"
import { GradeSheetTable } from "@/components/GradeSheetTable"
import { ContentPage } from "@/components/layout/content-page"
import { useDirection } from "@/hooks/use-direction"
import { useGradesStore, type StudentGrade, type Term } from "@/store/grades-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

export default function GradesPage() {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const location = useLocation()
  
  // Store actions
  const classes = useGradesStore((state) => state.classes)
  const students = useGradesStore((state) => state.students)
  const selectedClassId = useGradesStore((state) => state.selectedClassId)
  const setSelectedClass = useGradesStore((state) => state.setSelectedClass)
  const addClass = useGradesStore((state) => state.addClass)
  const addStudentsToClass = useGradesStore((state) => state.addStudentsToClass)

  const removeClass = useGradesStore((state) => state.removeClass)
  const clearAllData = useGradesStore((state) => state.clearAllData)
  const selectedYear = useGradesStore((state) => state.selectedYear)
  const selectedTerm = useGradesStore((state) => state.selectedTerm)
  const setYear = useGradesStore((state) => state.setYear)
  const setTerm = useGradesStore((state) => state.setTerm)

  const isYearInitialized = useGradesStore((state) => state.isYearInitialized)
  const initializeYear = useGradesStore((state) => state.initializeYear)
  
  // Calculate academic years (current and previous)
  const getAcademicYearData = useCallback(() => {
    const now = new Date()
    const month = now.getMonth() // 0-11
    const year = now.getFullYear()
    const startYear = month >= 8 ? year : year - 1
    return {
      current: `${startYear}-${startYear + 1}`,
      previous: `${startYear - 1}-${startYear}`
    }
  }, [])

  const academicYears = useState(getAcademicYearData())[0]
  const [initYear, setInitYear] = useState(academicYears.current)
  
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
  const [clearAllDialog, setClearAllDialog] = useState(false)

  // Sync URL class param with selected class
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const classParam = params.get('class')
    
    if (classParam && classes.some(c => c.id === classParam)) {
      // URL has valid class param - select it
      if (classParam !== selectedClassId) {
        setSelectedClass(classParam)
      }
    }
  }, [location.search, classes, selectedClassId, setSelectedClass])

  // Get student count for a class
  const getClassStudentCount = useCallback((classId: string) => {
    return students.filter(s => s.classId === classId).length
  }, [students])

  // Handle Excel file upload - each sheet becomes a class
  const handleExcelUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        
        let totalStudents = 0
        let totalClasses = 0

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | boolean | null | undefined)[][]
          if (!rawData || rawData.length < 2) return

          // Find header row - first row with multiple non-empty string cells
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
          if (!headers) return

          // Column finder with exact then partial matching
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

          // Map columns
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

          const sheetStudents: (Omit<StudentGrade, 'id' | 'classId'> & { id?: string })[] = []
          
          for (let i = headerRowIndex + 1; i < rawData.length; i++) {
            const row = rawData[i]
            if (!row || row.length === 0) continue
            
            const nonEmptyCells = row.filter(cell => cell !== undefined && cell !== null && cell !== '').length
            if (nonEmptyCells < 2) continue

            const lastName = lastNameIdx !== -1 ? String(row[lastNameIdx] || '') : ''
            const firstName = firstNameIdx !== -1 ? String(row[firstNameIdx] || '') : ''
            const studentId = idIdx !== -1 ? String(row[idIdx] || '') : undefined
            const dob = dobIdx !== -1 ? String(row[dobIdx] || '2013-01-01') : '2013-01-01'

            if (!lastName && !firstName) continue
            const combinedNames = (lastName + firstName).toLowerCase()
            if (combinedNames.includes('name') || combinedNames.includes('nom') || combinedNames.includes('اسم')) continue

            sheetStudents.push({
              id: studentId || undefined,
              lastName: lastName || 'Unknown',
              firstName: firstName || 'Unknown',
              dateOfBirth: dob,
              // Default CA scores to 5/5 (good starting point)
              behavior: 5,
              applications: 5,
              notebook: 5,
              assignment: 0,
              exam: 0,
            })
          }

          if (sheetStudents.length > 0) {
            const classId = addClass({
              name: sheetName,
              subject: 'Mathematics',
              grade: sheetName,
            })
            totalClasses++
            addStudentsToClass(classId, sheetStudents)
            totalStudents += sheetStudents.length
          }
        })

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
  }, [addClass, addStudentsToClass, t])

  // Handle manual class creation
  const handleCreateClass = useCallback(() => {
    if (!newClassName.trim()) return

    addClass({
      name: newClassName,
      subject: newClassSubject || 'Mathematics',
      grade: newClassGrade || newClassName,
    })

    toast.success(t('pages.grades.addClass.success'))
    setAddClassDialog(false)
    setNewClassName('')
    setNewClassSubject('')
    setNewClassGrade('')
  }, [addClass, newClassName, newClassSubject, newClassGrade, t])

  // Handle delete class
  const handleDeleteClass = useCallback(() => {
    if (!deleteClassDialog.classId) return
    
    removeClass(deleteClassDialog.classId)
    toast.success(t('pages.grades.deleteClass.success'))
    setDeleteClassDialog({ open: false, classId: null })
  }, [deleteClassDialog.classId, removeClass, t])

  // Handle clear all classes
  const handleClearAll = useCallback(() => {
    clearAllData()
    toast.success(t('pages.grades.deleteClass.success'))
    setClearAllDialog(false)
  }, [clearAllData, t])

  // Header actions - consolidated into dropdown menu
  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 ltr:mr-2 rtl:ml-2">
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
              <DropdownMenuItem onClick={() => setYear("2023-2024")}>2023-2024</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setYear("2024-2025")}>2024-2025</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setYear("2025-2026")}>2025-2026</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Term Selector */}
         <Tabs value={String(selectedTerm)} onValueChange={(v) => setTerm(Number(v) as Term)} className="w-auto">
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
              <DropdownMenuItem 
                onClick={() => setDeleteClassDialog({ open: true, classId: selectedClassId })}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.deleteClass.title')}
              </DropdownMenuItem>
            </>
          )}
          {classes.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setClearAllDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.grades.deleteClass.clearAll')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
  
  return (
    <>
      <ContentPage 
        title={t('pages.grades.title')} 
        description={t('pages.grades.description')}
        rtl={isRTL}
        headerActions={headerActions}
      >
        <GradeSheetTable />
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
            <Button onClick={handleCreateClass} disabled={!newClassName.trim()}>
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
            <Button variant="destructive" onClick={handleDeleteClass}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clearAllDialog} onOpenChange={setClearAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.grades.deleteClass.clearAll')}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-muted-foreground">
              {t('pages.grades.deleteClass.clearAllConfirm')}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearAllDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initialization Dialog */}
      <Dialog open={!isYearInitialized} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t('pages.grades.initYear.title')}</DialogTitle>
            <DialogDescription>{t('pages.grades.initYear.description')}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="w-full max-w-[240px]">
              <Label htmlFor="initYearSelect" className="sr-only">
                {t('pages.grades.initYear.label')}
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    id="initYearSelect"
                    variant="outline" 
                    className="w-full justify-between font-bold text-xl h-14"
                  >
                    {initYear}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[240px]" align="center">
                  <DropdownMenuItem disabled className="justify-between">
                    {academicYears.previous}
                    <span className="text-muted-foreground text-xs opacity-70">({new Date().getFullYear() - 1})</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setInitYear(academicYears.current)}
                    className="justify-between font-bold bg-secondary/20"
                  >
                    {academicYears.current}
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" size="lg" onClick={() => initializeYear(initYear)} className="w-full sm:w-auto">
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

import { useRef, useState, useCallback } from "react"
import { Upload, Plus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { GradeSheetTable } from "@/components/GradeSheetTable"
import { ContentPage } from "@/components/layout/content-page"
import { useDirection } from "@/hooks/use-direction"
import { useGradesStore } from "@/store/grades-store"
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
import { toast } from "sonner"
import * as XLSX from "xlsx"

export default function GradesPage() {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  
  // Store actions
  const classes = useGradesStore((state) => state.classes)
  const students = useGradesStore((state) => state.students)
  const selectedClassId = useGradesStore((state) => state.selectedClassId)
  const addClass = useGradesStore((state) => state.addClass)
  const addStudentsToClass = useGradesStore((state) => state.addStudentsToClass)
  const removeClass = useGradesStore((state) => state.removeClass)
  const clearAllData = useGradesStore((state) => state.clearAllData)
  
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

  // Get student count for a class
  const getClassStudentCount = useCallback((classId: string) => {
    return students.filter(s => s.classId === classId).length
  }, [students])

  // Handle Excel file upload - supports multiple classes via sheets or Class column
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

        if (workbook.SheetNames.length > 1) {
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            
            if (jsonData.length === 0) return
            
            const classId = addClass({
              name: sheetName,
              subject: 'Mathematics',
              grade: sheetName,
            })
            totalClasses++

            const studentsData = jsonData.map((row: any) => ({
              lastName: row['LastName'] || row['Nom'] || row['اللقب'] || '',
              firstName: row['FirstName'] || row['Prénom'] || row['الاسم'] || '',
              dateOfBirth: row['DateOfBirth'] || row['DateNaissance'] || row['تاريخ الميلاد'] || '2013-01-01',
              behavior: Number(row['Behavior'] || row['Comportement'] || row['السلوك']) || 20,
              applications: Number(row['Applications'] || row['التطبيقات']) || 20,
              notebook: Number(row['Notebook'] || row['Cahier'] || row['الدفتر']) || 20,
              assignment: Number(row['Assignment'] || row['Devoir'] || row['الفرض']) || 0,
              exam: Number(row['Exam'] || row['Examen'] || row['الامتحان']) || 0,
            }))

            addStudentsToClass(classId, studentsData)
            totalStudents += studentsData.length
          })
        } else {
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          if (jsonData.length === 0) {
            toast.error(t('pages.grades.excel.noData'))
            return
          }

          const firstRow = jsonData[0] as any
          const classColumn = firstRow['Class'] || firstRow['Classe'] || firstRow['الفصل']
          
          if (classColumn !== undefined) {
            const classesByName = new Map<string, any[]>()
            
            jsonData.forEach((row: any) => {
              const className = row['Class'] || row['Classe'] || row['الفصل'] || 'Default'
              if (!classesByName.has(className)) {
                classesByName.set(className, [])
              }
              classesByName.get(className)!.push(row)
            })

            classesByName.forEach((rows, className) => {
              const classId = addClass({
                name: className,
                subject: 'Mathematics',
                grade: className,
              })
              totalClasses++

              const studentsData = rows.map((row: any) => ({
                lastName: row['LastName'] || row['Nom'] || row['اللقب'] || '',
                firstName: row['FirstName'] || row['Prénom'] || row['الاسم'] || '',
                dateOfBirth: row['DateOfBirth'] || row['DateNaissance'] || row['تاريخ الميلاد'] || '2013-01-01',
                behavior: Number(row['Behavior'] || row['Comportement'] || row['السلوك']) || 20,
                applications: Number(row['Applications'] || row['التطبيقات']) || 20,
                notebook: Number(row['Notebook'] || row['Cahier'] || row['الدفتر']) || 20,
                assignment: Number(row['Assignment'] || row['Devoir'] || row['الفرض']) || 0,
                exam: Number(row['Exam'] || row['Examen'] || row['الامتحان']) || 0,
              }))

              addStudentsToClass(classId, studentsData)
              totalStudents += studentsData.length
            })
          } else {
            const className = file.name.replace(/\.[^/.]+$/, '')
            const classId = addClass({
              name: className,
              subject: 'Mathematics',
              grade: className,
            })
            totalClasses++

            const studentsData = jsonData.map((row: any) => ({
              lastName: row['LastName'] || row['Nom'] || row['اللقب'] || '',
              firstName: row['FirstName'] || row['Prénom'] || row['الاسم'] || '',
              dateOfBirth: row['DateOfBirth'] || row['DateNaissance'] || row['تاريخ الميلاد'] || '2013-01-01',
              behavior: Number(row['Behavior'] || row['Comportement'] || row['السلوك']) || 20,
              applications: Number(row['Applications'] || row['التطبيقات']) || 20,
              notebook: Number(row['Notebook'] || row['Cahier'] || row['الدفتر']) || 20,
              assignment: Number(row['Assignment'] || row['Devoir'] || row['الفرض']) || 0,
              exam: Number(row['Exam'] || row['Examen'] || row['الامتحان']) || 0,
            }))

            addStudentsToClass(classId, studentsData)
            totalStudents += studentsData.length
          }
        }

        if (totalClasses > 1) {
          toast.success(t('pages.grades.excel.multiSuccess', { classes: totalClasses, students: totalStudents }))
        } else {
          toast.success(t('pages.grades.addClass.uploadSuccess', { count: totalStudents }))
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

  // Header actions
  const headerActions = (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleExcelUpload}
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="gap-1"
      >
        <Upload className="h-4 w-4" />
        {t('pages.grades.empty.uploadExcel')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAddClassDialog(true)}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        {t('pages.grades.empty.createManually')}
      </Button>
      {selectedClassId && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-destructive hover:text-destructive"
          onClick={() => setDeleteClassDialog({ open: true, classId: selectedClassId })}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {classes.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setClearAllDialog(true)}
        >
          {t('pages.grades.deleteClass.clearAll')}
        </Button>
      )}
    </>
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

      {/* Clear All Classes Dialog */}
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
    </>
  )
}

import { useState, useMemo } from "react"
import { ArrowUpDown, Search } from "lucide-react"
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

interface StudentGrade {
  id: string              // رقم التعريف
  lastName: string        // اللقب
  firstName: string       // الاسم
  dateOfBirth: string     // تاريخ الميلاد
  behavior: number        // السلوك
  applications: number    // التطبيقات
  notebook: number        // الكراس
  lateness: number        // التأخر
  absences: number        // الغيابات
  activityAverage: number // معدل تقويم النشاطات /20
  assignment: number      // الفرض /20
  exam: number           // الإختبار /20
  finalAverage: number   // المعدل (calculated)
  remarks: string        // التقديرات (auto-generated)
}

type SortField = keyof StudentGrade
type SortDirection = "asc" | "desc" | null

const initialStudents: StudentGrade[] = [
  { id: "1101344040220100", lastName: "أوهمنة", firstName: "أروى", dateOfBirth: "2013-06-27", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 18.5, exam: 18, finalAverage: 18.83, remarks: "ممتاز" },
  { id: "1001344040411100", lastName: "إليفي", firstName: "لؤي عبد الجليل", dateOfBirth: "2013-10-20", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 16.5, exam: 16, finalAverage: 17.5, remarks: "ممتاز" },
  { id: "1101444010251200", lastName: "اسعيدي", firstName: "مارية", dateOfBirth: "2014-05-07", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 18, exam: 18, finalAverage: 18.67, remarks: "ممتاز" },
  { id: "1101344040411100", lastName: "بلهواري", firstName: "أروى", dateOfBirth: "2013-10-20", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 17, exam: 16.5, finalAverage: 17.83, remarks: "ممتاز" },
  { id: "1001444040061100", lastName: "بن دنون", firstName: "آدم", dateOfBirth: "2014-01-11", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 13, exam: 12.5, finalAverage: 14.94, remarks: "جيد جدا" },
  { id: "1101344040251200", lastName: "بن رجدال", firstName: "إكرام", dateOfBirth: "2013-05-07", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 18, exam: 17, finalAverage: 18.33, remarks: "ممتاز" },
  { id: "1001444120311100", lastName: "بن عدودة", firstName: "عصام الدين", dateOfBirth: "2014-06-16", behavior: 20, applications: 18, notebook: 18, lateness: 0, absences: 0, activityAverage: 18.67, assignment: 14, exam: 11, finalAverage: 14.56, remarks: "جيد جدا" },
  { id: "1001444010081200", lastName: "توري", firstName: "ماهر", dateOfBirth: "2014-01-18", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 14.5, exam: 13, finalAverage: 15.83, remarks: "ممتاز" },
  { id: "1101344040251100", lastName: "جبايلي", firstName: "آية", dateOfBirth: "2013-05-05", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 17, exam: 17.5, finalAverage: 18.17, remarks: "ممتاز" },
  { id: "1101344040241100", lastName: "جواهري", firstName: "جنة", dateOfBirth: "2013-04-24", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 18, exam: 18, finalAverage: 18.67, remarks: "ممتاز" },
  { id: "1001344040111200", lastName: "حجاج", firstName: "يزيد", dateOfBirth: "2013-02-11", behavior: 18, applications: 18, notebook: 18, lateness: 0, absences: 0, activityAverage: 18, assignment: 12, exam: 10, finalAverage: 13.33, remarks: "جيد" },
  { id: "1101244020211100", lastName: "حسناوي", firstName: "رهف", dateOfBirth: "2012-04-10", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 16, exam: 16.5, finalAverage: 17.5, remarks: "ممتاز" },
  { id: "1001444040161200", lastName: "حصباوي", firstName: "نضال", dateOfBirth: "2014-03-16", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 10, exam: 9, finalAverage: 12.78, remarks: "جيد" },
  { id: "1101344040091100", lastName: "دقيش", firstName: "يارة", dateOfBirth: "2013-01-19", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 16, exam: 15, finalAverage: 17, remarks: "ممتاز" },
  { id: "1001244040171100", lastName: "ديدوش", firstName: "وسام", dateOfBirth: "2012-03-17", behavior: 18, applications: 18, notebook: 18, lateness: 0, absences: 0, activityAverage: 18, assignment: 10, exam: 8, finalAverage: 12, remarks: "جيد" },
  { id: "1101344040241200", lastName: "رحماني", firstName: "ميسم", dateOfBirth: "2013-04-24", behavior: 18, applications: 18, notebook: 16, lateness: 1, absences: 1, activityAverage: 17.33, assignment: 12, exam: 11, finalAverage: 13.44, remarks: "جيد" },
  { id: "1101444040031200", lastName: "زقدان", firstName: "فرح", dateOfBirth: "2014-01-03", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 15, exam: 14, finalAverage: 16.11, remarks: "ممتاز" },
  { id: "1101544020231200", lastName: "ساحلي", firstName: "نور اليقين", dateOfBirth: "2015-04-23", behavior: 20, applications: 18, notebook: 16, lateness: 0, absences: 0, activityAverage: 18, assignment: 10, exam: 9, finalAverage: 12.33, remarks: "جيد" },
  { id: "1001444040301200", lastName: "سريدي", firstName: "أيمن", dateOfBirth: "2014-06-15", behavior: 18, applications: 16, notebook: 14, lateness: 1, absences: 1, activityAverage: 16, assignment: 8, exam: 6, finalAverage: 10, remarks: "متوسط" },
  { id: "1101344040121200", lastName: "شابي", firstName: "أسيل", dateOfBirth: "2013-02-12", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 17, exam: 17, finalAverage: 18, remarks: "ممتاز" },
  { id: "1101444010051200", lastName: "شارف", firstName: "آية الرحمان", dateOfBirth: "2014-01-10", behavior: 18, applications: 18, notebook: 16, lateness: 1, absences: 1, activityAverage: 17.33, assignment: 11, exam: 10, finalAverage: 12.78, remarks: "جيد" },
  { id: "1001344040111100", lastName: "شريف", firstName: "أيوب", dateOfBirth: "2013-02-11", behavior: 18, applications: 16, notebook: 14, lateness: 2, absences: 2, activityAverage: 16, assignment: 7, exam: 5, finalAverage: 9.33, remarks: "ضعيف. ضرورة المراجعة والاجتهاد" },
  { id: "1001444040091200", lastName: "طالب", firstName: "عماد الدين", dateOfBirth: "2014-01-19", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 17, exam: 16, finalAverage: 17.67, remarks: "ممتاز" },
  { id: "1001444040111100", lastName: "عثماني", firstName: "صفوان", dateOfBirth: "2014-02-11", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 12.5, exam: 11, finalAverage: 14.28, remarks: "جيد جدا" },
  { id: "1101344040121100", lastName: "فرحي", firstName: "سجى", dateOfBirth: "2013-02-12", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 17.5, exam: 18, finalAverage: 18.5, remarks: "ممتاز" },
  { id: "1101444040121100", lastName: "قماري", firstName: "عائشة", dateOfBirth: "2014-02-12", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 14, exam: 12, finalAverage: 15.11, remarks: "جيد جدا" },
  { id: "1001444040151200", lastName: "قواسمية", firstName: "جمال الدين", dateOfBirth: "2014-03-15", behavior: 18, applications: 16, notebook: 14, lateness: 2, absences: 2, activityAverage: 16, assignment: 7.5, exam: 6, finalAverage: 9.83, remarks: "ضعيف. ضرورة المراجعة والاجتهاد" },
  { id: "1101244010021200", lastName: "كراشي", firstName: "ريتاج", dateOfBirth: "2012-01-05", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 18, exam: 18.5, finalAverage: 18.83, remarks: "ممتاز" },
  { id: "1001344040121100", lastName: "كسال", firstName: "محمد حمزة", dateOfBirth: "2013-02-12", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 14, exam: 13, finalAverage: 15.44, remarks: "جيد جدا" },
  { id: "1001444040061200", lastName: "لعويسي", firstName: "سفيان", dateOfBirth: "2014-01-11", behavior: 18, applications: 16, notebook: 14, lateness: 3, absences: 3, activityAverage: 16, assignment: 6, exam: 5, finalAverage: 9, remarks: "ضعيف. ضرورة المراجعة والاجتهاد" },
  { id: "1101344040111100", lastName: "ماحي", firstName: "آية", dateOfBirth: "2013-02-11", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 17, exam: 17.5, finalAverage: 18.17, remarks: "ممتاز" },
  { id: "1101444010041200", lastName: "معتصم", firstName: "رقية", dateOfBirth: "2014-01-09", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 13, exam: 12, finalAverage: 14.78, remarks: "جيد جدا" },
  { id: "1101344040061100", lastName: "منصوري", firstName: "رتاج", dateOfBirth: "2013-01-11", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 15.5, exam: 15, finalAverage: 16.83, remarks: "ممتاز" },
  { id: "1001344040121200", lastName: "ميهوب", firstName: "عماد الدين", dateOfBirth: "2013-02-12", behavior: 18, applications: 18, notebook: 16, lateness: 1, absences: 1, activityAverage: 17.33, assignment: 10, exam: 9, finalAverage: 12.11, remarks: "جيد" },
  { id: "1001344040251100", lastName: "ناشف", firstName: "إسلام", dateOfBirth: "2013-05-05", behavior: 18, applications: 16, notebook: 14, lateness: 2, absences: 2, activityAverage: 16, assignment: 7, exam: 6, finalAverage: 9.67, remarks: "ضعيف. ضرورة المراجعة والاجتهاد" },
  { id: "1101444010281200", lastName: "هلايلي", firstName: "نور الإيمان", dateOfBirth: "2014-05-13", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 18, exam: 17.5, finalAverage: 18.5, remarks: "ممتاز" },
  { id: "1101444040101200", lastName: "واضح", firstName: "نهاد", dateOfBirth: "2014-02-10", behavior: 20, applications: 20, notebook: 18, lateness: 0, absences: 0, activityAverage: 19.33, assignment: 15, exam: 14.5, finalAverage: 16.28, remarks: "ممتاز" },
  { id: "1001444040221200", lastName: "ولهازي", firstName: "محمد رياض", dateOfBirth: "2014-04-22", behavior: 18, applications: 16, notebook: 14, lateness: 2, absences: 2, activityAverage: 16, assignment: 8, exam: 7, finalAverage: 10.33, remarks: "متوسط" },
  { id: "1101544020201200", lastName: "يحياوي", firstName: "هاجر", dateOfBirth: "2015-04-10", behavior: 20, applications: 20, notebook: 20, lateness: 0, absences: 0, activityAverage: 20, assignment: 16, exam: 16, finalAverage: 17.33, remarks: "ممتاز" },
]

function calculateActivityAverage(applications: number, notebook: number, lateness: number, absences: number): number {
  // معدل النشاطات = التطبيقات/5 + الكراس/5 + (5-التأخر) + (5-الغيابات) = /20
  // Only 4 components, each worth 5 points (behavior is NOT included in activity average)
  // Applications and notebook are stored as /20, so divide by 4 to get /5
  // Lateness and absences are deductions from 5 points each
  return Number(((applications / 4) + (notebook / 4) + Math.max(0, 5 - lateness) + Math.max(0, 5 - absences)).toFixed(2))
}




function calculateFinalAverage(activityAverage: number, assignment: number, exam: number): number {
  return Number(((activityAverage + assignment + exam) / 3).toFixed(2))
}

function getRemarks(average: number): string {
  if (average >= 16) return "ممتاز"
  if (average >= 14) return "جيد جدا"
  if (average >= 12) return "جيد"
  if (average >= 10) return "متوسط"
  return "ضعيف. ضرورة المراجعة والاجتهاد"
}

function getRowColor(average: number): string {
  if (average < 10) return "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30"
  if (average < 14) return "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
  return "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
}

export function GradeSheetTable() {
  const [students, setStudents] = useState<StudentGrade[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleCellEdit = (id: string, field: keyof StudentGrade, value: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== id) return student
      
      const numValue = Number(value)
      if (isNaN(numValue) || numValue < 0 || numValue > 20) return student
      
      const updated = { ...student, [field]: numValue }
      
      // Recalculate activity average if any of its component fields changed
      if (field === 'applications' || field === 'notebook' || field === 'lateness' || field === 'absences') {
        updated.activityAverage = calculateActivityAverage(
          updated.applications,
          updated.notebook,
          updated.lateness,
          updated.absences
        )
      }
      
      // Recalculate final average if any grade field changed
      if (field === 'activityAverage' || field === 'assignment' || field === 'exam' || 
          field === 'applications' || field === 'notebook' || field === 'lateness' || field === 'absences') {
        updated.finalAverage = calculateFinalAverage(
          updated.activityAverage,
          updated.assignment,
          updated.exam
        )
        updated.remarks = getRemarks(updated.finalAverage)
      }
      
      return updated
    }))
    setEditingCell(null)
  }

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students]
    
    // Filter
    if (searchQuery) {
      result = result.filter(student =>
        student.lastName.includes(searchQuery) ||
        student.firstName.includes(searchQuery)
      )
    }
    
    // Sort
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
  }, [students, searchQuery, sortField, sortDirection])

  const statistics = useMemo(() => {
    const total = students.length
    const classAverage = students.reduce((sum, s) => sum + s.finalAverage, 0) / total
    const passCount = students.filter(s => s.finalAverage >= 10).length
    const failCount = total - passCount
    
    return {
      classAverage: classAverage.toFixed(2),
      passRate: ((passCount / total) * 100).toFixed(1),
      failRate: ((failCount / total) * 100).toFixed(1),
    }
  }, [students])

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="text-right rtl:text-right font-bold">
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 hover:bg-transparent font-bold"
      >
        {children}
        <ArrowUpDown className="mr-2 h-3 w-3" />
      </Button>
    </TableHead>
  )

  const EditableCell = ({ 
    student, 
    field, 
    value 
  }: { 
    student: StudentGrade; 
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
  }

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو اللقب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9 text-right"
          />
        </div>
      </div>

      <div className="mb-3 rounded-md border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="font-semibold">
            عدد الطلاب: {students.length}
          </div>
          <div className="flex items-center gap-6">
            <div className="font-bold">
              معدل القسم: {statistics.classAverage}
            </div>
            <div className="text-muted-foreground">
              نسبة النجاح: {statistics.passRate}% | نسبة الرسوب: {statistics.failRate}%
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-right mb-3">
        <p>* انقر على الخلية لتعديل العلامة</p>
        <p>* سيتم حساب المعدل والتقديرات تلقائياً</p>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <SortableHeader field="id">رقم التعريف</SortableHeader>
              <SortableHeader field="lastName">اللقب</SortableHeader>
              <SortableHeader field="firstName">الاسم</SortableHeader>
              <SortableHeader field="dateOfBirth">تاريخ الميلاد</SortableHeader>
              <SortableHeader field="behavior">السلوك</SortableHeader>
              <SortableHeader field="applications">التطبيقات</SortableHeader>
              <SortableHeader field="notebook">الكراس</SortableHeader>
              <SortableHeader field="lateness">التأخر</SortableHeader>
              <SortableHeader field="absences">الغيابات</SortableHeader>
              <SortableHeader field="activityAverage">معدل النشاطات /20</SortableHeader>
              <SortableHeader field="assignment">الفرض /20</SortableHeader>
              <SortableHeader field="exam">الإختبار /20</SortableHeader>
              <SortableHeader field="finalAverage">المعدل</SortableHeader>
              <SortableHeader field="remarks">التقديرات</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.map((student, index) => (
              <TableRow 
                key={student.id}
                className={`${getRowColor(student.finalAverage)} ${
                  index % 2 === 0 ? 'bg-opacity-50' : ''
                }`}
              >
                <TableCell className="font-mono text-xs">{student.id}</TableCell>
                <TableCell className="font-semibold">{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell className="text-center">{student.dateOfBirth}</TableCell>
                <EditableCell student={student} field="behavior" value={student.behavior} />
                <EditableCell student={student} field="applications" value={student.applications} />
                <EditableCell student={student} field="notebook" value={student.notebook} />
                <TableCell className="text-center">{student.lateness}</TableCell>
                <TableCell className="text-center">{student.absences}</TableCell>
                <EditableCell student={student} field="activityAverage" value={student.activityAverage} />
                <EditableCell student={student} field="assignment" value={student.assignment} />
                <EditableCell student={student} field="exam" value={student.exam} />
                <TableCell className="text-center font-bold">{student.finalAverage.toFixed(2)}</TableCell>
                <TableCell className="text-right font-semibold">{student.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

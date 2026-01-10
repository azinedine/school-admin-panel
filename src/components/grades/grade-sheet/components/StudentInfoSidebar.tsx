import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileWarning } from "lucide-react"
import { useCurrentUser } from "@/store/auth-store"
import { StudentReportForm } from "@/components/features/reports/student-report/StudentReportForm"
import type { CalculatedStudentGrade } from "../types"

interface StudentInfoSidebarProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: CalculatedStudentGrade | null
    selectedYear: string
    selectedTerm: 1 | 2 | 3
    isRTL: boolean
    t: (key: string) => string
    className?: string // Added className prop
}

export function StudentInfoSidebar({
    open,
    onOpenChange,
    student,
    selectedYear,
    selectedTerm,
    isRTL,
    t,
    className = "", // Default to empty string if not passed
}: StudentInfoSidebarProps) {
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const user = useCurrentUser()

    // Determine institution name (fallback logic)
    // The user object might need 'institution' relation loaded, or we fetch it.
    // tailored for now to avoid breaking if missing
    const institutionName = user?.institution?.name || "Institution"

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={isRTL ? 'left' : 'right'} className="w-full sm:max-w-md overflow-y-auto">
                {student && (
                    <>
                        <SheetHeader>
                            <SheetTitle>
                                {student.firstName} {student.lastName}
                            </SheetTitle>
                            <SheetDescription>
                                {t('pages.grades.studentInfo.description')}
                            </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-6">
                            {/* Actions Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Actions
                                </h3>
                                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="w-full justify-start">
                                            <FileWarning className="mr-2 h-4 w-4" />
                                            Create Disciplinary Report
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
                                        <StudentReportForm
                                            student={{
                                                id: student.id,
                                                name: `${student.firstName} ${student.lastName}`,
                                                className: className || "N/A"
                                            }}
                                            teacher={{
                                                id: user?.id || 0,
                                                name: user?.name || "Unknown Teacher"
                                            }}
                                            institutionName={institutionName}
                                            academicYear={selectedYear}
                                            onSuccess={() => setIsReportDialogOpen(false)}
                                            onCancel={() => setIsReportDialogOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground">
                                    {t('pages.grades.studentInfo.basicInfo')}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.studentInfo.id')}</span>
                                        <span className="font-mono font-medium">{student.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.studentInfo.dateOfBirth')}</span>
                                        <span className="font-medium">{student.dateOfBirth}</span>
                                    </div>
                                    {student.specialCase && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('pages.grades.studentInfo.specialCase')}</span>
                                            <span className="font-medium">
                                                {['longAbsence', 'exemption', 'medical', 'transfer'].includes(student.specialCase)
                                                    ? t(`pages.grades.specialCase.${student.specialCase}`)
                                                    : student.specialCase}
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
                                        <span className="font-medium">{student.behavior}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.applications')}</span>
                                        <span className="font-medium">{student.applications}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.notebook')}</span>
                                        <span className="font-medium">{student.notebook}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.assignment')}</span>
                                        <span className="font-medium">{student.assignment}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.exam')}</span>
                                        <span className="font-medium">{student.exam}</span>
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
                                        <span className="font-medium">{student.lateness}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.absences')}</span>
                                        <span className="font-medium">{student.absences}</span>
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
                                        <span className="font-medium text-primary">{student.activityAverage.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.finalAverage')}</span>
                                        <span className="font-bold text-lg text-primary">{student.finalAverage.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.remarks')}</span>
                                        <span className="font-medium">{t(`pages.grades.remarks.${student.remarks}`)}</span>
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
    )
}

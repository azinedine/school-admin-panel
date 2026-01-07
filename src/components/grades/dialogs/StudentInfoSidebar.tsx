import { useTranslation } from "react-i18next"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import type { StudentInfoSidebarState } from "../shared/types"

interface StudentInfoSidebarProps {
    state: StudentInfoSidebarState
    isRTL: boolean
    selectedYear: string
    selectedTerm: 1 | 2 | 3
    onClose: () => void
}

export function StudentInfoSidebar({
    state,
    isRTL,
    selectedYear,
    selectedTerm,
    onClose,
}: StudentInfoSidebarProps) {
    const { t } = useTranslation()

    return (
        <Sheet
            open={state.open}
            onOpenChange={(open) => !open && onClose()}
        >
            <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-full sm:max-w-md overflow-y-auto"
            >
                {state.student && (
                    <>
                        <SheetHeader>
                            <SheetTitle>
                                {state.student.firstName} {state.student.lastName}
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
                                        <span className="font-mono font-medium">{state.student.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.studentInfo.dateOfBirth')}</span>
                                        <span className="font-medium">{state.student.dateOfBirth}</span>
                                    </div>
                                    {state.student.specialCase && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('pages.grades.studentInfo.specialCase')}</span>
                                            <span className="font-medium">
                                                {['longAbsence', 'exemption', 'medical', 'transfer'].includes(state.student.specialCase)
                                                    ? t(`pages.grades.specialCase.${state.student.specialCase}`)
                                                    : state.student.specialCase}
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
                                        <span className="font-medium">{state.student.behavior}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.applications')}</span>
                                        <span className="font-medium">{state.student.applications}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.notebook')}</span>
                                        <span className="font-medium">{state.student.notebook}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.assignment')}</span>
                                        <span className="font-medium">{state.student.assignment}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.exam')}</span>
                                        <span className="font-medium">{state.student.exam}</span>
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
                                        <span className="font-medium">{state.student.lateness}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.absences')}</span>
                                        <span className="font-medium">{state.student.absences}</span>
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
                                        <span className="font-medium text-primary">{state.student.activityAverage.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.finalAverage')}</span>
                                        <span className="font-bold text-lg text-primary">{state.student.finalAverage.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('pages.grades.table.remarks')}</span>
                                        <span className="font-medium">{t(`pages.grades.remarks.${state.student.remarks}`)}</span>
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

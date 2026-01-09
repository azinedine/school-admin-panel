import { useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Clock } from 'lucide-react'
import type { CalculatedStudentGrade } from '../types'

interface AttendanceRecord {
    id: string
    date: string
    time: string
    type: 'absence' | 'tardiness'
    createdAt: string
}

interface AttendanceHistoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: CalculatedStudentGrade | null
    getStudentRecords: (studentId: string, year: string, term: number) => AttendanceRecord[]
    selectedYear: string
    selectedTerm: number
    recordToDelete: string | null
    onDeleteClick: (id: string) => void
    onDeleteConfirm: (id: string) => void
    t: (key: string) => string
}

export function AttendanceHistoryDialog({
    open,
    onOpenChange,
    student,
    getStudentRecords,
    selectedYear,
    selectedTerm,
    recordToDelete,
    onDeleteClick,
    onDeleteConfirm,
    t,
}: AttendanceHistoryDialogProps) {
    const studentRecords = useMemo(() => {
        if (!student) return []
        return getStudentRecords(student.id, selectedYear, selectedTerm).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }, [student, getStudentRecords, selectedYear, selectedTerm])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('pages.grades.attendance.history')}
                        {student && ` - ${student.firstName} ${student.lastName}`}
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
                                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${record.type === 'absence'
                                            ? 'bg-red-100 dark:bg-red-950'
                                            : 'bg-orange-100 dark:bg-orange-950'
                                        }`}>
                                        <Clock className={`h-4 w-4 ${record.type === 'absence'
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-orange-600 dark:text-orange-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">
                                            {record.type === 'absence'
                                                ? t('pages.grades.attendance.absence')
                                                : t('pages.grades.attendance.tardiness')}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {record.date} - {record.time}
                                        </p>
                                    </div>
                                </div>
                                {recordToDelete === record.id ? (
                                    <div className="flex gap-1">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDeleteConfirm(record.id)}
                                        >
                                            {t('common.confirm')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDeleteClick('')}
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDeleteClick(record.id)}
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CalculatedStudentGrade } from '../types'

interface AttendanceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: CalculatedStudentGrade | null
    type: 'absence' | 'tardiness'
    date: string
    time: string
    onDateChange: (date: string) => void
    onTimeChange: (time: string) => void
    onConfirm: () => void
    t: (key: string) => string
}

export function AttendanceDialog({
    open,
    onOpenChange,
    student,
    type,
    date,
    time,
    onDateChange,
    onTimeChange,
    onConfirm,
    t,
}: AttendanceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {type === 'absence'
                            ? t('pages.grades.attendance.recordAbsence')
                            : t('pages.grades.attendance.recordTardiness')}
                    </DialogTitle>
                </DialogHeader>

                {student && (
                    <div className="space-y-4 py-4">
                        <p className="font-medium">
                            {student.firstName} {student.lastName}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">{t('pages.grades.attendance.date')}</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => onDateChange(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">{t('pages.grades.attendance.time')}</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => onTimeChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={onConfirm}>
                        {t('pages.grades.attendance.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import type { AttendanceDialogState } from "../types"

interface AttendanceDialogProps {
    state: AttendanceDialogState
    date: string
    time: string
    onDateChange: (date: string) => void
    onTimeChange: (time: string) => void
    onClose: () => void
    onConfirm: () => void
}

export function AttendanceDialog({
    state,
    date,
    time,
    onDateChange,
    onTimeChange,
    onClose,
    onConfirm,
}: AttendanceDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {state.type === 'absence'
                            ? t('pages.grades.attendance.recordAbsence')
                            : t('pages.grades.attendance.recordTardiness')}
                    </DialogTitle>
                </DialogHeader>

                {state.student && (
                    <div className="space-y-4 py-4">
                        <p className="font-medium">
                            {state.student.firstName} {state.student.lastName}
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
                    <Button variant="outline" onClick={onClose}>
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

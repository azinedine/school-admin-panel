import { useTranslation } from "react-i18next"
import { UserMinus, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import type { HistoryDialogState } from "../shared/types"

interface AttendanceRecord {
    id: string
    type: 'absence' | 'tardiness'
    date: string
    time: string
}

interface AttendanceHistoryDialogProps {
    state: HistoryDialogState
    records: AttendanceRecord[]
    recordToDelete: string | null
    onSetRecordToDelete: (id: string | null) => void
    onDeleteRecord: (id: string) => void
    onClose: () => void
}

export function AttendanceHistoryDialog({
    state,
    records,
    recordToDelete,
    onSetRecordToDelete,
    onDeleteRecord,
    onClose,
}: AttendanceHistoryDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('pages.grades.attendance.history')}
                        {state.student && ` - ${state.student.firstName} ${state.student.lastName}`}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-[300px] overflow-y-auto py-4">
                    {records.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            {t('pages.grades.attendance.noRecords')}
                        </p>
                    ) : (
                        records.map((record) => (
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
                                            onClick={() => onDeleteRecord(record.id)}
                                        >
                                            {t('pages.grades.attendance.confirm')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onSetRecordToDelete(null)}
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onSetRecordToDelete(record.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

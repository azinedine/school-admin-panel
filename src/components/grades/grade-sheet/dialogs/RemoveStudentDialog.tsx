import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { CalculatedStudentGrade } from '../types'

interface RemoveStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: CalculatedStudentGrade | null
    onConfirm: (studentId: string) => void
    t: (key: string, opts?: Record<string, unknown>) => string
}

export function RemoveStudentDialog({
    open,
    onOpenChange,
    student,
    onConfirm,
    t,
}: RemoveStudentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('pages.grades.studentManagement.removeFromClass')}</DialogTitle>
                </DialogHeader>

                {student && (
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            {t('pages.grades.studentManagement.removeStudentDescription', {
                                name: `${student.firstName} ${student.lastName}`
                            })}
                        </p>
                        <p className="text-sm font-medium text-destructive">
                            {t('pages.grades.studentManagement.removeWarning')}
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => student && onConfirm(student.id)}
                    >
                        {t('pages.grades.studentManagement.confirmRemove')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

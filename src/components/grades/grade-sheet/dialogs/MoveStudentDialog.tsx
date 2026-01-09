import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Move } from 'lucide-react'
import type { CalculatedStudentGrade, GradeClass } from '../types'

interface MoveStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: CalculatedStudentGrade | null
    classes: GradeClass[]
    onMove: (studentId: string, newClassId: string) => void
    t: (key: string, opts?: Record<string, unknown>) => string
}

export function MoveStudentDialog({
    open,
    onOpenChange,
    student,
    classes,
    onMove,
    t,
}: MoveStudentDialogProps) {
    const availableClasses = classes.filter(c => c.id !== student?.classId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('pages.grades.studentManagement.moveToClass')}</DialogTitle>
                </DialogHeader>

                {student && (
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            {t('pages.grades.studentManagement.moveStudentDescription', {
                                name: `${student.firstName} ${student.lastName}`
                            })}
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="targetClass">{t('pages.grades.studentManagement.selectClass')}</Label>
                            <div className="grid gap-2">
                                {availableClasses.map((cls) => (
                                    <Button
                                        key={cls.id}
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() => onMove(student.id, cls.id)}
                                    >
                                        <Move className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                        {cls.name}
                                    </Button>
                                ))}
                                {availableClasses.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        {t('pages.grades.studentManagement.noOtherClasses')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

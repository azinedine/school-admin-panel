import { useTranslation } from "react-i18next"
import { Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import type { GradeClass } from "@/features/grades"
import type { MoveStudentDialogState } from "../shared/types"

interface MoveStudentDialogProps {
    state: MoveStudentDialogState
    classes: GradeClass[]
    onMove: (studentId: string, newClassId: string) => void
    onClose: () => void
}

export function MoveStudentDialog({
    state,
    classes,
    onMove,
    onClose,
}: MoveStudentDialogProps) {
    const { t } = useTranslation()

    const availableClasses = classes.filter(c => c.id !== state.student?.classId)

    return (
        <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('pages.grades.studentManagement.moveToClass')}</DialogTitle>
                </DialogHeader>

                {state.student && (
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            {t('pages.grades.studentManagement.moveStudentDescription', {
                                name: `${state.student.firstName} ${state.student.lastName}`
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
                                        onClick={() => onMove(state.student!.id, cls.id)}
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
                    <Button variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

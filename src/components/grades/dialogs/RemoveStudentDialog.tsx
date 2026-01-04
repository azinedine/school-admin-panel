import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import type { RemoveStudentDialogState } from "../types"

interface RemoveStudentDialogProps {
    state: RemoveStudentDialogState
    onRemove: (studentId: string) => void
    onClose: () => void
}

export function RemoveStudentDialog({
    state,
    onRemove,
    onClose,
}: RemoveStudentDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('pages.grades.studentManagement.removeFromClass')}</DialogTitle>
                </DialogHeader>

                {state.student && (
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            {t('pages.grades.studentManagement.removeStudentDescription', {
                                name: `${state.student.firstName} ${state.student.lastName}`
                            })}
                        </p>
                        <p className="text-sm font-medium text-destructive">
                            {t('pages.grades.studentManagement.removeWarning')}
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => state.student && onRemove(state.student.id)}
                    >
                        {t('pages.grades.studentManagement.confirmRemove')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

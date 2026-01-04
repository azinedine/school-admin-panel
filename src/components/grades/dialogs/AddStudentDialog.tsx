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
import type { NewStudentForm } from "../types"

interface AddStudentDialogProps {
    open: boolean
    student: NewStudentForm
    onStudentChange: (student: NewStudentForm) => void
    onClose: () => void
    onAdd: () => void
}

export function AddStudentDialog({
    open,
    student,
    onStudentChange,
    onClose,
    onAdd,
}: AddStudentDialogProps) {
    const { t } = useTranslation()

    const handleClose = () => {
        onStudentChange({
            id: '',
            lastName: '',
            firstName: '',
            dateOfBirth: '2013-01-01',
        })
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('pages.grades.addStudent.title')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="studentId">{t('pages.grades.addStudent.id')}</Label>
                            <Input
                                id="studentId"
                                placeholder={t('pages.grades.addStudent.idPlaceholder')}
                                value={student.id}
                                onChange={(e) => onStudentChange({ ...student, id: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                {t('pages.grades.addStudent.idOptional')}
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="lastName">{t('pages.grades.addStudent.lastName')} *</Label>
                            <Input
                                id="lastName"
                                placeholder={t('pages.grades.addStudent.lastNamePlaceholder')}
                                value={student.lastName}
                                onChange={(e) => onStudentChange({ ...student, lastName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="firstName">{t('pages.grades.addStudent.firstName')} *</Label>
                            <Input
                                id="firstName"
                                placeholder={t('pages.grades.addStudent.firstNamePlaceholder')}
                                value={student.firstName}
                                onChange={(e) => onStudentChange({ ...student, firstName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dateOfBirth">{t('pages.grades.addStudent.dateOfBirth')}</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={student.dateOfBirth}
                                onChange={(e) => onStudentChange({ ...student, dateOfBirth: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={onAdd} disabled={!student.lastName.trim() || !student.firstName.trim()}>
                        {t('pages.grades.addStudent.add')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

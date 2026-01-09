import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { NewStudentForm } from '../types'

interface AddStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newStudent: NewStudentForm
    onStudentChange: (student: NewStudentForm) => void
    onAdd: () => void
    t: (key: string) => string
}

export function AddStudentDialog({
    open,
    onOpenChange,
    newStudent,
    onStudentChange,
    onAdd,
    t,
}: AddStudentDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                                value={newStudent.id}
                                onChange={(e) => onStudentChange({ ...newStudent, id: e.target.value })}
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
                                value={newStudent.lastName}
                                onChange={(e) => onStudentChange({ ...newStudent, lastName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="firstName">{t('pages.grades.addStudent.firstName')} *</Label>
                            <Input
                                id="firstName"
                                placeholder={t('pages.grades.addStudent.firstNamePlaceholder')}
                                value={newStudent.firstName}
                                onChange={(e) => onStudentChange({ ...newStudent, firstName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dateOfBirth">{t('pages.grades.addStudent.dateOfBirth')}</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={newStudent.dateOfBirth}
                                onChange={(e) => onStudentChange({ ...newStudent, dateOfBirth: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={onAdd}>
                        {t('pages.grades.addStudent.add')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

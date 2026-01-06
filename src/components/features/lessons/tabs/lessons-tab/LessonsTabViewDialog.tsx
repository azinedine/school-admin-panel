import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { LessonPrepDetails } from '@/components/features/lessons'
import type { LessonPreparation } from '@/schemas/lesson-preparation'

interface LessonsTabViewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedPrep: LessonPreparation | null
    onClose: () => void
}

export function LessonsTabViewDialog({
    open,
    onOpenChange,
    selectedPrep,
    onClose,
}: LessonsTabViewDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-xl">{selectedPrep?.lesson_number}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {t('lessons.viewDetails', 'View lesson details')}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
                    <div className="flex justify-end pt-4 border-t mt-6">
                        <Button variant="outline" onClick={onClose}>
                            {t('common.close', 'Close')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

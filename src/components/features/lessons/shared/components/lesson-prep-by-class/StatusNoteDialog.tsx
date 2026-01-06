import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import type { DailyPlanEntry } from '@/store/prep-store'
import type { TFunction } from 'i18next'

interface StatusNoteDialogProps {
    t: TFunction
    open: boolean
    onOpenChange: (open: boolean) => void
    pendingStatus: DailyPlanEntry['status'] | null
    statusNote: string
    onNoteChange: (value: string) => void
    onSave: () => void
}

/**
 * Single Responsibility: Status note input dialog
 */
export function StatusNoteDialog({
    t,
    open,
    onOpenChange,
    pendingStatus,
    statusNote,
    onNoteChange,
    onSave,
}: StatusNoteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {pendingStatus === 'postponed'
                            ? t('pages.prep.status.postponedReason')
                            : t('pages.prep.status.addNote')}
                    </DialogTitle>
                    <DialogDescription>
                        {pendingStatus === 'postponed'
                            ? t('pages.prep.status.postponedPlaceholder')
                            : t('common.addNote')}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={statusNote}
                        onChange={(e) => onNoteChange(e.target.value)}
                        placeholder={t('common.typeHere')}
                        className="resize-none"
                        rows={3}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={onSave}>{t('common.save')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

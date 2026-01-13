import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'

interface TermSetupFooterProps {
    t: (key: string) => string
    onCancel: () => void
    onSave: () => void
    isValid: boolean
}

export function TermSetupFooter({
    t,
    onCancel,
    onSave,
    isValid
}: TermSetupFooterProps) {
    return (
        <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
                {t('common.cancel')}
            </Button>
            <Button
                onClick={onSave}
                disabled={!isValid}
            >
                {t('common.save')}
            </Button>
        </DialogFooter>
    )
}

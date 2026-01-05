import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface ViewDialogFooterProps {
    onClose: () => void
}

export function ViewDialogFooter({ onClose }: ViewDialogFooterProps) {
    const { t } = useTranslation()

    return (
        <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
                {t('common.close', 'Close')}
            </Button>
        </div>
    )
}

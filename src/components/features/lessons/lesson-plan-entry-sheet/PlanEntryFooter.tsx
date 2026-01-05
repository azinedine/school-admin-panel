import { useTranslation } from 'react-i18next'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlanEntryFooterProps {
    onSave: () => void
}

export function PlanEntryFooter({ onSave }: PlanEntryFooterProps) {
    const { t } = useTranslation()

    return (
        <div className="p-4 border-t mt-auto bg-background">
            <Button className="w-full gap-2" onClick={onSave}>
                <Save className="h-4 w-4" />
                {t('pages.prep.details.saveChanges')}
            </Button>
        </div>
    )
}

import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TimetableActionsProps {
    onEditClick: () => void
}

export function TimetableActions({ onEditClick }: TimetableActionsProps) {
    const { t } = useTranslation()

    return (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onEditClick}>
                <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.prep.timetable.edit')}
            </Button>
        </div>
    )
}

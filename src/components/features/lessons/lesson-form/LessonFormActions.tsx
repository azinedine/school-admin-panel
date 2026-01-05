import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LessonFormActionsProps {
    isLoading?: boolean
    isEditing?: boolean
    onCancel?: () => void
}

export function LessonFormActions({
    isLoading = false,
    isEditing = false,
    onCancel,
}: LessonFormActionsProps) {
    const { t } = useTranslation()

    return (
        <div className="flex justify-end gap-3">
            {onCancel && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {t('common.cancel', 'Cancel')}
                </Button>
            )}
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing
                    ? t('common.update', 'Update')
                    : t('common.create', 'Create')}
            </Button>
        </div>
    )
}

import { useTranslation } from 'react-i18next'

interface ViewDialogTimestampsProps {
    createdAt: string
    updatedAt: string
}

export function ViewDialogTimestamps({
    createdAt,
    updatedAt,
}: ViewDialogTimestampsProps) {
    const { t } = useTranslation()

    return (
        <div className="pt-4 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
                <span>
                    {t('common.createdAt', 'Created')}: {createdAt}
                </span>
                <span>
                    {t('common.updatedAt', 'Updated')}: {updatedAt}
                </span>
            </div>
        </div>
    )
}

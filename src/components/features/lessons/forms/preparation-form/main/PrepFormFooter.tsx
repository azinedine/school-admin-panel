import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrepFormFooterProps {
    isLoading?: boolean
    isEditing?: boolean
    language?: string
    onCancel?: () => void
}

export function PrepFormFooter({
    isLoading,
    isEditing,
    language,
    onCancel,
}: PrepFormFooterProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="flex justify-between items-center px-6 py-4 border-t bg-background sticky bottom-0 z-10 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
            <div className="text-xs text-muted-foreground font-medium">
                {isEditing
                    ? t('pages.prep.lastEdited', 'Editing existing preparation')
                    : t('pages.prep.newDraft', 'Creating new preparation')}
            </div>
            <div className="flex gap-3">
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
                <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing
                        ? t('pages.prep.update', 'Update Preparation')
                        : t('pages.prep.create', 'Create Preparation')}
                </Button>
            </div>
        </div>
    )
}

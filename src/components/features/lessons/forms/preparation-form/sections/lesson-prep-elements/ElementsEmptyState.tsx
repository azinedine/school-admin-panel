import { useTranslation } from 'react-i18next'

interface ElementsEmptyStateProps {
    language?: string
}

export function ElementsEmptyState({ language }: ElementsEmptyStateProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="flex flex-col items-center justify-center text-center py-8 border-2 border-dashed rounded-xl bg-muted/10 border-muted">
            <p className="text-muted-foreground font-medium mb-1">
                {t('pages.prep.lessonElements.noElements', 'No elements yet')}
            </p>
            <p className="text-xs text-muted-foreground/60">
                {t('pages.prep.lessonElements.optional', 'Optional: Add lesson elements if needed')}
            </p>
        </div>
    )
}

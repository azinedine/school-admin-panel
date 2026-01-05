import { useTranslation } from 'react-i18next'

interface NotesEmptyStateProps {
    language?: string
}

export function NotesEmptyState({ language }: NotesEmptyStateProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="flex flex-col items-center justify-center text-center py-8 border-2 border-dashed rounded-xl bg-muted/10 border-muted">
            <p className="text-muted-foreground font-medium mb-1">
                {t('pages.prep.noNotes', 'No notes added')}
            </p>
            <p className="text-xs text-muted-foreground/60">
                {t('pages.prep.notesOptional', 'Optional: Add private notes for yourself')}
            </p>
        </div>
    )
}

import { useTranslation } from 'react-i18next'

interface ViewDialogContentProps {
    content: string | null | undefined
}

export function ViewDialogContent({ content }: ViewDialogContentProps) {
    const { t } = useTranslation()

    if (!content) return null

    return (
        <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t('lessons.form.content', 'Lesson Content')}
            </h4>
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
        </div>
    )
}

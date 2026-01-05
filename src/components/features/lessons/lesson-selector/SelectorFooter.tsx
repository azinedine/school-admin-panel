import { useTranslation } from 'react-i18next'

interface SelectorFooterProps {
    count: number
}

export function SelectorFooter({ count }: SelectorFooterProps) {
    const { t } = useTranslation()

    return (
        <div className="p-4 border-t bg-muted/10 text-xs text-center text-muted-foreground">
            {count} {t('pages.addLesson.lessonsCount', { count })}
        </div>
    )
}

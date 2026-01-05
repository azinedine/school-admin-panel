import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'

export function SelectorEmptyState() {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center">
            <BookOpen className="h-12 w-12 mb-4 opacity-20" />
            <p>{t('pages.prep.noLessonsFound')}</p>
        </div>
    )
}

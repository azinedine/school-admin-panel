import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LessonTemplate } from '@/store/prep-store'

interface SelectorTemplateItemProps {
    template: LessonTemplate
    isAdded: boolean
    onSelect: () => void
}

export function SelectorTemplateItem({
    template,
    isAdded,
    onSelect,
}: SelectorTemplateItemProps) {
    const { t } = useTranslation()

    return (
        <div
            className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
            onClick={onSelect}
        >
            <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {template.lessonNumber}
                    </h4>
                    {isAdded && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle2 className="h-3 w-3" />
                            {t('pages.prep.alreadyAdded')}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs font-normal">
                        {t(`pages.addLesson.years.${template.academicYear}`)}
                    </Badge>
                    {template.field && (
                        <>
                            <span>•</span>
                            <span>{template.field}</span>
                        </>
                    )}
                </div>
                {template.learningSegment && (
                    <p className="text-xs text-muted-foreground pt-1 line-clamp-1">
                        {template.learningSegment}
                    </p>
                )}
            </div>
            <Button
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {t('pages.prep.select')}
            </Button>
        </div>
    )
}

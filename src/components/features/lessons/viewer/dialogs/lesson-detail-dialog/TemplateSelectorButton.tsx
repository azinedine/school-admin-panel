import { X, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LessonTemplate } from '@/store/prep-store'
import type { TFunction } from 'i18next'

interface TemplateSelectorButtonProps {
    t: TFunction
    selectedTemplate: LessonTemplate | null
    onOpenSelector: () => void
    onClearTemplate: () => void
}

/**
 * Single Responsibility: Template selection UI
 */
export function TemplateSelectorButton({
    t,
    selectedTemplate,
    onOpenSelector,
    onClearTemplate,
}: TemplateSelectorButtonProps) {
    if (selectedTemplate) {
        return (
            <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{selectedTemplate.lessonNumber}</span>
                    <span className="text-xs text-muted-foreground">{selectedTemplate.field}</span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearTemplate}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={onOpenSelector}
        >
            <BookOpen className="w-4 h-4 mr-2 rtl:ml-2" />
            {t('pages.prep.selectFromLibrary')}
        </Button>
    )
}

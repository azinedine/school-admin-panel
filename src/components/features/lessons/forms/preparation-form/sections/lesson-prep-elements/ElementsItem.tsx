import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface ElementsItemProps {
    control: Control<LessonPreparationFormData>
    index: number
    fieldId: string
    onRemove: () => void
    isLoading?: boolean
    language?: string
}

export function ElementsItem({
    control,
    index,
    fieldId,
    onRemove,
    isLoading,
    language,
}: ElementsItemProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div
            key={fieldId}
            className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
            <FormField
                control={control}
                name={`lesson_elements.${index}.content`}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex gap-4 items-start">
                            <Badge
                                variant="outline"
                                className="mt-2 h-6 w-6 flex items-center justify-center rounded-full shrink-0 border-primary/20 bg-primary/5 text-primary"
                            >
                                {index + 1}
                            </Badge>
                            <div className="flex-1">
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={t(
                                            'pages.prep.lessonElements.elementPlaceholder',
                                            'Enter lesson element content...'
                                        )}
                                        className="min-h-[80px] resize-y"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                onClick={onRemove}
                                disabled={isLoading}
                                title={t('pages.prep.lessonElements.removeElement', 'Remove Element')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    )
}

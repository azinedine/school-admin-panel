import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Bookmark } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface ContextLearningUnitFieldProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function ContextLearningUnitField({
    control,
    isLoading,
    language,
}: ContextLearningUnitFieldProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <FormField
            control={control}
            name="learning_unit"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2 text-primary/80">
                        <Bookmark className="h-4 w-4" />
                        {t('pages.prep.learningUnit', 'Learning Unit')}
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={t('pages.prep.lessonStructure.learningSegmentPlaceholder', 'Enter unit')}
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

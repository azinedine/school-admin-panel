import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface EvaluationContentProps {
    control: Control<LessonPreparationFormData>
    evaluationType: string
    isLoading?: boolean
    language?: string
}

export function EvaluationContent({
    control,
    evaluationType,
    isLoading,
    language,
}: EvaluationContentProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <FormField
            control={control}
            name="evaluation_content"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2 text-primary/80">
                        <FileText className="h-4 w-4" />
                        {evaluationType === 'assessment'
                            ? t('pages.prep.assessment', 'Assessment')
                            : t('pages.prep.homework', 'Homework')}{' '}
                        {t('pages.prep.evaluationContent', 'Content')}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            placeholder={
                                evaluationType === 'assessment'
                                    ? t('pages.prep.assessmentPlaceholder')
                                    : t('pages.prep.homeworkPlaceholder')
                            }
                            className="min-h-[100px] border-amber-200/40 focus-visible:ring-amber-500/20"
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

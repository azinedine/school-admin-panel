import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Library } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface ContextKnowledgeResourceFieldProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function ContextKnowledgeResourceField({
    control,
    isLoading,
    language,
}: ContextKnowledgeResourceFieldProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <FormField
            control={control}
            name="knowledge_resource"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2 text-primary/80">
                        <Library className="h-4 w-4" />
                        {t('pages.prep.knowledgeResource', 'Knowledge Resource')}
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={t('pages.prep.lessonStructure.knowledgeResourcePlaceholder', 'Enter resource')}
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

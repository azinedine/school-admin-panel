import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Book } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface ContextDomainFieldProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function ContextDomainField({
    control,
    isLoading,
    language,
}: ContextDomainFieldProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <FormField
            control={control}
            name="domain"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center gap-2 text-primary/80">
                        <Book className="h-4 w-4" />
                        {t('pages.prep.domain', 'Domain')}
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={t('pages.prep.lessonStructure.fieldPlaceholder', 'Enter domain')}
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

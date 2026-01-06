import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { Hash } from 'lucide-react'

interface PrepFormIdProps {
    control: Control<LessonPreparationFormData>
    disabled?: boolean
    language?: string
}

export function PrepFormId({ control, disabled, language }: PrepFormIdProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="md:col-span-1">
            <FormField
                control={control}
                name="lesson_number"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {t('pages.prep.id', 'ID')}
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                className="h-8 text-sm font-medium bg-background"
                                placeholder="#"
                                {...field}
                                disabled={disabled}
                                min={1}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

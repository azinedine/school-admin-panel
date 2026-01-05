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
import { Calendar } from 'lucide-react'

interface PrepFormDateProps {
    control: Control<LessonPreparationFormData>
    disabled?: boolean
    language?: string
}

export function PrepFormDate({ control, disabled, language }: PrepFormDateProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="md:col-span-2">
            <FormField
                control={control}
                name="date"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t('pages.prep.date', 'Date')}
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                className="h-8 text-sm bg-background"
                                {...field}
                                disabled={disabled}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

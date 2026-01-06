import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface EvaluationDurationProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function EvaluationDuration({
    control,
    isLoading,
    language,
}: EvaluationDurationProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <FormField
            control={control}
            name="evaluation_duration"
            render={({ field }) => (
                <FormItem className="w-full sm:w-32">
                    <FormControl>
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12 text-center font-mono"
                                min={1}
                                disabled={isLoading}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground text-xs font-medium">
                                {t('common.minutes', 'min')}
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

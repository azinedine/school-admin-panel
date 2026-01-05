import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Home } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface EvaluationTypeTabsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function EvaluationTypeTabs({
    control,
    isLoading,
    language,
}: EvaluationTypeTabsProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <FormField
            control={control}
            name="evaluation_type"
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel className="sr-only">
                        {t('pages.prep.evaluationType', 'Evaluation Type')}
                    </FormLabel>
                    <FormControl>
                        <Tabs
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 h-10">
                                <TabsTrigger
                                    value="assessment"
                                    disabled={isLoading}
                                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-xs sm:text-sm h-8"
                                >
                                    <CheckCircle2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    {t('pages.prep.assessment', 'Assessment')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="homework"
                                    disabled={isLoading}
                                    className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-xs sm:text-sm h-8"
                                >
                                    <Home className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    {t('pages.prep.homework', 'Homework')}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

import { type Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, CheckCircle2, Home, FileText } from 'lucide-react'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface LessonPrepEvaluationProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepEvaluation({
    control,
    isLoading,
    language,
}: LessonPrepEvaluationProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    // Watch evaluation type to update labels dynamically
    const evaluationType = useWatch({
        control,
        name: 'evaluation_type',
    })

    return (

        // In return:
        <Card className="border-2 shadow-sm overflow-hidden">
            {/* Header with Type Selector and Duration */}
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-amber-600" />
                        </div>
                        <CardTitle className="text-lg">
                            {t('pages.prep.evaluation', 'Evaluation')}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <FormField
                        control={control}
                        name="evaluation_type"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel className="sr-only">{t('pages.prep.evaluationType', 'Evaluation Type')}</FormLabel>
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
                                            onChange={e => field.onChange(Number(e.target.value))}
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
                </div>

                {/* Dynamic Content Field */}
                <FormField
                    control={control}
                    name="evaluation_content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-primary/80">
                                <FileText className="h-4 w-4" />
                                {evaluationType === 'assessment'
                                    ? t('pages.prep.assessment', 'Assessment')
                                    : t('pages.prep.homework', 'Homework')} {t('pages.prep.evaluationContent', 'Content')}
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
            </CardContent>
        </Card>
    )
}

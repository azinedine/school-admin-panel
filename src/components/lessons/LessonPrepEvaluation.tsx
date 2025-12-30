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
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.evaluation', 'Evaluation')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                    control={control}
                    name="evaluation_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">{t('pages.prep.evaluationType', 'Evaluation Type')}</FormLabel>
                            <FormControl>
                                <Tabs
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
                                        <TabsTrigger
                                            value="assessment"
                                            disabled={isLoading}
                                            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            {t('pages.prep.assessment', 'Assessment')}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="homework"
                                            disabled={isLoading}
                                            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
                                        >
                                            <Home className="mr-2 h-4 w-4" />
                                            {t('pages.prep.homework', 'Homework')}
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                            ? t('pages.prep.assessmentPlaceholder', 'Describe the assessment...')
                                            : t('pages.prep.homeworkPlaceholder', 'Describe the homework...')
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

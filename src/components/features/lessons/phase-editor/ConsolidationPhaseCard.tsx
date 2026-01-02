import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Home } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { DurationInput } from './DurationInput'

interface ConsolidationPhaseCardProps {
    control: Control<LessonPreparationFormData>
    index: number
    isLoading?: boolean
    language?: string
}

/**
 * Special consolidation phase card with evaluation type selector
 * Open/Closed: Extends base phase with additional evaluation UI
 */
export function ConsolidationPhaseCard({
    control,
    index,
    isLoading,
    language,
}: ConsolidationPhaseCardProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT


    return (
        <div className="grid gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card hover:shadow-sm transition-all">
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2">
                    <Badge
                        variant="outline"
                        className="uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600"
                    >
                        {t('pages.prep.evaluation', 'Consolidation / Application')}
                    </Badge>

                    <DurationInput
                        control={control}
                        name={`phases.${index}.duration_minutes`}
                        disabled={isLoading}
                        label={t('common.minutes', 'min')}
                    />
                </div>

                {/* Evaluation Type Selector */}
                <FormField
                    control={control}
                    name="evaluation_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Tabs
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 p-1 h-9 bg-muted/50">
                                        <TabsTrigger
                                            value="assessment"
                                            disabled={isLoading}
                                            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-xs h-7"
                                        >
                                            <CheckCircle2 className="mr-2 h-3 w-3" />
                                            {t('pages.prep.assessment', 'Assessment')}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="homework"
                                            disabled={isLoading}
                                            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-xs h-7"
                                        >
                                            <Home className="mr-2 h-3 w-3" />
                                            {t('pages.prep.homework', 'Homework')}
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Content textarea */}
                <FormField
                    control={control}
                    name={`phases.${index}.content`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder={t(
                                        'pages.prep.phaseContentPlaceholder',
                                        'Describe the activities and content for this phase...'
                                    )}
                                    className="min-h-[100px] resize-y bg-background"
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

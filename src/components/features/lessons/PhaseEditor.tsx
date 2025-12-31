import { type Control, useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Clock, Layers, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useEffect } from 'react'

interface PhaseEditorProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
    totalDuration: number
}

const PHASE_TYPES = [
    { type: 'departure', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
    { type: 'presentation', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
    { type: 'consolidation', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
] as const

export function PhaseEditor({
    control,
    language,
    totalDuration
}: PhaseEditorProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const { fields, replace } = useFieldArray({
        control,
        name: 'phases',
    })

    const phases = useWatch({
        control,
        name: 'phases',
    })

    // Auto-initialize phases if empty
    useEffect(() => {
        if (fields.length === 0) {
            replace([
                { type: 'departure', content: '', duration_minutes: 5 },
                { type: 'presentation', content: '', duration_minutes: 30 },
                { type: 'consolidation', content: '', duration_minutes: 10 },
            ])
        }
    }, [fields.length, replace])

    const currentTotalDuration = phases?.reduce((acc, curr) => acc + (Number(curr.duration_minutes) || 0), 0) || 0
    const isDurationMismatch = currentTotalDuration !== totalDuration

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Layers className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">
                            {t('pages.prep.params.phases', 'Lesson Phases')}
                        </CardTitle>
                    </div>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
                        isDurationMismatch
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                    )}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{currentTotalDuration} / {totalDuration} {t('common.minutes', 'min')}</span>
                        {isDurationMismatch && (
                            <AlertCircle className="w-3.5 h-3.5 ml-1" />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {fields.map((field, index) => {
                    const phaseConfig = PHASE_TYPES.find(p => p.type === field.type) || PHASE_TYPES[0]

                    return (
                        <div key={field.id} className="grid gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between border-b pb-2 mb-2">
                                <Badge variant="outline" className={cn("uppercase tracking-wider font-bold", phaseConfig.color)}>
                                    {t(`pages.prep.phases.${field.type}`, field.type)}
                                </Badge>

                                <FormField
                                    control={control}
                                    name={`phases.${index}.duration_minutes`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 space-y-0">
                                            <FormControl>
                                                <div className="relative w-24">
                                                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min={1}
                                                        className="pl-9 h-9 text-right font-mono"
                                                        onChange={e => field.onChange(Number(e.target.value))}
                                                    />
                                                </div>
                                            </FormControl>
                                            <span className="text-xs text-muted-foreground">{t('common.minutes', 'min')}</span>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name={`phases.${index}.content`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder={t('pages.prep.phaseContentPlaceholder', 'Describe the activities and content for this phase...')}
                                                className="min-h-[100px] resize-y bg-background"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )
                })}
                <FormField
                    control={control}
                    name="phases"
                    render={() => (
                        <FormItem>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}

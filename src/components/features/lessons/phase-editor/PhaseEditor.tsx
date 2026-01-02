import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Clock, Layers, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { usePhaseEditor } from './use-phase-editor'
import { PhaseCard } from './PhaseCard'
import { ConsolidationPhaseCard } from './ConsolidationPhaseCard'

export interface PhaseEditorProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
    totalDuration: number
}

/**
 * PhaseEditor - Orchestrates phase cards
 * Uses Composition: Delegates to specialized components
 * Uses Hook: All logic extracted to usePhaseEditor
 */
export function PhaseEditor({
    control,
    isLoading,
    language,
    totalDuration,
}: PhaseEditorProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const { fields, currentTotalDuration, isDurationMismatch } = usePhaseEditor({
        control,
        totalDuration,
    })

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

                    {/* Duration indicator */}
                    <div
                        className={cn(
                            'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                            isDurationMismatch
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                        )}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                            {currentTotalDuration} / {totalDuration} {t('common.minutes', 'min')}
                        </span>
                        {isDurationMismatch && <AlertCircle className="w-3.5 h-3.5 ml-1" />}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                {fields.map((field, index) => {
                    // Render special card for consolidation phase
                    if (field.type === 'consolidation') {
                        return (
                            <ConsolidationPhaseCard
                                key={field.id}
                                control={control}
                                index={index}
                                isLoading={isLoading}
                                language={language}
                            />
                        )
                    }

                    // Render generic phase card for other phases
                    return (
                        <PhaseCard
                            key={field.id}
                            control={control}
                            index={index}
                            phaseType={field.type}
                            isLoading={isLoading}
                            language={language}
                        />
                    )
                })}

                {/* Form-level phase errors */}
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

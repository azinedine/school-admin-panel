import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { type PhaseType, getPhaseConfig } from './phase-config'
import { DurationInput } from './DurationInput'

interface PhaseCardProps {
    control: Control<LessonPreparationFormData>
    index: number
    phaseType: PhaseType
    isLoading?: boolean
    language?: string
}

/**
 * Reusable phase card component
 * Single Responsibility: Renders a single phase with its content and duration
 */
export function PhaseCard({
    control,
    index,
    phaseType,
    isLoading,
    language,
}: PhaseCardProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const phaseConfig = getPhaseConfig(phaseType)

    return (
        <div className="grid gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card hover:shadow-sm transition-all">
            {/* Header with badge and duration */}
            <div className="flex items-center justify-between border-b pb-2 mb-2">
                <Badge
                    variant="outline"
                    className={cn('uppercase tracking-wider font-bold', phaseConfig.color)}
                >
                    {t(`pages.prep.phases.${phaseType}`, phaseType)}
                </Badge>

                <DurationInput
                    control={control}
                    name={`phases.${index}.duration_minutes`}
                    disabled={isLoading}
                    label={t('common.minutes', 'min')}
                />
            </div>

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
    )
}

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CheckCircle, Clock, Flag, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LessonPhasesTimelineProps {
    lesson: LessonPreparation
}

export function LessonPhasesTimeline({ lesson }: LessonPhasesTimelineProps) {
    const { t } = useTranslation()

    const phases = lesson.phases || []

    const getPhaseConfig = (type: string) => {
        switch (type) {
            case 'departure':
                return {
                    icon: Flag,
                    color: 'text-green-600',
                    bg: 'bg-green-50 dark:bg-green-950/30',
                    border: 'border-green-200 dark:border-green-800',
                    label: t('pages.prep.phases.departure', 'Departure Situation'),
                }
            case 'consolidation':
                return {
                    icon: CheckCircle,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50 dark:bg-purple-950/30',
                    border: 'border-purple-200 dark:border-purple-800',
                    label: t('pages.prep.phases.consolidation', 'Consolidation'),
                }
            default:
                return {
                    icon: PlayCircle,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50 dark:bg-blue-950/30',
                    border: 'border-blue-200 dark:border-blue-800',
                    label: t('pages.prep.phases.presentation', 'Presentation'),
                }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('pages.prep.phases', 'Lesson Phases')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {phases.length > 0 ? (
                    <div className="relative space-y-4">
                        {/* Timeline connector */}
                        <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-border hidden md:block" />

                        {phases.map((phase, index) => {
                            const config = getPhaseConfig(phase.type)
                            const PhaseIcon = config.icon

                            return (
                                <div
                                    key={index}
                                    className={`relative p-4 rounded-lg border ${config.bg} ${config.border}`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-full bg-background ${config.color} relative z-10`}
                                            >
                                                <PhaseIcon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{config.label}</h4>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="font-mono shrink-0">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {phase.duration_minutes} {t('common.min', 'min')}
                                        </Badge>
                                    </div>
                                    {phase.content && (
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-11">
                                            {phase.content}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>{t('common.noData', 'No phases defined')}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

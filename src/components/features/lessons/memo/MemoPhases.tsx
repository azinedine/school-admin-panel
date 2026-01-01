import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CheckCircle, Clock, Flag, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MemoPhasesProps {
    lesson: LessonPreparation
    language: string
}

export function MemoPhases({ lesson }: MemoPhasesProps) {
    const { t } = useTranslation()

    const phases = lesson.phases || []

    const getPhaseConfig = (type: string) => {
        switch (type) {
            case 'departure':
                return { icon: Flag, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' }
            case 'consolidation':
                return { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' }
            default:
                return { icon: PlayCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' }
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
                    <div className="space-y-4">
                        {phases.map((phase, index) => {
                            const config = getPhaseConfig(phase.type)
                            const PhaseIcon = config.icon

                            return (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${config.bg}`}
                                >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full bg-background ${config.color}`}>
                                                <PhaseIcon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold capitalize">{phase.type}</h4>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="font-mono">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {phase.duration_minutes} min
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

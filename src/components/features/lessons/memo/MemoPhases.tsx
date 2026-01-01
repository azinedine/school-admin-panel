import { Badge } from '@/components/ui/badge'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CheckCircle, Clock, Flag, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoSection } from './MemoSection'

interface MemoPhasesProps {
    lesson: LessonPreparation
    language: string
}

export function MemoPhases({ lesson, language }: MemoPhasesProps) {
    const { t } = useTranslation()

    // Helper for fixed translations
    const tFixed = (key: string, defaultValue: string) => {
        return t(key, defaultValue) as string
    }

    const phases = lesson.phases || []

    // Sort phases by type logically if needed, but usually arrival order is best. 
    // Assuming API returns them in order.

    return (
        <MemoSection
            title={tFixed('pages.prep.phases', 'Lesson Phases / Timeline')}
            icon={Clock}
            className="break-inside-avoid"
        >
            {phases.length > 0 ? (
                <div className="relative border-l-2 border-primary/20 ml-3 space-y-8 py-2">
                    {phases.map((phase, index) => {
                        // Determine Icon and Color based on type
                        let PhaseIcon = PlayCircle
                        let colorClass = "bg-blue-100 text-blue-700 border-blue-200"

                        if (phase.type === 'departure') {
                            PhaseIcon = Flag
                            colorClass = "bg-green-100 text-green-700 border-green-200"
                        } else if (phase.type === 'consolidation') {
                            PhaseIcon = CheckCircle
                            colorClass = "bg-orange-100 text-orange-700 border-orange-200"
                        }

                        return (
                            <div key={index} className="relative pl-8">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-background ${colorClass.split(' ')[0]} z-10`} />

                                <div className="flex flex-col gap-3">
                                    <div className="flex-1 bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                                        {/* Phase Header */}
                                        <div className="bg-muted/30 px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2">
                                            <h4 className="font-semibold text-foreground text-sm md:text-base capitalize flex items-center gap-2">
                                                <Badge variant="outline" className={`uppercase text-[10px] tracking-wider ${colorClass}`}>
                                                    {phase.type}
                                                </Badge>
                                            </h4>
                                            <Badge variant="secondary" className="font-mono text-xs flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {phase.duration_minutes} {tFixed('common.minutes', 'min')}
                                            </Badge>
                                        </div>

                                        {/* Phase Body */}
                                        <div className="p-4 space-y-2">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                                {tFixed('pages.prep.content', 'Content / Activities')}
                                            </span>
                                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                                {phase.content || <span className="text-muted-foreground/40 italic">-</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 opacity-20 mb-3" />
                    <p>{tFixed('common.noData', 'No phases defined for this lesson')}</p>
                </div>
            )}
        </MemoSection>
    )
}

// Replaced by Lucide import

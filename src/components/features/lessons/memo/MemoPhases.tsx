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
                <div className="relative space-y-0 py-2">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200" />

                    {phases.map((phase, index) => {
                        // Determine Icon and Color based on type
                        let PhaseIcon = PlayCircle
                        let markerClass = "bg-blue-600 border-blue-100"
                        let titleClass = "text-blue-700"
                        let bgClass = "bg-blue-50/50"

                        if (phase.type === 'departure') {
                            PhaseIcon = Flag
                            markerClass = "bg-emerald-500 border-emerald-100"
                            titleClass = "text-emerald-700"
                            bgClass = "bg-emerald-50/50"
                        } else if (phase.type === 'consolidation') {
                            PhaseIcon = CheckCircle
                            markerClass = "bg-indigo-500 border-indigo-100"
                            titleClass = "text-indigo-700"
                            bgClass = "bg-indigo-50/50"
                        }

                        return (
                            <div key={index} className="relative pl-14 pb-8 last:pb-0 group">
                                {/* Create/Time Marker */}
                                <div className={`absolute left-0 top-0 h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${markerClass} text-white`}>
                                    <PhaseIcon className="h-5 w-5" />
                                </div>

                                <div className={`flex flex-col gap-3 rounded-xl border border-slate-200 p-5 transition-all hover:shadow-md ${bgClass} break-inside-avoid`}>
                                    {/* Phase Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3 mb-2">
                                        <h4 className={`font-bold text-sm md:text-base uppercase tracking-wider ${titleClass}`}>
                                            {phase.type}
                                        </h4>
                                        <Badge variant="outline" className="bg-white/80 font-mono text-xs flex items-center gap-1.5 px-2 py-0.5 border-slate-200 text-slate-600 shadow-sm">
                                            <Clock className="h-3.5 w-3.5" />
                                            {phase.duration_minutes} {tFixed('common.minutes', 'min')}
                                        </Badge>
                                    </div>

                                    {/* Phase Body */}
                                    <div className="space-y-2">
                                        <p className="text-sm md:text-base text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                                            {phase.content || <span className="text-muted-foreground/40 italic">-</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Clock className="h-10 w-10 opacity-20 mb-3" />
                    <p>{tFixed('common.noData', 'No phases defined for this lesson')}</p>
                </div>
            )}
        </MemoSection>
    )
}

// Replaced by Lucide import

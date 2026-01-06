import { Badge } from '@/components/ui/badge'
import { CalendarDays, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { getPrepStatusConfig, formatPrepDate } from './prep-details-config.ts'

interface PrepDetailsHeaderProps {
    data: LessonPreparation
}

/**
 * Single Responsibility: Header section with title, status, and quick stats
 */
export function PrepDetailsHeader({ data }: PrepDetailsHeaderProps) {
    const status = getPrepStatusConfig(data.status)

    return (
        <div className="mb-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge
                            variant="outline"
                            className={cn('capitalize px-2.5 py-0.5', status.className)}
                        >
                            {status.label}
                        </Badge>
                        <Badge variant="secondary" className="font-mono text-xs">
                            #{data.lesson_number}
                        </Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground/90 leading-tight">
                        {data.knowledge_resource}
                    </h1>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground hidden sm:flex">
                    <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatPrepDate(data.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border">
                        <Timer className="h-4 w-4" />
                        <span>{data.duration_minutes} min</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

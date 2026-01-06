import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { StatusConfig } from './lesson-card-config.ts'

interface LessonStatusBadgeProps {
    statusConfig: StatusConfig
}

/**
 * Single Responsibility: Only renders status badge
 */
export function LessonStatusBadge({ statusConfig }: LessonStatusBadgeProps) {
    return (
        <Badge className={cn('font-medium', statusConfig.className)}>
            {statusConfig.label}
        </Badge>
    )
}

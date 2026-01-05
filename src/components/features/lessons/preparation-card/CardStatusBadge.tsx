import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { statusConfig } from './statusConfig'

interface CardStatusBadgeProps {
    status: 'draft' | 'ready' | 'delivered'
}

export function CardStatusBadge({ status }: CardStatusBadgeProps) {
    const config = statusConfig[status]
    const StatusIcon = config.icon

    return (
        <Badge
            variant="outline"
            className={cn('px-2 py-0.5 h-5 flex gap-1 items-center border', config.className)}
        >
            <StatusIcon className="w-3 h-3" />
            {config.label}
        </Badge>
    )
}

import { Badge } from '@/components/ui/badge'

interface CardCountBadgesProps {
    objectivesCount: number
    methodsCount: number
}

export function CardCountBadges({
    objectivesCount,
    methodsCount,
}: CardCountBadgesProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-3">
            <Badge
                variant="secondary"
                className="px-1.5 py-0 h-5 text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-900/30"
            >
                {objectivesCount} Objectives
            </Badge>
            <Badge
                variant="secondary"
                className="px-1.5 py-0 h-5 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30"
            >
                {methodsCount} Methods
            </Badge>
        </div>
    )
}

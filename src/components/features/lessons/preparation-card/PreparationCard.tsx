import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CardStatusBadge } from './CardStatusBadge'
import { CardDropdownMenu } from './CardDropdownMenu'
import { CardMetaGrid } from './CardMetaGrid'
import { CardCountBadges } from './CardCountBadges'
import { CardFooter } from './CardFooter'

interface PreparationCardProps {
    prep: LessonPreparation
    onView: (prep: LessonPreparation) => void
    onViewMemo?: (prep: LessonPreparation) => void
    onEdit?: (prep: LessonPreparation) => void
    onDelete?: (prep: LessonPreparation) => void
    onStatusChange?: (
        prep: LessonPreparation,
        status: 'draft' | 'ready' | 'delivered'
    ) => void
    readOnly?: boolean
}

export function PreparationCard({
    prep,
    onView,
    onViewMemo,
    onEdit,
    onDelete,
    onStatusChange,
}: PreparationCardProps) {
    return (
        <Card
            className="group relative flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer overflow-hidden border-border/60 bg-card"
            onClick={() => onView(prep)}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/80 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="p-4 pb-2 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Badge
                                variant="outline"
                                className="font-mono bg-background/50 px-1.5 h-5"
                            >
                                #{prep.lesson_number}
                            </Badge>
                            <CardStatusBadge status={prep.status} />
                        </div>
                        <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {prep.knowledge_resource}
                        </h3>
                    </div>
                    <CardDropdownMenu
                        prep={prep}
                        onView={onView}
                        onViewMemo={onViewMemo}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                    />
                </div>

                <CardMetaGrid domain={prep.domain} learningUnit={prep.learning_unit} />
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-1">
                <CardCountBadges
                    objectivesCount={prep.learning_objectives?.length || 0}
                    methodsCount={prep.teaching_methods?.length || 0}
                />
            </CardContent>

            <CardFooter
                level={prep.level}
                durationMinutes={prep.duration_minutes}
                date={prep.date}
            />
        </Card>
    )
}

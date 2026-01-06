import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Layers } from 'lucide-react'
import type { LessonPreparation } from '@/schemas/lesson-preparation'

interface PedagogicalGridProps {
    data: LessonPreparation
}

/**
 * Single Responsibility: Domain and Learning Unit display cards
 */
export function PedagogicalGrid({ data }: PedagogicalGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/10 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full shadow-sm">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Domain
                        </p>
                        <p className="font-medium text-foreground">{data.domain}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full shadow-sm">
                        <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Learning Unit
                        </p>
                        <p className="font-medium text-foreground">{data.learning_unit}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

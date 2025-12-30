import { useTranslation } from 'react-i18next'
import { BookOpen, Calendar as CalendarIcon, Clock, ChevronRight, Pencil, Trash2, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import type { LessonPreparation } from '@/schemas/lesson-preparation'

interface PreparationCardProps {
    prep: LessonPreparation
    onView?: (prep: LessonPreparation) => void
    onEdit?: (prep: LessonPreparation) => void
    onDelete?: (prep: LessonPreparation) => void
    readOnly?: boolean
}

export function PreparationCard({
    prep,
    onView,
    onEdit,
    onDelete,
    readOnly = false,
}: PreparationCardProps) {
    const { t, i18n } = useTranslation()
    const locale = i18n.language === 'ar' ? ar : i18n.language === 'fr' ? fr : enUS

    const statusConfig = {
        draft: {
            label: t('pages.prep.status.draft', 'Draft'),
            className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        },
        ready: {
            label: t('pages.prep.status.ready', 'Ready'),
            className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        },
        delivered: {
            label: t('pages.prep.status.delivered', 'Delivered'),
            className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        },
    }

    const status = statusConfig[prep.status as keyof typeof statusConfig]
    const formattedDate = format(new Date(prep.date), 'MMM d, yyyy', { locale })

    return (
        <Card
            className="group cursor-pointer hover:shadow-md transition-all border-border/50 hover:border-primary/20"
            onClick={() => onView && onView(prep)}
        >
            <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={cn('capitalize font-medium px-2 py-0.5 border', status?.className)}>
                        {status?.label || prep.status}
                    </Badge>
                    {!readOnly && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEdit(prep)
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(prep)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                    {readOnly && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                        {prep.lesson_number}
                    </h3>
                    <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm text-muted-foreground">
                        {prep.level && (
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>{prep.level}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>{formattedDate}</span>
                        </div>

                        {prep.duration_minutes && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{prep.duration_minutes}m</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 flex items-center text-xs text-muted-foreground/80 border-t mt-2">
                    <span className="truncate">{prep.subject || 'All Subjects'}</span>
                    <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                </div>
            </CardContent>
        </Card>
    )
}

import { useTranslation } from 'react-i18next'
import { BookOpen, Calendar as CalendarIcon, Clock, Pencil, Trash2, Eye, Layers, Target, Lightbulb, Users } from 'lucide-react'
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
                <div className="space-y-4">
                    {/* Header Row: Status & Lesson Number */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn('capitalize font-medium px-2 py-0.5 border', status?.className)}>
                                {status?.label || prep.status}
                            </Badge>
                            <Badge variant="secondary" className="font-mono text-xs bg-muted/50 text-muted-foreground">
                                #{prep.lesson_number}
                            </Badge>
                        </div>

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

                    {/* Main Content */}
                    <div>
                        <h3 className="font-bold text-lg leading-tight mb-3 group-hover:text-primary transition-colors text-foreground/90">
                            {prep.knowledge_resource}
                        </h3>

                        {/* Pedagogical Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground/70 tracking-wider flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    Domain
                                </span>
                                <p className="text-xs font-medium text-foreground/80 line-clamp-2 leading-relaxed">
                                    {prep.domain}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground/70 tracking-wider flex items-center gap-1">
                                    <Layers className="h-3 w-3" />
                                    Unit
                                </span>
                                <p className="text-xs font-medium text-foreground/80 line-clamp-2 leading-relaxed">
                                    {prep.learning_unit}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-muted-foreground/70 pt-2 border-t border-dashed">
                            {prep.level && (
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-foreground/70">{prep.level}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{formattedDate}</span>
                            </div>

                            {prep.duration_minutes && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    <span>{prep.duration_minutes}m</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground/80 border-t mt-2">
                    <span className="truncate font-medium">{prep.subject || 'All Subjects'}</span>

                    {/* Item Counts */}
                    <div className="flex gap-2">
                        {(prep.learning_objectives?.length ?? 0) > 0 && (
                            <span title="Objectives" className="flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                <Target className="h-3 w-3" />
                                {prep.learning_objectives?.length}
                            </span>
                        )}
                        {(prep.key_topics?.length ?? 0) > 0 && (
                            <span title="Topics" className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                                <Lightbulb className="h-3 w-3" />
                                {prep.key_topics?.length}
                            </span>
                        )}
                        {(prep.teaching_methods?.length ?? 0) > 0 && (
                            <span title="Methods" className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                                <Users className="h-3 w-3" />
                                {prep.teaching_methods?.length}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

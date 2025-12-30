import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import {
    CalendarDays,
    BookOpen,
    GraduationCap,
    Clock,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/schemas/lesson'

interface LessonCardProps {
    lesson: Lesson
    onView?: (lesson: Lesson) => void
    onEdit?: (lesson: Lesson) => void
    onDelete?: (lesson: Lesson) => void
    /** Hide action buttons */
    hideActions?: boolean
    /** Compact card variant */
    compact?: boolean
}

/**
 * Information-rich Lesson Card Component
 * Displays lesson details with actions
 */
export function LessonCard({
    lesson,
    onView,
    onEdit,
    onDelete,
    hideActions = false,
    compact = false,
}: LessonCardProps) {
    const { t, i18n } = useTranslation()

    const locale = i18n.language === 'ar' ? ar : i18n.language === 'fr' ? fr : enUS

    const formattedDate = format(new Date(lesson.lesson_date), 'PPP', { locale })

    const statusConfig = {
        draft: {
            label: t('lessons.status.draft', 'Draft'),
            variant: 'secondary' as const,
            className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        },
        published: {
            label: t('lessons.status.published', 'Published'),
            variant: 'default' as const,
            className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
    }

    const status = statusConfig[lesson.status]

    return (
        <Card
            className={cn(
                'group transition-all hover:shadow-md',
                compact ? 'p-3' : ''
            )}
        >
            <CardHeader className={cn('pb-3', compact ? 'p-0 pb-2' : '')}>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate" title={lesson.title}>
                            {lesson.title}
                        </h3>
                        {lesson.teacher_name && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {lesson.teacher_name}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Badge className={cn('font-medium', status.className)}>
                            {status.label}
                        </Badge>

                        {!hideActions && (onView || onEdit || onDelete) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {onView && (
                                        <DropdownMenuItem onClick={() => onView(lesson)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            {t('common.view', 'View')}
                                        </DropdownMenuItem>
                                    )}
                                    {onEdit && (
                                        <DropdownMenuItem onClick={() => onEdit(lesson)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            {t('common.edit', 'Edit')}
                                        </DropdownMenuItem>
                                    )}
                                    {onDelete && (
                                        <DropdownMenuItem
                                            onClick={() => onDelete(lesson)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {t('common.delete', 'Delete')}
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className={cn(compact ? 'p-0' : 'pb-4')}>
                {/* Meta Information */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4 shrink-0" />
                        <span className="truncate">{lesson.class_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4 shrink-0" />
                        <span className="truncate">{lesson.subject_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span className="truncate">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="truncate">{lesson.academic_year}</span>
                    </div>
                </div>

                {/* Content Preview */}
                {!compact && lesson.content && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {lesson.content}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

/**
 * Grid of Lesson Cards
 */
export function LessonCardGrid({
    lessons,
    onView,
    onEdit,
    onDelete,
    hideActions,
}: {
    lessons: Lesson[]
    onView?: (lesson: Lesson) => void
    onEdit?: (lesson: Lesson) => void
    onDelete?: (lesson: Lesson) => void
    hideActions?: boolean
}) {
    if (lessons.length === 0) {
        return null
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
                <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    hideActions={hideActions}
                />
            ))}
        </div>
    )
}

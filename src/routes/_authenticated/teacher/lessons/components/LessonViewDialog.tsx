import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'
import {
    CalendarDays,
    BookOpen,
    GraduationCap,
    Clock,
    User,
    Building2,
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/schemas/lesson'

interface LessonViewDialogProps {
    lesson: Lesson | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/**
 * Read-only view dialog for lessons
 * Used on preparation page - all fields are view-only
 */
export function LessonViewDialog({
    lesson,
    open,
    onOpenChange,
}: LessonViewDialogProps) {
    const { t, i18n } = useTranslation()

    if (!lesson) return null

    const locale = i18n.language === 'ar' ? ar : i18n.language === 'fr' ? fr : enUS
    const formattedDate = format(new Date(lesson.lesson_date), 'PPPP', { locale })
    const createdAt = format(new Date(lesson.created_at), 'PPp', { locale })
    const updatedAt = format(new Date(lesson.updated_at), 'PPp', { locale })

    const statusConfig = {
        draft: {
            label: t('lessons.status.draft', 'Draft'),
            className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        },
        published: {
            label: t('lessons.status.published', 'Published'),
            className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
    }

    const status = statusConfig[lesson.status]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader className="pb-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-xl">{lesson.title}</DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className={cn('font-medium', status.className)}>
                                    {status.label}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {lesson.academic_year}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {/* Meta Information Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem
                                icon={<GraduationCap className="h-4 w-4" />}
                                label={t('lessons.form.class', 'Class')}
                                value={lesson.class_name}
                            />

                            <InfoItem
                                icon={<BookOpen className="h-4 w-4" />}
                                label={t('lessons.form.subject', 'Subject')}
                                value={lesson.subject_name}
                            />

                            <InfoItem
                                icon={<CalendarDays className="h-4 w-4" />}
                                label={t('lessons.form.date', 'Lesson Date')}
                                value={formattedDate}
                            />

                            <InfoItem
                                icon={<Clock className="h-4 w-4" />}
                                label={t('lessons.form.academicYear', 'Academic Year')}
                                value={lesson.academic_year}
                            />

                            {lesson.teacher_name && (
                                <InfoItem
                                    icon={<User className="h-4 w-4" />}
                                    label={t('lessons.teacher', 'Teacher')}
                                    value={lesson.teacher_name}
                                />
                            )}

                            {lesson.institution_name && (
                                <InfoItem
                                    icon={<Building2 className="h-4 w-4" />}
                                    label={t('lessons.institution', 'Institution')}
                                    value={lesson.institution_name}
                                />
                            )}
                        </div>

                        {/* Content Section */}
                        {lesson.content && (
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                    {t('lessons.form.content', 'Lesson Content')}
                                </h4>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{lesson.content}</p>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="pt-4 border-t text-xs text-muted-foreground">
                            <div className="flex justify-between">
                                <span>
                                    {t('common.createdAt', 'Created')}: {createdAt}
                                </span>
                                <span>
                                    {t('common.updatedAt', 'Updated')}: {updatedAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.close', 'Close')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-md shrink-0">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    )
}

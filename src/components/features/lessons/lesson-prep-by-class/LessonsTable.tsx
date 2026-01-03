import { Trash2, Edit2, Plus } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import type { DailyPlanEntry } from '@/store/prep-store'
import type { TFunction } from 'i18next'

interface LessonsTableProps {
    t: TFunction
    lessons: DailyPlanEntry[]
    formatDate: (date?: string) => string
    onView: (lesson: DailyPlanEntry) => void
    onEdit: (lesson: DailyPlanEntry) => void
    onDelete: (id: string) => void
    onStatusChange: (lesson: DailyPlanEntry, status: string) => void
    onAdd: () => void
}

/**
 * Single Responsibility: Table display of lessons with actions
 */
export function LessonsTable({
    t,
    lessons,
    formatDate,
    onView,
    onEdit,
    onDelete,
    onStatusChange,
    onAdd,
}: LessonsTableProps) {
    const getStatusClassName = (status?: DailyPlanEntry['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800'
            case 'postponed':
                return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
            case 'custom':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800'
            default:
                return ''
        }
    }

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">{t('pages.prep.table.date')}</TableHead>
                            <TableHead className="w-[150px]">{t('pages.prep.table.schedule')}</TableHead>
                            <TableHead>{t('pages.prep.table.lessonTopic')}</TableHead>
                            <TableHead className="w-[140px]">{t('pages.prep.status.label')}</TableHead>
                            <TableHead className="w-[100px] text-center">{t('common.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lessons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <p>{t('pages.prep.table.noLessons')}</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            lessons.map((lesson) => (
                                <TableRow key={lesson.id}>
                                    <TableCell className="font-medium">{formatDate(lesson.date)}</TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex flex-col gap-1.5 align-top">
                                            {lesson.mode === 'groups' ? (
                                                <>
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit h-5 text-[10px] px-1.5 bg-purple-50 text-purple-700 border-purple-200"
                                                    >
                                                        {t('pages.prep.details.groups')}
                                                    </Badge>
                                                    <div className="space-y-0.5 text-xs font-mono text-muted-foreground">
                                                        <div>
                                                            <span className="font-semibold text-foreground">G1:</span>{' '}
                                                            {lesson.timeSlot}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-foreground">G2:</span>{' '}
                                                            {lesson.secondaryTimeSlot || '-'}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit h-5 text-[10px] px-1.5 bg-blue-50 text-blue-700 border-blue-200"
                                                    >
                                                        {t('pages.prep.details.fullClass')}
                                                    </Badge>
                                                    <div className="text-xs font-mono text-muted-foreground">
                                                        {lesson.timeSlot}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            {/* Lesson Number & Knowledge Resource - same line */}
                                            <p
                                                className="cursor-pointer hover:underline"
                                                onClick={() => onView(lesson)}
                                            >
                                                <span className="font-semibold text-primary">{lesson.lessonNumber}</span>
                                                {lesson.knowledgeResource && (
                                                    <span className="text-foreground/80"> - {lesson.knowledgeResource}</span>
                                                )}
                                            </p>

                                            {/* Field & Learning Segment */}
                                            {(lesson.field || lesson.learningSegment) && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {lesson.field && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                            {lesson.field}
                                                        </Badge>
                                                    )}
                                                    {lesson.learningSegment && (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                            {lesson.learningSegment}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Lesson Content Preview */}
                                            {lesson.lessonContent && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {lesson.lessonContent}
                                                </p>
                                            )}

                                            {/* Status Note */}
                                            {lesson.statusNote && (
                                                <p className="text-xs text-muted-foreground italic border-l-2 border-amber-400 pl-2">
                                                    {lesson.statusNote}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={lesson.status || 'none'}
                                            onValueChange={(value) => onStatusChange(lesson, value)}
                                        >
                                            <SelectTrigger className={`h-8 w-full ${getStatusClassName(lesson.status)}`}>
                                                <SelectValue placeholder={t('pages.prep.status.none')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">{t('pages.prep.status.none')}</SelectItem>
                                                <SelectItem value="completed">{t('pages.prep.status.completed')}</SelectItem>
                                                <SelectItem value="postponed">{t('pages.prep.status.postponed')}</SelectItem>
                                                <SelectItem value="cancelled">{t('pages.prep.status.cancelled')}</SelectItem>
                                                <SelectItem value="custom">{t('pages.prep.status.custom')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {lesson.statusNote && (
                                            <p
                                                className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]"
                                                title={lesson.statusNote}
                                            >
                                                {lesson.statusNote}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(lesson)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(lesson.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-4 border-t flex justify-center">
                <Button onClick={onAdd} variant="outline" size="sm">
                    <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('pages.prep.addLesson')}
                </Button>
            </div>
        </Card>
    )
}

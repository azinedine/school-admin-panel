import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { CalculatedStudentGrade } from '../types'
import {
    ObservationType,
    type StudentWeeklyReviewSummary,
    getCurrentISOWeek,
} from '@/features/weekly-reviews'

interface WeeklyReviewPanelProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: CalculatedStudentGrade | null
    summary: StudentWeeklyReviewSummary | null
    onSaveReview: (data: {
        studentId: string
        notebookChecked: boolean
        lessonWritten: boolean
        homeworkDone: boolean
        score: number | null
        observationType: ObservationType
        observationNotes: string | null
    }) => Promise<void>
    onResolveAlert?: (reviewId: number) => Promise<void>
    isLoading?: boolean
    isRTL?: boolean
}

export function WeeklyReviewPanel({
    open,
    onOpenChange,
    student,
    summary,
    onSaveReview,
    onResolveAlert,
    isLoading = false,
    isRTL = false,
}: WeeklyReviewPanelProps) {
    const { t } = useTranslation()
    const { year, week } = getCurrentISOWeek()

    // Form state
    const [notebookChecked, setNotebookChecked] = useState(false)
    const [lessonWritten, setLessonWritten] = useState(true)
    const [homeworkDone, setHomeworkDone] = useState(true)
    const [score, setScore] = useState<string>('')
    const [observationType, setObservationType] = useState<ObservationType>(ObservationType.OK)
    const [observationNotes, setObservationNotes] = useState('')

    // Reset form when student changes or panel opens with existing data
    useEffect(() => {
        if (open && student) {
            if (summary?.this_week_review) {
                // Load existing review data
                const review = summary.this_week_review
                setNotebookChecked(review.notebook_checked)
                setLessonWritten(review.lesson_written)
                setHomeworkDone(review.homework_done)
                setScore(review.score?.toString() ?? '')
                setObservationType(review.observation_type)
                setObservationNotes(review.observation_notes ?? '')
            } else {
                // Reset to defaults for new review
                setNotebookChecked(false)
                setLessonWritten(true)
                setHomeworkDone(true)
                setScore('')
                setObservationType(ObservationType.OK)
                setObservationNotes('')
            }
        }
    }, [open, student, summary])

    // Auto-detect observation type based on checkboxes
    useEffect(() => {
        const issues: ObservationType[] = []

        if (!lessonWritten) issues.push(ObservationType.LESSON_NOT_WRITTEN)
        if (!homeworkDone) issues.push(ObservationType.HOMEWORK_MISSING)

        if (issues.length === 0) {
            setObservationType(ObservationType.OK)
        } else if (issues.length === 1) {
            setObservationType(issues[0])
        } else {
            setObservationType(ObservationType.MULTIPLE_ISSUES)
        }
    }, [lessonWritten, homeworkDone])

    const handleSave = useCallback(async () => {
        if (!student) return

        await onSaveReview({
            studentId: student.id,
            notebookChecked,
            lessonWritten,
            homeworkDone,
            score: score ? parseFloat(score) : null,
            observationType,
            observationNotes: observationNotes.trim() || null,
        })

        onOpenChange(false)
    }, [student, notebookChecked, lessonWritten, homeworkDone, score, observationType, observationNotes, onSaveReview, onOpenChange])

    const handleResolveAlert = useCallback(async () => {
        if (summary?.last_review?.id && onResolveAlert) {
            await onResolveAlert(summary.last_review.id)
        }
    }, [summary, onResolveAlert])

    if (!student) return null

    const hasPendingAlert = summary?.has_pending_alert
    const isEditing = !!summary?.this_week_review

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-full sm:max-w-md overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        {t('pages.grades.weeklyReview.title')}
                        {hasPendingAlert && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {student.firstName} {student.lastName} - {t('pages.grades.weeklyReview.week', { week, year })}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Pending Alert Banner */}
                    {hasPendingAlert && summary?.last_review && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                        {t('pages.grades.weeklyReview.indicators.pendingAlert')}
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-300">
                                        {t('pages.grades.weeklyReview.indicators.issueFrom', { week: summary.last_review.week })}:{' '}
                                        {t(`pages.grades.weeklyReview.observations.${summary.last_review.observation_type}`)}
                                    </p>
                                    {onResolveAlert && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleResolveAlert}
                                            className="mt-2"
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {t('pages.grades.weeklyReview.actions.markResolved')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Checkboxes */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                                id="notebookChecked"
                                checked={notebookChecked}
                                onCheckedChange={(checked) => setNotebookChecked(!!checked)}
                            />
                            <Label htmlFor="notebookChecked" className="cursor-pointer">
                                {t('pages.grades.weeklyReview.notebookChecked')}
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                                id="lessonWritten"
                                checked={lessonWritten}
                                onCheckedChange={(checked) => setLessonWritten(!!checked)}
                            />
                            <Label htmlFor="lessonWritten" className="cursor-pointer">
                                {t('pages.grades.weeklyReview.lessonWritten')}
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Checkbox
                                id="homeworkDone"
                                checked={homeworkDone}
                                onCheckedChange={(checked) => setHomeworkDone(!!checked)}
                            />
                            <Label htmlFor="homeworkDone" className="cursor-pointer">
                                {t('pages.grades.weeklyReview.homeworkDone')}
                            </Label>
                        </div>
                    </div>

                    {/* Score (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="score">
                            {t('pages.grades.weeklyReview.score')} ({t('common.optional', { defaultValue: 'optional' })})
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="score"
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                placeholder="0"
                                className="w-20"
                            />
                            <span className="text-muted-foreground">/ 20</span>
                        </div>
                    </div>

                    {/* Observation Type */}
                    <div className="space-y-3">
                        <Label>{t('pages.grades.weeklyReview.observation')}</Label>
                        <RadioGroup
                            value={observationType}
                            onValueChange={(value) => setObservationType(value as ObservationType)}
                            className="space-y-2"
                        >
                            {Object.values(ObservationType).map((type) => (
                                <div key={type} className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <RadioGroupItem value={type} id={`obs-${type}`} />
                                    <Label
                                        htmlFor={`obs-${type}`}
                                        className={cn(
                                            'cursor-pointer text-sm',
                                            type !== 'OK' && 'text-amber-600 dark:text-amber-400'
                                        )}
                                    >
                                        {t(`pages.grades.weeklyReview.observations.${type}`)}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">{t('pages.grades.weeklyReview.notes')}</Label>
                        <Textarea
                            id="notes"
                            value={observationNotes}
                            onChange={(e) => setObservationNotes(e.target.value)}
                            placeholder={t('common.typeHere', { defaultValue: 'Type here...' })}
                            rows={3}
                        />
                    </div>
                </div>

                <SheetFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isEditing
                            ? t('common.update', { defaultValue: 'Update' })
                            : t('common.save')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

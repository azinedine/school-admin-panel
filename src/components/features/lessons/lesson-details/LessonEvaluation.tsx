import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CheckCircle2, ClipboardList, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LessonEvaluationProps {
    lesson: LessonPreparation
}

export function LessonEvaluation({ lesson }: LessonEvaluationProps) {
    const { t } = useTranslation()

    const hasAssessmentMethods =
        lesson.assessment_methods && lesson.assessment_methods.length > 0
    const hasEvaluationContent = lesson.evaluation_content && lesson.evaluation_content.trim()
    const isHomework = lesson.evaluation_type === 'homework'

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assessment & Evaluation */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('pages.prep.evaluation', 'Evaluation & Assessment')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Evaluation Type & Duration */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {t('pages.prep.evaluationType', 'Type')}
                        </span>
                        <Badge variant={isHomework ? 'secondary' : 'default'}>
                            {isHomework
                                ? t('pages.prep.homework', 'Homework')
                                : t('pages.prep.assessment', 'In-Class Assessment')}
                        </Badge>
                    </div>

                    {lesson.evaluation_duration && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('pages.prep.evaluationDuration', 'Duration')}
                            </span>
                            <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                    {lesson.evaluation_duration} {t('common.min', 'min')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Assessment Methods */}
                    {hasAssessmentMethods && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                {t('pages.prep.assessmentMethods', 'Methods')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {lesson.assessment_methods.map((method, i) => (
                                    <Badge key={i} variant="outline">
                                        {method}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assessment Content (when type is assessment) */}
                    {!isHomework && hasEvaluationContent && (
                        <div className="p-3 rounded-md bg-muted/50 border">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                {t('pages.prep.assessmentDetails', 'Assessment Details')}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{lesson.evaluation_content}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Homework Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        {t('pages.prep.homework', 'Homework')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isHomework && hasEvaluationContent ? (
                        <div className="p-3 rounded-md bg-muted/50 border">
                            <p className="text-sm whitespace-pre-wrap">{lesson.evaluation_content}</p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-md border border-dashed text-center">
                            <p className="text-sm text-muted-foreground italic">
                                {t('pages.prep.noHomework', 'No homework assigned')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

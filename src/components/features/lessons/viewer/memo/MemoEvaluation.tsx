import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CheckCircle2, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MemoEvaluationProps {
    lesson: LessonPreparation
    language: string
}

export function MemoEvaluation({ lesson }: MemoEvaluationProps) {
    const { t } = useTranslation()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Evaluation & Assessment */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('pages.prep.evaluation', 'Evaluation & Assessment')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Assessment Methods */}
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                            {t('pages.prep.assessmentMethods', 'Methods')}
                        </p>
                        {lesson.assessment_methods && lesson.assessment_methods.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {lesson.assessment_methods.map((method, i) => (
                                    <Badge key={i} variant="outline">
                                        {method}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                {t('common.none', 'None')}
                            </p>
                        )}
                    </div>

                    {/* Assessment Details */}
                    {lesson.evaluation_type === 'assessment' && lesson.evaluation_content && (
                        <div className="p-3 rounded-md bg-muted/50 border">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                {t('pages.prep.assessmentDetails', 'Details')}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{lesson.evaluation_content}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Homework */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        {t('pages.prep.homework', 'Homework')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {t('pages.prep.evaluationType', 'Type')}
                        </span>
                        <Badge variant={lesson.evaluation_type === 'homework' ? 'default' : 'secondary'}>
                            {lesson.evaluation_type === 'homework'
                                ? t('pages.prep.homework', 'Homework')
                                : t('pages.prep.assessment', 'In-Class')}
                        </Badge>
                    </div>

                    {lesson.evaluation_type === 'homework' && lesson.evaluation_content ? (
                        <div className="p-3 rounded-md bg-muted/50 border">
                            <p className="text-sm whitespace-pre-wrap">{lesson.evaluation_content}</p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-md border border-dashed text-center">
                            <p className="text-sm text-muted-foreground italic">
                                {t('common.noData', 'No homework assigned')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

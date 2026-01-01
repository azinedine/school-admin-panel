import { Badge } from '@/components/ui/badge'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { CheckCircle2, ClipboardList, PenTool } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoSection } from './MemoSection'

interface MemoEvaluationProps {
    lesson: LessonPreparation
    language: string
}

export function MemoEvaluation({ lesson, language }: MemoEvaluationProps) {
    const { t } = useTranslation()

    // Helper for fixed translations
    const tFixed = (key: string, defaultValue: string) => {
        return t(key, defaultValue) as string
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
            {/* Assessment Column */}
            <MemoSection
                title={tFixed('pages.prep.evaluation', 'Evaluation & Assessment')}
                icon={CheckCircle2}
                className="h-full flex flex-col"
            >
                <div className="space-y-5 flex-1">
                    {/* Assessment Methods */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {tFixed('pages.prep.assessmentMethods', 'Methods')}
                        </p>
                        {lesson.assessment_methods && lesson.assessment_methods.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {lesson.assessment_methods.map((method, i) => (
                                    <Badge key={i} variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                                        {method}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">{tFixed('common.none', 'None')}</p>
                        )}
                    </div>

                    {/* Criteria Text - Show if type is assessment */}
                    {lesson.evaluation_type === 'assessment' && lesson.evaluation_content && (
                        <div className="mt-4 bg-white p-3 rounded-md border border-purple-100 text-sm text-foreground/80 leading-relaxed shadow-sm">
                            <h5 className="text-xs font-bold text-purple-700 mb-1 mb-2 uppercase">
                                {tFixed('pages.prep.assessmentDetails', 'Assessment Details')}
                            </h5>
                            <p className="whitespace-pre-wrap">{lesson.evaluation_content}</p>
                        </div>
                    )}
                </div>
            </MemoSection>

            {/* Type & Homework Column */}
            <MemoSection
                title={tFixed('pages.prep.homework', 'Homework / Assignments')}
                icon={ClipboardList}
                variant="highlight"
                className="h-full flex flex-col"
            >
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PenTool className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{tFixed('pages.prep.evaluationType', 'Type')}:</span>
                        </div>
                        <Badge variant={lesson.evaluation_type === 'homework' ? 'default' : 'secondary'}>
                            {lesson.evaluation_type === 'homework'
                                ? tFixed('pages.prep.homework', 'Homework')
                                : tFixed('pages.prep.assessment', 'In-Class Assessment')}
                        </Badge>
                    </div>

                    {/* Homework Content Display */}
                    {lesson.evaluation_type === 'homework' && lesson.evaluation_content ? (
                        <div className="bg-white p-4 rounded-md border border-dashed border-purple-200 text-sm">
                            <p className="text-foreground/90 whitespace-pre-wrap">{lesson.evaluation_content}</p>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-4 border border-dashed border-muted rounded-md bg-muted/20">
                            <p className="text-sm text-muted-foreground italic">{tFixed('common.noData', 'No homework assigned')}</p>
                        </div>
                    )}
                </div>
            </MemoSection>
        </div>
    )
}

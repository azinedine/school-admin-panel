import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { BookOpen, Hash, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LessonContextObjectivesProps {
    lesson: LessonPreparation
}

export function LessonContextObjectives({ lesson }: LessonContextObjectivesProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            {/* Lesson Number */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="font-medium">
                    {t('pages.prep.lessonNumber', 'Lesson')}: {lesson.lesson_number || '—'}
                </span>
            </div>

            {/* Context + Objectives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pedagogical Context */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {t('pages.prep.context', 'Pedagogical Context')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lesson.notes ? (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {lesson.notes}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">—</p>
                        )}
                    </CardContent>
                </Card>

                {/* Learning Objectives */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {t('pages.prep.objectives', 'Learning Objectives')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lesson.learning_objectives && lesson.learning_objectives.length > 0 ? (
                            <ul className="space-y-2">
                                {lesson.learning_objectives.map((obj, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                        <span className="text-muted-foreground">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">—</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

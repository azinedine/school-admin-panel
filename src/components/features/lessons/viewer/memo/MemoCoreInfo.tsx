import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { GraduationCap, Hash, Layers, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MemoCoreInfoProps {
    lesson: LessonPreparation
}

export function MemoCoreInfo({ lesson }: MemoCoreInfoProps) {
    const { t } = useTranslation()

    const coreFields = [
        {
            label: t('pages.prep.domain', 'Domain'),
            value: lesson.domain,
            icon: Layers,
        },
        {
            label: t('pages.prep.learningUnit', 'Learning Unit'),
            value: lesson.learning_unit,
            icon: Library,
        },
        {
            label: t('pages.prep.knowledgeResource', 'Knowledge Resource'),
            value: lesson.knowledge_resource,
            icon: GraduationCap,
        },
    ]

    const hasTargetedKnowledge = lesson.targeted_knowledge && lesson.targeted_knowledge.length > 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreFields.map((field, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <field.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {field.label}
                                </p>
                                <p className="mt-1 font-medium truncate" title={field.value || undefined}>
                                    {field.value || <span className="text-muted-foreground">—</span>}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {hasTargetedKnowledge && (
                <Card className="md:col-span-3">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            {t('pages.prep.targetedKnowledge', 'Targeted Knowledge')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                            {lesson.targeted_knowledge?.map((topic, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

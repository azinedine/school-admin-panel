import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { Book, Hammer, MonitorPlay, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LessonResourcesProps {
    lesson: LessonPreparation
}

export function LessonResources({ lesson }: LessonResourcesProps) {
    const { t } = useTranslation()

    const hasMethods = lesson.teaching_methods && lesson.teaching_methods.length > 0
    const hasMaterials = lesson.used_materials && lesson.used_materials.length > 0
    const hasReferences = lesson.references && lesson.references.length > 0

    // Only render if at least one section has data
    if (!hasMethods && !hasMaterials && !hasReferences) {
        return null
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Teaching Methods */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t('pages.prep.methods', 'Teaching Methods')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {hasMethods ? (
                        <div className="flex flex-wrap gap-2">
                            {lesson.teaching_methods.map((method, i) => (
                                <Badge key={i} variant="secondary">
                                    {method}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">—</p>
                    )}
                </CardContent>
            </Card>

            {/* Used Materials */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Hammer className="h-4 w-4" />
                        {t('pages.prep.materials', 'Materials')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {hasMaterials ? (
                        <ul className="space-y-2">
                            {lesson.used_materials?.map((mat, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                    <MonitorPlay className="h-3.5 w-3.5 text-primary" />
                                    <span>{mat}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">—</p>
                    )}
                </CardContent>
            </Card>

            {/* References */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Book className="h-4 w-4" />
                        {t('pages.prep.references', 'References')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {hasReferences ? (
                        <ul className="space-y-2">
                            {lesson.references?.map((ref, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                                    <span className="italic">{ref}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">—</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

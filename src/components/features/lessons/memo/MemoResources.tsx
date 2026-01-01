import { Badge } from '@/components/ui/badge'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { Book, Hammer, MonitorPlay, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoSection } from './MemoSection'

interface MemoResourcesProps {
    lesson: LessonPreparation
    language: string
}

export function MemoResources({ lesson, language }: MemoResourcesProps) {
    const { t } = useTranslation()

    // Helper for fixed translations
    const tFixed = (key: string, defaultValue: string) => {
        return t(key, defaultValue) as string
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 break-inside-avoid">
            {/* Teaching Methods */}
            <MemoSection title={tFixed('pages.prep.methods', 'Teaching Methods')} icon={Users}>
                <div className="flex flex-wrap gap-2">
                    {lesson.teaching_methods && lesson.teaching_methods.length > 0 ? (
                        lesson.teaching_methods.map((method, i) => (
                            <Badge key={i} variant="secondary" className="px-2.5 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                {method}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground italic">{tFixed('common.none', 'None')}</p>
                    )}
                </div>
            </MemoSection>

            {/* Materials / Support */}
            <MemoSection title={tFixed('pages.prep.materials', 'Materials used')} icon={Hammer}>
                {lesson.used_materials && lesson.used_materials.length > 0 ? (
                    <ul className="space-y-2">
                        {lesson.used_materials.map((mat, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                                <MonitorPlay className="h-3.5 w-3.5 text-primary/70" />
                                <span>{mat}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground italic">{tFixed('common.none', 'None')}</p>
                )}
            </MemoSection>

            {/* References */}
            <MemoSection title={tFixed('pages.prep.references', 'References')} icon={Book}>
                {lesson.references && lesson.references.length > 0 ? (
                    <ul className="space-y-2">
                        {lesson.references.map((ref, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/50 shrink-0" />
                                <span className="italic">{ref}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground italic">{tFixed('common.none', 'None')}</p>
                )}
            </MemoSection>
        </div>
    )
}

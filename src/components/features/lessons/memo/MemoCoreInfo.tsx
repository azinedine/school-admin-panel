import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { GraduationCap, Hash, Layers, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoSection } from './MemoSection'

interface MemoCoreInfoProps {
    lesson: LessonPreparation
    language: string
}

export function MemoCoreInfo({ lesson, language }: MemoCoreInfoProps) {
    const { t } = useTranslation()

    // Helper for fixed translations
    const tFixed = (key: string, defaultValue: string) => {
        return t(key, defaultValue) as string
    }

    const coreFields = [
        {
            label: tFixed('pages.prep.domain', 'Domain'),
            value: lesson.domain,
            icon: Layers
        },
        {
            label: tFixed('pages.prep.learningUnit', 'Learning Unit'),
            value: lesson.learning_unit,
            icon: Library
        },
        {
            label: tFixed('pages.prep.knowledgeResource', 'Knowledge Resource'),
            value: lesson.knowledge_resource,
            icon: GraduationCap
        },
        {
            label: tFixed('pages.prep.targetedKnowledge', 'Targeted Knowledge'),
            value: Array.isArray(lesson.targeted_knowledge)
                ? lesson.targeted_knowledge.join(', ') // targeted_knowledge is string[]
                : '',
            icon: Hash,
            fullWidth: true
        }
    ]

    return (
        <MemoSection
            title={tFixed('pages.prep.coreInfo', 'Core Information')}
            className="mb-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {coreFields.map((field, i) => (
                    <div key={i} className={field.fullWidth ? "md:col-span-2" : ""}>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <field.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {field.label}
                                </p>
                                <p className="text-sm md:text-base font-medium text-foreground leading-normal">
                                    {field.value || <span className="text-muted-foreground/40 italic">-</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Targeted Knowledge Tags (Visual) */}
            {lesson.targeted_knowledge && lesson.targeted_knowledge.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border/40">
                    <div className="flex flex-wrap gap-2">
                        {lesson.targeted_knowledge.map((topic, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-sm font-medium border border-secondary"
                            >
                                # {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </MemoSection>
    )
}

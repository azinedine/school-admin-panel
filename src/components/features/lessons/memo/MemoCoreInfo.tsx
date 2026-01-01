import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { GraduationCap, Hash, Layers, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MemoSection } from './MemoSection'

interface MemoCoreInfoProps {
    lesson: LessonPreparation
}

export function MemoCoreInfo({ lesson }: MemoCoreInfoProps) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreFields.map((field, i) => (
                    <div key={i} className={`${field.fullWidth ? "md:col-span-2" : ""} group`}>
                        <div className="flex items-start gap-4 p-4 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="mt-1 h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <field.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {field.label}
                                </p>
                                <p className="text-base md:text-lg font-medium text-slate-900 leading-snug">
                                    {field.value || <span className="text-slate-300 italic">-</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Targeted Knowledge Tags (Visual) */}
            {lesson.targeted_knowledge && lesson.targeted_knowledge.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {tFixed('pages.prep.keywords', 'Keywords & Topics')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {lesson.targeted_knowledge.map((topic, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 shadow-sm"
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

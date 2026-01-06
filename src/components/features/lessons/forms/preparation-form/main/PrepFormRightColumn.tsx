import { type Control, type UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { PhaseEditor } from '../../phase-editor'
import { LessonPrepElements } from '../sections/lesson-prep-elements'
import { LessonPrepNotes } from '../sections/lesson-prep-notes'

interface PrepFormRightColumnProps {
    control: Control<LessonPreparationFormData>
    watch: UseFormWatch<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function PrepFormRightColumn({
    control,
    watch,
    isLoading,
    language,
}: PrepFormRightColumnProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="lg:col-span-8 space-y-6">
            <div className="space-y-6">
                <PhaseEditor
                    control={control}
                    isLoading={isLoading}
                    language={language}
                    totalDuration={watch('duration_minutes')}
                />

                {/* Section Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-dashed border-muted-foreground/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground font-semibold tracking-widest">
                            {t('pages.prep.additionalContent', 'Additional Content')}
                        </span>
                    </div>
                </div>

                <LessonPrepElements
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />

                <LessonPrepNotes
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
            </div>
        </div>
    )
}

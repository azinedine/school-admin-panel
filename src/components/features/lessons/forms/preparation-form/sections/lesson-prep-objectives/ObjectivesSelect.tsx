import { type Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useLearningObjectives } from '@/hooks/use-learning-objectives'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

interface ObjectivesSelectProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function ObjectivesSelect({
    control,
    isLoading,
    language,
}: ObjectivesSelectProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = (language || i18n.language) === 'ar'

    const { data: objectivesList = [], isLoading: loadingObjectives } = useLearningObjectives()

    const objectiveOptions = objectivesList.map((o) => ({
        value: o.name,
        label: isRTL ? o.name_ar || o.name : o.name,
    }))

    return (
        <div className="space-y-2">
            <Controller
                control={control}
                name="learning_objectives"
                render={({ field }) => (
                    <MultiSelectField
                        label={t('pages.prep.selectObjectives', 'Select learning objectives...')}
                        placeholder={t('pages.prep.objectivePlaceholder', 'Select objectives...')}
                        options={objectiveOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        disabled={isLoading || loadingObjectives}
                    />
                )}
            />
        </div>
    )
}

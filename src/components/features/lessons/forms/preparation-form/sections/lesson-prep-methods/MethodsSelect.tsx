import { type Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useTeachingMethods } from '@/hooks/use-teaching-methods'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

interface MethodsSelectProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function MethodsSelect({
    control,
    isLoading,
    language,
}: MethodsSelectProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = (language || i18n.language) === 'ar'

    const { data: methodsList = [], isLoading: loadingMethods } = useTeachingMethods()

    const methodOptions = methodsList.map((m) => ({
        value: m.name,
        label: isRTL ? m.name_ar || m.name : m.name,
    }))

    return (
        <div className="space-y-2">
            <Controller
                control={control}
                name="teaching_methods"
                render={({ field }) => (
                    <MultiSelectField
                        label={t('pages.prep.selectMethods', 'Select teaching methods...')}
                        placeholder={t('pages.prep.methodPlaceholder', 'Select methods...')}
                        options={methodOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        disabled={isLoading || loadingMethods}
                    />
                )}
            />
        </div>
    )
}

import { type Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useReferences } from '@/hooks/use-references'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

interface SupportReferencesSelectProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function SupportReferencesSelect({
    control,
    isLoading,
    language,
}: SupportReferencesSelectProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = (language || i18n.language) === 'ar'

    const { data: referencesList = [], isLoading: loadingReferences } = useReferences()

    const referenceOptions = referencesList.map((r) => ({
        value: r.name,
        label: isRTL ? r.name_ar || r.name : r.name,
    }))

    return (
        <div className="space-y-2">
            <Controller
                control={control}
                name="references"
                render={({ field }) => (
                    <MultiSelectField
                        label={t('pages.prep.references', 'References')}
                        placeholder={t('pages.prep.selectReferences', 'Select references...')}
                        options={referenceOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        disabled={isLoading || loadingReferences}
                    />
                )}
            />
        </div>
    )
}

import { type Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useMaterials } from '@/hooks/use-materials'
import { MultiSelectField } from '@/components/ui/form-fields'

interface SupportMaterialsSelectProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function SupportMaterialsSelect({
    control,
    isLoading,
    language,
}: SupportMaterialsSelectProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = (language || i18n.language) === 'ar'

    const { data: materialsList = [], isLoading: loadingMaterials } = useMaterials()

    const materialOptions = materialsList.map((m) => ({
        value: m.name,
        label: isRTL ? m.name_ar || m.name : m.name,
    }))

    return (
        <div className="space-y-2">
            <Controller
                control={control}
                name="used_materials"
                render={({ field }) => (
                    <MultiSelectField
                        label={t('pages.prep.usedMaterials', 'Used Materials')}
                        placeholder={t('pages.prep.selectMaterials', 'Select materials...')}
                        options={materialOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        disabled={isLoading || loadingMaterials}
                    />
                )}
            />
        </div>
    )
}

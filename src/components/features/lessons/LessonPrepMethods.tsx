import { type Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useTeachingMethods } from '@/hooks/use-teaching-methods'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

interface LessonPrepMethodsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepMethods({
    control,
    isLoading,
    language,
}: LessonPrepMethodsProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = (language || i18n.language) === 'ar'

    // Fetch methods from API
    const { data: methodsList = [], isLoading: loadingMethods } = useTeachingMethods()

    // Transform methods to options for MultiSelect
    const methodOptions = methodsList.map(m => ({
        value: m.name,
        label: isRTL ? (m.name_ar || m.name) : m.name,
    }))

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Users className="h-5 w-5 text-emerald-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.teachingMethods', 'Teaching Methods')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
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
            </CardContent>
        </Card>
    )
}

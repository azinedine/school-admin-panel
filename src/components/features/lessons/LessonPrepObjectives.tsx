import { type Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useLearningObjectives } from '@/hooks/use-learning-objectives'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

interface LessonPrepObjectivesProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepObjectives({
    control,
    isLoading,
    language,
}: LessonPrepObjectivesProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = (language || i18n.language) === 'ar'

    // Fetch objectives from API
    const { data: objectivesList = [], isLoading: loadingObjectives } = useLearningObjectives()

    // Transform objectives to options for MultiSelect
    const objectiveOptions = objectivesList.map(o => ({
        value: o.name,
        label: isRTL ? (o.name_ar || o.name) : o.name,
    }))

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.learningObjectives', 'Learning Objectives')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
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
            </CardContent>
        </Card>
    )
}

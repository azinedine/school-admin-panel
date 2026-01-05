import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { SupportMaterialsSelect } from './SupportMaterialsSelect'
import { SupportReferencesSelect } from './SupportReferencesSelect'
import { SupportKnowledgeList } from './SupportKnowledgeList'

interface LessonSupportMaterialProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonSupportMaterial({
    control,
    isLoading,
    language,
}: LessonSupportMaterialProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Layers className="h-5 w-5 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.supportMaterial', 'Support Material')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Used Materials */}
                <SupportMaterialsSelect
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />

                <div className="h-px bg-border/50" />

                {/* References */}
                <SupportReferencesSelect
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />

                <div className="h-px bg-border/50" />

                {/* Targeted Knowledge */}
                <SupportKnowledgeList
                    control={control}
                    isLoading={isLoading}
                    language={language}
                />
            </CardContent>
        </Card>
    )
}

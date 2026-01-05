import { useTranslation } from 'react-i18next'
import { Target } from 'lucide-react'
import { CardHeader, CardTitle } from '@/components/ui/card'

interface ObjectivesHeaderProps {
    language?: string
}

export function ObjectivesHeader({ language }: ObjectivesHeaderProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
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
    )
}

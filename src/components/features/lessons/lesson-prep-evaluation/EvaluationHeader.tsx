import { useTranslation } from 'react-i18next'
import { GraduationCap } from 'lucide-react'
import { CardHeader, CardTitle } from '@/components/ui/card'

interface EvaluationHeaderProps {
    language?: string
}

export function EvaluationHeader({ language }: EvaluationHeaderProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.evaluation', 'Evaluation')}
                    </CardTitle>
                </div>
            </div>
        </CardHeader>
    )
}

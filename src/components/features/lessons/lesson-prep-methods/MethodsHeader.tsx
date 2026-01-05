import { useTranslation } from 'react-i18next'
import { Users } from 'lucide-react'
import { CardHeader, CardTitle } from '@/components/ui/card'

interface MethodsHeaderProps {
    language?: string
}

export function MethodsHeader({ language }: MethodsHeaderProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
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
    )
}

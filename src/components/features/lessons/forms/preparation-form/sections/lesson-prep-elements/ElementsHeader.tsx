import { useTranslation } from 'react-i18next'
import { Plus, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'

interface ElementsHeaderProps {
    onAdd: () => void
    isLoading?: boolean
    language?: string
}

export function ElementsHeader({ onAdd, isLoading, language }: ElementsHeaderProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <List className="h-5 w-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.lessonElements.title', 'Lesson Elements')}
                    </CardTitle>
                </div>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={onAdd}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('pages.prep.lessonElements.addElement', 'Add Element')}
                </Button>
            </div>
        </CardHeader>
    )
}

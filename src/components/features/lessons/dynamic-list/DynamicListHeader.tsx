import { useTranslation } from 'react-i18next'
import { Plus, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DynamicListHeaderProps {
    label: string
    icon: LucideIcon
    onAdd: () => void
    isLoading?: boolean
    language?: string
}

export function DynamicListHeader({
    label,
    icon: Icon,
    onAdd,
    isLoading,
    language,
}: DynamicListHeaderProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
            </h3>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAdd}
                disabled={isLoading}
                className="text-primary hover:text-primary/80 hover:bg-primary/5"
            >
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add', 'Add')}
            </Button>
        </div>
    )
}

import { useTranslation } from 'react-i18next'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ViewDialogHeaderProps {
    title: string
    status: 'draft' | 'published'
    academicYear: string
}

export function ViewDialogHeader({
    title,
    status,
    academicYear,
}: ViewDialogHeaderProps) {
    const { t } = useTranslation()

    const statusConfig = {
        draft: {
            label: t('lessons.status.draft', 'Draft'),
            className:
                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        },
        published: {
            label: t('lessons.status.published', 'Published'),
            className:
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
    }

    const statusInfo = statusConfig[status]

    return (
        <DialogHeader className="pb-0">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge className={cn('font-medium', statusInfo.className)}>
                            {statusInfo.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{academicYear}</span>
                    </div>
                </div>
            </div>
        </DialogHeader>
    )
}

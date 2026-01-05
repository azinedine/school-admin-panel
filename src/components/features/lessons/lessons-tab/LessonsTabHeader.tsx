import { useTranslation } from 'react-i18next'
import { Search, Library } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface LessonsTabHeaderProps {
    searchQuery: string
    onSearchChange: (value: string) => void
}

export function LessonsTabHeader({
    searchQuery,
    onSearchChange,
}: LessonsTabHeaderProps) {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Library className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">
                        {t('lessons.library', 'Lesson Library')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t('lessons.librarySubtitle', 'Browse ready-to-teach lessons')}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('common.search', 'Search library...')}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
        </div>
    )
}

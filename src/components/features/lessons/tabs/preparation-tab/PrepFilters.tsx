import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { StatusFilter } from './use-preparation-tab.ts'
import type { TFunction } from 'i18next'

interface PrepFiltersProps {
    t: TFunction
    searchQuery: string
    onSearchChange: (value: string) => void
    statusFilter: StatusFilter
    onStatusChange: (value: StatusFilter) => void
    statusCounts: Record<StatusFilter, number>
}

/**
 * Single Responsibility: Search and status filter controls
 */
export function PrepFilters({
    t,
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    statusCounts,
}: PrepFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('common.search', 'Search preparations...')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 bg-background"
                />
            </div>
            <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        {t('common.all', 'All Status')}{' '}
                        <span className="text-muted-foreground ml-1">({statusCounts.all})</span>
                    </SelectItem>
                    <SelectItem value="draft">
                        {t('pages.prep.status.draft', 'Draft')}{' '}
                        <span className="text-muted-foreground ml-1">({statusCounts.draft})</span>
                    </SelectItem>
                    <SelectItem value="ready">
                        {t('pages.prep.status.ready', 'Ready')}{' '}
                        <span className="text-muted-foreground ml-1">({statusCounts.ready})</span>
                    </SelectItem>
                    <SelectItem value="delivered">
                        {t('pages.prep.status.delivered', 'Delivered')}{' '}
                        <span className="text-muted-foreground ml-1">
                            ({statusCounts.delivered})
                        </span>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
